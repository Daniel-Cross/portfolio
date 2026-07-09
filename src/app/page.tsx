import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="min-h-screen">
        <Hero />
      </main>
    </>
  );
}
