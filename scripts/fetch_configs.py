#!/usr/bin/env python3
"""
Axiom TG — Telegram V2Ray config harvester.

Runs on GitHub Actions every 5 hours:
  1. Reads the public preview (t.me/s/<channel>) of the Telegram channels below.
  2. Keeps only configs posted within the last 24 hours.
  3. Renames every config's remark to «Axiom TG» (URI fragment + VMess `ps`).
  4. Merges them into a rolling 48-hour archive (older entries are pruned).
  5. Emits:
       sub/axiom_sub.txt   - base64-encoded V2Ray subscription
       sub/axiom_plain.txt - plain URI list
       stats.json          - totals / per-channel counts / user counters
       history/archive.json- rolling archive state (committed back to the repo)
       README.md           - stats block between AXIOM markers
  6. Optionally pushes the snapshot to the web dashboard
     (API route /api/ingest) when APP_URL + INGEST_SECRET are configured.

Usage:  python scripts/fetch_configs.py
"""
from __future__ import annotations

import base64
import html
import json
import os
import re
import sys
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

# ----------------------------------------------------------------------------- config

BRAND = "Axiom TG"
BRAND_FRAGMENT = "Axiom%20TG"
CHANNELS = [
    "vpn_Click",
    "FreakConfig",
    "V2RAYROZ",
    "prrofile_purple",
    "V2rayBaaz",
    "V2rayNGX",
    "V2rayng_Fast",
    "v2ray26",
]
SCAN_WINDOW = timedelta(hours=24)   # only messages from the last 24h are harvested
RETENTION = timedelta(hours=48)     # configs die 48h after discovery
REQUEST_DELAY = 1.3                  # be polite to telegram

BASE = Path(__file__).resolve().parent.parent
SUB_DIR = BASE / "sub"
ARCHIVE = BASE / "history" / "archive.json"
STATS_JSON = BASE / "stats.json"
README = BASE / "README.md"

UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
)

CONFIG_RE = re.compile(
    r"(?:vless|vmess|trojan|ss|ssr|tuic|hysteria2|hysteria|hy2|socks5|warp|wireguard)://[^\s<>\"'`«»\[\]\u200c]+",
    re.IGNORECASE,
)
TRAILING = ".,;:)]}>»،؛'\""

# ----------------------------------------------------------------------------- helpers


def b64unpad(s: str) -> bytes:
    return base64.b64decode(s.strip() + "=" * (-len(s.strip()) % 4))


def rename_vmess(base: str) -> str:
    """Set the ps (name) field of a base64 vmess payload."""
    payload = base[len("vmess://"):]
    try:
        obj = json.loads(b64unpad(payload).decode("utf-8"))
        obj["ps"] = BRAND
        raw = json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
        return "vmess://" + base64.b64encode(raw.encode()).decode()
    except Exception:
        return f"vmess://{payload}#{BRAND_FRAGMENT}"


def rename(link: str) -> tuple[str, str] | None:
    """Normalize + brand a config. Returns (dedup_key, branded_link)."""
    link = html.unescape(link).strip().rstrip(TRAILING)
    if "://" not in link:
        return None
    proto = link.split("://", 1)[0].lower()
    base = link.split("#", 1)[0]
    if proto == "vmess":
        branded = rename_vmess(base)
        key = branded[len("vmess://"):]
    else:
        branded = f"{base}#{BRAND_FRAGMENT}"
        key = base
    return key, branded


def load_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return default


# ----------------------------------------------------------------------------- scraping


