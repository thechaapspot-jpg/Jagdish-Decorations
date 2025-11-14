import { MessageCircle, Flower2, Car, Church, Home, Heart, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

const services = [
  {
    icon: Church,
    title: "Wedding Stage Decoration",
    description: "Stunning stage setups that create the perfect backdrop for your wedding ceremony.",
    color: "from-[#FAD4E8] to-[#F5C5DC]",
    whatsappMsg: "Hey! I want to talk about your Wedding Stage Decoration service.",
  },
  {
    icon: Flower2,
    title: "Flower Decoration",
    description: "Premium fresh flower arrangements for all occasions, crafted with elegance.",
    color: "from-[#D4AF37] to-[#C49F27]",
    whatsappMsg: "Hey! I want to talk about your Flower Decoration service.",
  },
  {
    icon: Car,
    title: "Car Decoration for Weddings",
    description: "Beautiful floral car decorations to add charm to your wedding procession.",
    color: "from-[#FAD4E8] to-[#F5C5DC]",
    whatsappMsg: "Hey! I want to talk about your Car Decoration for Weddings service.",
  },
  {
    icon: Sparkles,
    title: "Mandap Decoration",
    description: "Traditional and modern mandap designs that reflect your cultural heritage.",
    color: "from-[#D4AF37] to-[#C49F27]",
    whatsappMsg: "Hey! I want to talk about your Mandap Decoration service.",
  },
  {
    icon: Home,
    title: "Home Decoration",
    description: "Transform your home with festive and elegant floral decorations.",
    color: "from-[#FAD4E8] to-[#F5C5DC]",
    whatsappMsg: "Hey! I want to talk about your Home Decoration service.",
  },
  {
    icon: Heart,
    title: "Engagement, Haldi & Mehendi Setup",
    description: "Complete decoration services for all your pre-wedding celebrations.",
    color: "from-[#D4AF37] to-[#C49F27]",
    whatsappMsg: "Hey! I want to talk about your Engagement, Haldi & Mehendi Setup service.",
  },
];

export function Services() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="h-1 w-20 bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-[#1A1A1A] font-playfair">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive decoration solutions for every special occasion
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl mb-4 text-[#1A1A1A] font-playfair">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <Button
                  className="w-full bg-gradient-to-r from-[#FAD4E8] to-[#F5C5DC] hover:from-[#F5C5DC] hover:to-[#FAD4E8] text-[#1A1A1A] rounded-xl py-6 transition-all duration-300"
                  onClick={() => window.open(`https://wa.me/919528371089?text=${encodeURIComponent(service.whatsappMsg)}`, '_blank')}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp to Book
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
