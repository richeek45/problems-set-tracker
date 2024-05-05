import { Navbar } from "../components/navbar";
import MainContent from "~/components/mainContent";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
        <Navbar />
        <MainContent />
    </main>
  );
}
