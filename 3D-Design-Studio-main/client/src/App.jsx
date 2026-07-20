// import React, { useState, useEffect } from "react";
// import Navbar from "./components/common/Navbar";
// import HeroSection from "./components/common/HeroSection";
// import PresetsSection from "./components/common/PresetsSection";
// import WorkflowSection from "./components/common/WorkflowSection";
// import CompareMatrix from "./components/common/CompareMatrix";
// import { AnimatedTestimonials } from "./components/ui/animated-testimonials";
// import Footer from "./components/common/Footer";
// import ScrollReveal from "./components/common/ScrollReveal";
// import FeaturesHeroSection from "./components/common/FeaturesHeroSection";
// import ProToolsSection from "./components/common/ProTool";
// import TemplatesShowcase from "./components/common/Template";
// import PricingSection from "./components/common/Pricing";
// import Builder from "./components/common/Builder";

// const testimonialData = [
//   {
//     quote:
//       "I had a portfolio site idea for 2 years. Draftly built it in 8 minutes. I launched the same day.",
//     name: "Kenji Nakamura",
//     designation: "UI Designer",
//     src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
//   },
//   {
//     quote:
//       "This platform completely transformed how our team handles production deployments. The speed and reliability improvements were noticeable from day one.",
//     name: "Sarah Chen",
//     designation: "VP of Engineering at CloudSync",
//     src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
//   },
//   {
//     quote:
//       "The ease of use is simply mind-blowing. Our design-to-code workflow is now twice as fast and error-free.",
//     name: "Marcus Sterling",
//     designation: "Product Designer at LinearFlow",
//     src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
//   },
//   {
//     quote:
//       "Implementation was incredibly smooth. We expected days of configuration, but we were up and running in under an hour.",
//     name: "Elena Rostova",
//     designation: "Infrastructure Lead at NexusData",
//     src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
//   },
// ];

// export default function App() {
//   const [currentHash, setCurrentHash] = useState(window.location.hash || "#");

//   useEffect(() => {
//     const handleHashChange = () => {
//       setCurrentHash(window.location.hash || "#");
//       // Handle smooth scrolling if landing page section is requested
//       const hash = window.location.hash;
//       if (hash && hash !== "#3d-builder") {
//         const target = document.querySelector(hash);
//         if (target) {
//           target.scrollIntoView({ behavior: "smooth" });
//         }
//       }
//     };

//     window.addEventListener("hashchange", handleHashChange);
//     // Smooth scroll check on load
//     if (window.location.hash && window.location.hash !== "#3d-builder") {
//       setTimeout(() => {
//         const target = document.querySelector(window.location.hash);
//         if (target) target.scrollIntoView({ behavior: "smooth" });
//       }, 300);
//     }
//     return () => window.removeEventListener("hashchange", handleHashChange);
//   }, []);

//   if (currentHash === "#3d-builder") {
//     return <Builder />;
//   }

//   return (
//     <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden antialiased selection:bg-zinc-800">

//       {/* Global Background Styling Atmosphere */}
//       <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

//       <Navbar />

//       <HeroSection />

//       <main className="bg-black min-h-screen space-y-20">
//         {/* Scroll Activated Sections */}
//         <ScrollReveal>
//           <TemplatesShowcase />
//         </ScrollReveal>

//         <ScrollReveal>
//           <AnimatedTestimonials testimonials={testimonialData} />
//         </ScrollReveal>

//         <ScrollReveal>
//           <WorkflowSection />
//         </ScrollReveal>

//         <ScrollReveal>
//           <ProToolsSection />
//         </ScrollReveal>

//         <ScrollReveal>
//           <PricingSection />
//         </ScrollReveal>
//       </main>

//       <Footer />

//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import Navbar from "./components/common/Navbar";
import HeroSection from "./components/common/HeroSection";
import PresetsSection from "./components/common/PresetsSection";
import WorkflowSection from "./components/common/WorkflowSection";
import CompareMatrix from "./components/common/CompareMatrix";
import { AnimatedTestimonials } from "./components/ui/animated-testimonials";
import Footer from "./components/common/Footer";
import ScrollReveal from "./components/common/ScrollReveal";
import FeaturesHeroSection from "./components/common/FeaturesHeroSection";
import ProToolsSection from "./components/common/ProTool";
import TemplatesShowcase from "./components/common/Template";
import PricingSection from "./components/common/Pricing";
import Builder from "./components/common/Builder";

const testimonialData = [
  {
    quote:
      "I had a portfolio site idea for 2 years. Draftly built it in 8 minutes. I launched the same day.",
    name: "Kenji Nakamura",
    designation: "UI Designer",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
  },
  {
    quote:
      "This platform completely transformed how our team handles production deployments. The speed and reliability improvements were noticeable from day one.",
    name: "Sarah Chen",
    designation: "VP of Engineering at CloudSync",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500&auto=format&fit=crop",
  },
  {
    quote:
      "The ease of use is simply mind-blowing. Our design-to-code workflow is now twice as fast and error-free.",
    name: "Marcus Sterling",
    designation: "Product Designer at LinearFlow",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
  },
  {
    quote:
      "Implementation was incredibly smooth. We expected days of configuration, but we were up and running in under an hour.",
    name: "Elena Rostova",
    designation: "Infrastructure Lead at NexusData",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
  },
];

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#");

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#");
      const hash = window.location.hash;
      if (hash && hash !== "#3d-builder") {
        const target = document.querySelector(hash);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    
    // Smooth scroll check on initial load
    if (window.location.hash && window.location.hash !== "#3d-builder") {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  if (currentHash === "#3d-builder") {
    return <Builder />;
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden antialiased selection:bg-zinc-800">

      {/* Global Background Styling Atmosphere */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293708_1px,transparent_1px),linear-gradient(to_bottom,#1f293708_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      <Navbar />

      <div id="home">
        <HeroSection />
      </div>

      <main className="bg-black min-h-screen space-y-20">
        
        {/* Features Section */}
        <div id="features">
          <ScrollReveal>
            <FeaturesHeroSection />
          </ScrollReveal>
          <ScrollReveal>
            <ProToolsSection />
          </ScrollReveal>
        </div>

        {/* Presets / Templates Section */}
        <div id="presets">
          <ScrollReveal>
            <TemplatesShowcase />
          </ScrollReveal>
          <ScrollReveal>
            <PresetsSection />
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <AnimatedTestimonials testimonials={testimonialData} />
        </ScrollReveal>

        {/* Blog / Compare Matrix (Optional section) */}
        <div id="blog">
          <ScrollReveal>
            <CompareMatrix />
          </ScrollReveal>
        </div>

        {/* Pricing Section */}
        <div id="pricing">
          <ScrollReveal>
            <PricingSection />
          </ScrollReveal>
        </div>

        {/* Contact / Workflow Section */}
        <div id="contact">
          <ScrollReveal>
            <WorkflowSection />
          </ScrollReveal>
        </div>

      </main>

      <Footer />

    </div>
  );
}