def fetch_channel(session: requests.Session, channel: str, now: datetime):
    """Return (items, error). items = [(datetime, raw_config_str), ...] from last 24h."""
    url = f"https://t.me/s/{channel}"
    r = session.get(url, headers={"User-Agent": UA}, timeout=30)
    if r.status_code != 200:
        return [], f"HTTP {r.status_code}"
    soup = BeautifulSoup(r.text, "html.parser")
    msgs = soup.select("div.tgme_widget_message")
    if not msgs:
        return [], "channel hidden/empty in public preview"

    items = []
    for m in msgs:
        t = m.find("time")
        if not t or not t.get("datetime"):
            continue
        try:
            dt = datetime.fromisoformat(t["datetime"])
        except ValueError:
            continue
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        if now - dt > SCAN_WINDOW:
            continue
        raw = html.unescape(str(m))
        for match in CONFIG_RE.findall(raw):
            items.append((dt, match))
    return items, None


# ----------------------------------------------------------------------------- readme

RX_STATS_BLOCK = re.compile(
    re.escape("<!-- AXIOM:STATS:START -->") + r".*?" + re.escape("<!-- AXIOM:STATS:END -->"),
    re.DOTALL,
)


def update_readme(stats: dict) -> None:
    if not README.exists():
        return
    txt = README.read_text(encoding="utf-8")
    lines = [
        "| کانال (Channel) | کانفیگ‌ها | تازه‌ی ۲۴س | وضعیت / Status |",
        "|---|---:|---:|:---:|",
    ]
    for c in stats["perChannel"]:
        status = "OK" if c["ok"] else f"FAIL ({c.get('error') or 'error'})"
        lines.append(f"| `@{c['id']}` | {c['count']} | {c['fresh']} | {status} |")

    block = f"""<!-- AXIOM:STATS:START -->
> این بخش به‌صورت خودکار توسط GitHub Action بازنویسی می‌شود / Auto-regenerated by CI.

**آخرین به‌روزرسانی / Last update (UTC):** `{stats["lastRun"]}`
**مجموع کانفیگ‌ها:** **{stats["total"]}** · **تازه‌ی ۲۴ ساعته:** **{stats["fresh24h"]}** · **چرخه‌ی نگهداری:** ۴۸ ساعت · **کانال‌های سالم:** {sum(1 for c in stats["perChannel"] if c["ok"])}/{len(stats["perChannel"])}

{chr(10).join(lines)}
<!-- AXIOM:STATS:END -->"""

    if RX_STATS_BLOCK.search(txt):
        txt = RX_STATS_BLOCK.sub(lambda _: block, txt)
    else:
        txt = txt.rstrip() + "\n\n" + block + "\n"
    README.write_text(txt, encoding="utf-8")


# ----------------------------------------------------------------------------- main


