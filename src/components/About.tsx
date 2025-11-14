export function About() {
  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Decorative floral corner elements */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="#FAD4E8" />
          <circle cx="70" cy="30" r="20" fill="#D4AF37" />
          <circle cx="30" cy="70" r="15" fill="#FAD4E8" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-40 h-40 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="30" fill="#D4AF37" />
          <circle cx="30" cy="70" r="20" fill="#FAD4E8" />
          <circle cx="70" cy="30" r="15" fill="#D4AF37" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-block mb-4">
          <div className="h-1 w-20 bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] mx-auto mb-6" />
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl mb-8 text-[#1A1A1A] font-playfair">
          About Us
        </h2>
        
        <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed">
          <p>
            Jagdish Flowers & Decorations specializes in premium flower arrangements, 
            stage décor, wedding decoration, and customized event setup.
          </p>
          <p>
            We bring freshness, beauty, and elegance to every event, transforming 
            your vision into reality with our expert craftsmanship and attention to detail.
          </p>
          <p>
            From intimate gatherings to grand celebrations, we are committed to making 
            your special moments truly unforgettable.
          </p>
        </div>

        <div className="mt-12 p-8 bg-gradient-to-br from-[#FAD4E8]/20 to-[#D4AF37]/10 rounded-3xl border-2 border-[#FAD4E8]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl md:text-5xl text-[#D4AF37] mb-2 font-playfair">10+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl text-[#D4AF37] mb-2 font-playfair">500+</div>
              <div className="text-gray-600">Events Decorated</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl text-[#D4AF37] mb-2 font-playfair">100%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
