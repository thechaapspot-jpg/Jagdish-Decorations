import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Priya Sharma",
    review: "Jagdish Flowers made our wedding absolutely magical! The stage decoration was breathtaking and exceeded all our expectations. Highly recommended!",
  },
  {
    name: "Rajesh Kumar",
    review: "Professional service and beautiful floral arrangements. They transformed our engagement venue into a dreamy paradise. Thank you for making our day special!",
  },
  {
    name: "Anjali Singh",
    review: "Outstanding work! The attention to detail and fresh flowers were incredible. Jagdish Flowers & Decorations is our go-to for all celebrations.",
  },
  {
    name: "सोनिया शर्मा",
    review: "शादी की सजावट इतनी खूबसूरत थी कि सभी मेहमान तारीफ करते रह गए। धन्यवाद जगदीश फ्लावर्स!",
  },
  {
    name: "अनिल कुमार",
    review: "बेहतरीन सेवा और समय पर काम पूरा किया। फूलों की क्वालिटी भी बहुत अच्छी थी।",
  },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const testimonialsCount = testimonials.length;

  // Auto-advance the slide index every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % testimonialsCount);
    }, 3000);

    return () => clearInterval(timer);
  }, [testimonialsCount]);

  // Scroll to the current slide whenever it changes
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const targetCard = scrollContainer.children[currentSlide] as HTMLElement;
    if (!targetCard) return;

    const isMobile = window.innerWidth < 640;
    let scrollAmount = targetCard.offsetLeft - scrollContainer.offsetLeft;

    if (isMobile) {
      const containerWidth = scrollContainer.offsetWidth;
      const cardWidth = targetCard.offsetWidth;
      scrollAmount = scrollAmount - (containerWidth / 2) + (cardWidth / 2);
    }

    scrollContainer.scrollTo({
      left: scrollAmount,
      behavior: 'smooth',
    });
  }, [currentSlide]);

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="h-1 w-20 bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-[#1A1A1A] font-playfair">
            What Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it
          </p>
        </div>

        <div className="overflow-hidden">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-scroll scroll-smooth pb-4"
            style={{ 
              scrollbarWidth: 'thin',
              scrollbarColor: '#FAD4E8 #f3f4f6'
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[calc(50%-12px)] md:w-[calc(25%-18px)] bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                {/* Review */}
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.review}"
                </p>

                {/* Customer Info */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="font-semibold text-[#1A1A1A]">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">Verified Customer</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? "w-8 bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37]"
                  : "w-3 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
