import { useState } from "react";
import { Phone, MessageCircle, MapPin, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    eventDate: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = `Hello! I'm ${formData.name}. Phone: ${formData.phone}. Event Date: ${formData.eventDate}. Message: ${formData.message}`;
    window.open(`https://wa.me/919528371089?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="h-1 w-20 bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-[#1A1A1A] font-playfair">
            Contact Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Let's create something beautiful together
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl mb-6 text-[#1A1A1A] font-playfair">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FAD4E8] to-[#D4AF37] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] mb-1">Address</div>
                    <div className="text-gray-600">
                      Jagdish Flowers & Decorations<br />
                      Near Mahadev Choraha<br />
                      Dibai, Bulandshahr<br />
                      Pincode: 203393
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#FAD4E8] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] mb-1">Phone</div>
                    <a href="tel:+919528371089" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                      +91 95283 71089
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FAD4E8] to-[#D4AF37] rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-[#1A1A1A] mb-1">Email</div>
                    <a href="mailto:contact@jagdishflowers.com" className="text-gray-600 hover:text-[#D4AF37] transition-colors">
                      contact@jagdishflowers.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 space-y-4">
                <Button 
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C49F27] hover:from-[#C49F27] hover:to-[#D4AF37] text-white rounded-xl py-6"
                  onClick={() => window.location.href = 'tel:+919528371089'}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-[#FAD4E8] to-[#F5C5DC] hover:from-[#F5C5DC] hover:to-[#FAD4E8] text-[#1A1A1A] rounded-xl py-6"
                  onClick={() => window.open('https://wa.me/919528371089', '_blank')}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Now
                </Button>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3496.830987!2d77.90!3d28.36!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDIxJzM2LjAiTiA3N8KwNTQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin&q=Mahadev+Choraha,+Dibai,+Bulandshahr,+Uttar+Pradesh+203393"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jagdish Flowers Location"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-2xl mb-6 text-[#1A1A1A] font-playfair">Send us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-[#1A1A1A] mb-2">
                  Your Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-[#1A1A1A] mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="w-full rounded-xl border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-[#1A1A1A] mb-2">
                  Event Date
                </label>
                <Input
                  id="eventDate"
                  type="date"
                  className="w-full rounded-xl border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] py-6"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[#1A1A1A] mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your event..."
                  className="w-full rounded-xl border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] min-h-32 resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#FAD4E8] via-[#D4AF37] to-[#FAD4E8] bg-[length:200%_100%] hover:bg-[position:100%_0] text-white rounded-xl py-6 transition-all duration-500"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Send via WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
