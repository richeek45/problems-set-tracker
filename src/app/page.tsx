import MainContent from "~/components/mainContent";
import { Navbar } from "~/components/navbar";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar />
      <MainContent />
    </main>
  );
}
