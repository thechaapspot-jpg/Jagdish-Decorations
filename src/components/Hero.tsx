import { Phone, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { MusicButton } from "./MusicButton";

export function Hero() {

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1684243920725-956d93ff391a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvd2VyJTIwZGVjb3JhdGlvbnxlbnwxfHx8fDE3NjMwNDg2MTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Wedding flower decoration"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-20">
        <div className="flex items-center gap-3">
          <Logo className="w-14 h-14 md:w-16 md:h-16" />
          <div className="text-white">
            <div className="text-xl md:text-2xl font-playfair">Jagdish Flowers</div>
            <div className="text-sm opacity-90">& Decorations</div>
          </div>
        </div>
      </div>

      {/* Music Button - Only in Hero Section */}
      <MusicButton variant="hero" />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-6 font-playfair">
          Beautiful Flowers.<br />
          <span className="text-[#FAD4E8]">Elegant Decorations.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
          Making your special moments unforgettable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            className="bg-[#D4AF37] hover:bg-[#C49F27] text-white px-8 py-6 text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => window.location.href = 'tel:+919528371089'}
          >
            <Phone className="mr-2 h-5 w-5" />
            Call Now
          </Button>
          <Button 
            size="lg"
            className="bg-[#FAD4E8] hover:bg-[#F5C5DC] text-[#1A1A1A] px-8 py-6 text-lg rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105"
            onClick={() => window.open('https://wa.me/919528371089', '_blank')}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            WhatsApp Us
          </Button>
        </div>
      </div>
    </section>
  );
}
