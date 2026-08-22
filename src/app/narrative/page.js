import data from "@/data/data";
import NarrativeTimeline from "@/components/narrative/NarrativeTimeline";

export const metadata = {
  title: `${data.personal.name} | The Narrative`,
  description: `${data.personal.narrativeTagline}. A chronological journey through physics, robotics, AI research, and strategic leadership.`,
  alternates: { canonical: "/narrative" },
  openGraph: {
    title: `${data.personal.name} | The Narrative`,
    description: data.personal.narrativeTagline,
    url: `https://${data.personal.domain}/narrative`,
  },
};

export default function Page() {
  return (
    <div className="pt-24">
      <NarrativeTimeline />
    </div>
  );
}
