import Navbar from "@/components/NavBar";
import Hero from "@/components/Hero";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import InteractiveShowcase from "@/components/InteractiveShowcase";
import AIChat from "@/components/AIChat";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-24 overflow-hidden">
        <Hero />
        <Experience />
        <Skills />
        <InteractiveShowcase />
        
        {/* Footer */}
        <footer className="mt-32 py-8 border-t border-black/10 dark:border-white/10 text-center">
          <p className="text-black/50 dark:text-white/50 text-sm">
            © {new Date().getFullYear()} Vamsi Krishna Vissapragada. Built with Next.js & Tailwind CSS.
          </p>
        </footer>
      </main>
      
      {/* AI Chat Widget */}
      <AIChat />
    </>
  );
}
