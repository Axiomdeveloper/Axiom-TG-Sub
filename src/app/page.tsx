import BackgroundFX from "@/components/BackgroundFX";
import ChannelBoard from "@/components/ChannelBoard";
import CopySub from "@/components/CopySub";
import Footer from "@/components/Footer";
import Guide from "@/components/Guide";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsBento from "@/components/StatsBento";
import { getDashboardStats } from "@/lib/stats";
import { CHANNELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const d = await getDashboardStats();

  return (
    <div className="noise relative min-h-screen">
      <BackgroundFX />
      <Header synced={d.synced} lastRun={d.lastRun} />
      <main className="relative z-10">
        <Hero total={d.total} synced={d.synced} channels={[...CHANNELS]} />
        <StatsBento
          total={d.total}
          fresh24h={d.fresh24h}
          users={d.users}
          hits={d.hits}
          lastRun={d.lastRun}
          nextRun={d.nextRun}
          synced={d.synced}
        />
        <ChannelBoard channels={d.perChannel} synced={d.synced} />
        <CopySub />
        <Guide />
      </main>
      <Footer />
    </div>
  );
}
