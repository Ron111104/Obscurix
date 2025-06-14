import RedactifyPage from "@/components/Redactify";
import Navbar from "@/components/Navbar";

export default function RedactifyRoutePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <RedactifyPage />
    </div>
  );
}
