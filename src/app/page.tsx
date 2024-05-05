import { Navbar } from "../components/navbar";
import MainContent from "~/components/mainContent";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Navbar />
        <MainContent />
    </main>
  );
}
