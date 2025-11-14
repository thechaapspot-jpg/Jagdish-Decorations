import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { supabase, GalleryPhoto } from "../lib/supabase";
import { Link } from "react-router-dom";

export function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6); // Only show latest 6 photos

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="h-1 w-20 bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] mx-auto mb-6" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-[#1A1A1A] font-playfair">
            Our Work
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            A glimpse of our beautiful creations
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-4" />
            <p className="text-gray-600">Loading gallery...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No photos yet. Check back soon!</p>
          </div>
        )}

        {/* Gallery Grid - Latest 6 Photos */}
        {!loading && photos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-square border-2 border-transparent hover:border-[#FAD4E8] transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(250,212,232,0.4)]"
                onClick={() => setLightboxImage(photo.image_url)}
                style={{
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(212,175,55,0.2)'
                }}
              >
                <img
                  src={photo.image_url}
                  alt={`${photo.category} decoration`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] px-3 py-1.5 rounded-full inline-block mb-2 font-medium capitalize">
                      {photo.category}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            </div>

            {/* View All Gallery Button */}
            <div className="text-center">
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                View All Gallery
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors duration-300"
              onClick={() => setLightboxImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Gallery preview"
              className="max-w-full max-h-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
}
