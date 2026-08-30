export interface ChannelStat {
  /** Telegram username without @ */
  id: string;
  /** Configs currently in the rolling 48h archive authored by this channel */
  count: number;
  /** Configs harvested from messages of the last 24 hours */
  fresh: number;
  /** Whether the last scan reached the channel */
  ok: boolean;
  /** Short failure reason when !ok */
  error?: string | null;
}

export interface SubStats {
  version: 1;
  brand: "Axiom TG";
  /** ISO timestamp of the last GitHub Action run */
  lastRun: string | null;
  /** Total live configs in the subscription */
  total: number;
  /** Configs discovered within the last 24 hours */
  fresh24h: number;
  /** Subscriptions served so far (unique users) — merged server-side */
  users: number;
  /** Total number of subscription fetches */
  hits: number;
  updateEveryHours: number;
  retentionHours: number;
  perChannel: ChannelStat[];
}

export const CHANNELS = [
  "vpn_Click",
  "FreakConfig",
  "V2RAYROZ",
  "prrofile_purple",
  "V2rayBaaz",
  "V2rayNGX",
  "V2rayng_Fast",
  "v2ray26",
] as const;

export const UPDATE_EVERY_HOURS = 5;
export const RETENTION_HOURS = 48;
