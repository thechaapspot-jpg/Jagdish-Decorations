import { useState, useEffect } from "react";
import { X, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase, GalleryPhoto } from "../lib/supabase";
import { Link } from "react-router-dom";

const categories = [
  { name: "All", value: "all" },
  { name: "Wedding", value: "wedding" },
  { name: "Car", value: "car" },
  { name: "Birthday", value: "birthday" },
  { name: "Baby Shower", value: "baby" },
  { name: "Corporate", value: "corporate" },
  { name: "Stage", value: "stage" },
  { name: "Housewarming", value: "housewarming" },
  { name: "Other", value: "other" },
];

const PHOTOS_PER_PAGE = 8;

export function FullGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPhotos();
  }, []);

  useEffect(() => {
    // Reset to page 1 when category changes
    setCurrentPage(1);
  }, [selectedCategory]);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = selectedCategory === "all" 
    ? photos 
    : photos.filter(photo => photo.category === selectedCategory);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPhotos.length / PHOTOS_PER_PAGE);
  const startIndex = (currentPage - 1) * PHOTOS_PER_PAGE;
  const endIndex = startIndex + PHOTOS_PER_PAGE;
  const currentPhotos = filteredPhotos.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white mb-6 hover:underline"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-4 text-white font-playfair">
            Complete Gallery
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Explore all our beautiful decoration works
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="py-8 px-4 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.value
                    ? "bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-4" />
              <p className="text-gray-600">Loading gallery...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPhotos.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">
                {selectedCategory === "all" 
                  ? "No photos yet. Check back soon!" 
                  : `No photos in ${categories.find(c => c.value === selectedCategory)?.name} category yet.`}
              </p>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && currentPhotos.length > 0 && (
            <>
              <div className="mb-6 text-gray-600">
                Showing {startIndex + 1} - {Math.min(endIndex, filteredPhotos.length)} of {filteredPhotos.length} photos
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {currentPhotos.map((photo) => (
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
                      loading="lazy"
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition ${
                        currentPage === page
                          ? "bg-gradient-to-r from-[#FAD4E8] to-[#D4AF37] text-white shadow-lg"
                          : "border border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

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
  );
}