def main() -> int:
    now = datetime.now(timezone.utc)
    now_ts = int(now.timestamp())
    print(f"::group::Axiom TG harvester — {now.isoformat(timespec='seconds')}")

    session = requests.Session()

    # ---- rolling archive: load + prune everything older than RETENTION (48h)
    archive = load_json(ARCHIVE, {"version": 1, "entries": []})
    entries = [
        e for e in archive.get("entries", [])
        if now_ts - int(e.get("firstSeen", now_ts)) <= RETENTION.total_seconds()
    ]
    pruned = len(archive.get("entries", [])) - len(entries)
    keys = {e["key"] for e in entries}
    print(f"archive: {len(entries)} kept, {pruned} pruned (>{RETENTION})")

    per_channel: dict[str, dict] = {
        ch: {"id": ch, "count": 0, "fresh": 0, "ok": True, "error": None} for ch in CHANNELS
    }
    fresh_keys: set[str] = set()  # unique configs spotted in last-24h posts (any channel)

    # ---- harvest each channel
    for ch in CHANNELS:
        try:
            items, err = fetch_channel(session, ch, now)
        except Exception as exc:  # network blew up on one channel — keep going
            items, err = [], f"{type(exc).__name__}: {exc}"
        if err:
            per_channel[ch]["ok"] = False
            per_channel[ch]["error"] = err
            print(f"  @{ch:<16} scan FAILED: {err}")
        else:
            print(f"  @{ch:<16} 24h messages scanned, {len(items)} config hits")

        seen_here: set[str] = set()
        for dt, raw_link in items:
            renamed = rename(raw_link)
            if not renamed:
                continue
            key, branded = renamed
            if key in seen_here:
                continue
            seen_here.add(key)
            per_channel[ch]["fresh"] += 1
            fresh_keys.add(key)
            if key not in keys:
                keys.add(key)
                entries.append(
                    {
                        "key": key,
                        "config": branded,
                        "channel": ch,
                        "protocol": branded.split("://", 1)[0].lower(),
                        "firstSeen": now_ts,
                        "src": int(dt.timestamp()),
                    }
                )
        time.sleep(REQUEST_DELAY)

    # ---- final aggregation
    entries.sort(key=lambda e: e["firstSeen"], reverse=True)
    for e in entries:
        bucket = per_channel.get(e["channel"])
        if bucket:
            bucket["count"] += 1
    total = len(entries)
    fresh = len(fresh_keys)  # unique fresh configs across all channels

    lines = [e["config"] for e in entries]
    plain = "\n".join(lines)
    b64sub = base64.b64encode(plain.encode()).decode()

    SUB_DIR.mkdir(parents=True, exist_ok=True)
    (SUB_DIR / "axiom_sub.txt").write_text(b64sub + "\n", encoding="utf-8")
    (SUB_DIR / "axiom_plain.txt").write_text(plain + "\n", encoding="utf-8")

    # previous user counters (dashboard keeps the authoritative numbers)
    prev = load_json(STATS_JSON, {})

    stats = {
        "version": 1,
        "brand": BRAND,
        "lastRun": now.isoformat(timespec="seconds"),
        "total": total,
        "fresh24h": fresh,
        "users": int(prev.get("users", 0)),
        "hits": int(prev.get("hits", 0)),
        "updateEveryHours": 5,
        "retentionHours": int(RETENTION.total_seconds() // 3600),
        "perChannel": list(per_channel.values()),
    }

    # ---- optional: push snapshot to the web dashboard
    app_url = (os.environ.get("APP_URL") or "").strip().rstrip("/")
    secret = (os.environ.get("INGEST_SECRET") or "").strip()
    if app_url and secret:
        try:
            resp = session.post(
                f"{app_url}/api/ingest",
                json={"plain": plain, "stats": stats},
                headers={"Authorization": f"Bearer {secret}"},
                timeout=40,
            )
            j = resp.json()
            stats["users"] = int(j.get("uniqueUsers", stats["users"]))
            stats["hits"] = int(j.get("totalHits", stats["hits"]))
            print(f"pushed to dashboard: HTTP {resp.status_code} — users={stats['users']} hits={stats['hits']}")
        except Exception as exc:
            print(f"::warning::dashboard push failed: {exc}")
    else:
        print("APP_URL/INGEST_SECRET not set — skipping dashboard push")

    STATS_JSON.write_text(json.dumps(stats, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    ARCHIVE.parent.mkdir(parents=True, exist_ok=True)
    ARCHIVE.write_text(json.dumps({"version": 1, "entries": entries}, ensure_ascii=False), encoding="utf-8")

    update_readme(stats)

    # ---- job summary for the Actions UI
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        rows = "\n".join(f"| `@{c['id']}` | {c['count']} | {c['fresh']} | {'OK' if c['ok'] else 'FAIL'} |"
                         for c in stats["perChannel"])
        with open(summary, "a", encoding="utf-8") as f:
            f.write(
                f"## Axiom TG — {stats['total']} configs (fresh 24h: {stats['fresh24h']})\n\n"
                f"| Channel | Configs | Fresh | Status |\n|---|---:|---:|:---:|\n{rows}\n"
            )

    print(f"RESULT: total={total} fresh24h={fresh} per-channel={[ (c['id'], c['count']) for c in stats['perChannel'] ]}")
    print("::endgroup::")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        sys.exit(130)
    except Exception as exc:
        print(f"::error::fatal: {exc}")
        sys.exit(1)
