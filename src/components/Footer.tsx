import { Logo } from "./Logo";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#FAD4E8] via-[#F5C5DC] to-[#D4AF37] text-[#1A1A1A] overflow-hidden">
      {/* Floral pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <pattern id="floral-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="15" fill="#FFFFFF" />
              <circle cx="60" cy="20" r="10" fill="#FFFFFF" />
              <circle cx="20" cy="60" r="12" fill="#FFFFFF" />
              <circle cx="60" cy="60" r="8" fill="#FFFFFF" />
            </pattern>
          </defs>
          <rect width="400" height="200" fill="url(#floral-pattern)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-white/85 shadow-[0_12px_30px_rgba(0,0,0,0.12)]">
                <Logo className="w-10 h-10" />
              </div>
              <div>
                <div className="text-xl font-playfair">Jagdish Flowers</div>
                <div className="text-sm">& Decorations</div>
              </div>
            </div>
            <p className="text-[#1A1A1A]/80 leading-relaxed">
              Making your special moments unforgettable with beautiful flowers and elegant decorations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg mb-4 font-playfair">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('home')} className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('services')} className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('gallery')} className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">
                  Gallery
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('contact')} className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg mb-4 font-playfair">Our Services</h4>
            <ul className="space-y-2 text-[#1A1A1A]/80">
              <li>Wedding Decoration</li>
              <li>Stage Setup</li>
              <li>Car Decoration</li>
              <li>Mandap Decoration</li>
              <li>Home Decoration</li>
              <li>Event Setup</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg mb-4 font-playfair">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Near+Mahadev+Choraha+Dibai+Bulandshahr+203393"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors text-sm"
                >
                  Near Mahadev Choraha, Dibai, Bulandshahr - 203393
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <a href="tel:+919528371089" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors text-sm">
                  +91 95283 71089
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:contact@jagdishflowers.com" className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors text-sm">
                  contact@jagdishflowers.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 flex-shrink-0" />
                <a 
                  href="https://wa.me/919528371089" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#1A1A1A]/80 hover:text-[#1A1A1A] transition-colors text-sm"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#1A1A1A]/20 mb-8" />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[#1A1A1A]/80">
            © {new Date().getFullYear()} Jagdish Flowers & Decorations. All Rights Reserved.
          </p>
          <p className="text-sm text-[#1A1A1A]/60 mt-2">
            Crafted with love for beautiful celebrations
          </p>
        </div>
      </div>
    </footer>
  );
}
