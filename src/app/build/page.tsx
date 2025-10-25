import { Header } from "@/components/shared/Header";
import { ResumeBuilder } from "@/components/builder/ResumeBuilder";

export default function BuildPage() {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 overflow-hidden">
        <ResumeBuilder />
      </main>
    </div>
  );
}
