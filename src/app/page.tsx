import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { SocialProof } from "@/components/sections/SocialProof";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="min-h-screen">
        <Hero />
        <Projects />
        <About />
        <Skills />
        <SocialProof />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
