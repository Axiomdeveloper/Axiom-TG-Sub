import BackgroundFX from "@/components/BackgroundFX";
import ChannelBoard from "@/components/ChannelBoard";
import CopySub from "@/components/CopySub";
import Footer from "@/components/Footer";
import Guide from "@/components/Guide";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StarCta from "@/components/StarCta";
import StatsBento from "@/components/StatsBento";
import { getDashboardStats } from "@/lib/stats";
import { CHANNELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const d = await getDashboardStats();
  const channelsTotal = d.perChannel.length || CHANNELS.length;
  const channelsOk = d.synced ? d.perChannel.filter((c) => c.ok).length : 0;

  return (
    <div className="noise relative min-h-screen">
      <BackgroundFX />
      <Header synced={d.synced} lastRun={d.lastRun} />
      <main className="relative z-10">
        <Hero total={d.total} synced={d.synced} channels={[...CHANNELS]} />
        <StatsBento
          total={d.total}
          fresh24h={d.fresh24h}
          channelsOk={channelsOk}
          channelsTotal={channelsTotal}
          lastRun={d.lastRun}
          nextRun={d.nextRun}
          synced={d.synced}
        />
        <ChannelBoard channels={d.perChannel} synced={d.synced} />
        <CopySub />
        <Guide />
        <StarCta />
      </main>
      <Footer />
    </div>
  );
}
