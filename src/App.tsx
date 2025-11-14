import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import AdminPanel from "./components/AdminPanel";
import { FullGallery } from "./pages/FullGallery";

function MainSite() {
  return (
    <div className="min-h-screen bg-white">
      <WhatsAppButton />
      <div id="home">
        <Hero />
      </div>
      <div id="services">
        <Services />
      </div>
      <div id="gallery">
        <Gallery />
      </div>
      <div id="about">
        <About />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Main Website */}
        <Route path="/" element={<MainSite />} />
        
        {/* Full Gallery Page */}
        <Route path="/gallery" element={<FullGallery />} />
        
        {/* Admin Panel - Single Page */}
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
