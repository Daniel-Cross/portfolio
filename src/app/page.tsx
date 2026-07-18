import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ComponentLab } from "@/components/lab/component-lab";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { FactMachineShowcase } from "@/components/sections/FactMachineShowcase";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top" className="min-h-screen">
        <Hero />
        <Projects />
        <ComponentLab />
        <FactMachineShowcase />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
