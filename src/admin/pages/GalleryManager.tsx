import { useState, useEffect } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { supabase, GALLERY_BUCKET, GalleryPhoto } from "../../lib/supabase";
import { Trash2, Search, Loader2, ImagePlus, Filter, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function GalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { name: "All Categories", value: "all" },
    { name: "Stage Decoration", value: "stage" },
    { name: "Wedding Decoration", value: "wedding" },
    { name: "Car Decoration", value: "car" },
    { name: "Birthday Party", value: "birthday" },
    { name: "Baby Shower", value: "baby" },
    { name: "Housewarming", value: "housewarming" },
  ];

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from("gallery_photos")
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId: string, imageUrl: string) => {
    setDeleting(true);
    try {
      // Extract file path from URL
      const urlParts = imageUrl.split(`/${GALLERY_BUCKET}/`);
      if (urlParts.length < 2) throw new Error("Invalid image URL");
      
      const filePath = urlParts[1];

      // Step 1: Delete from storage
      const { error: storageError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .remove([filePath]);

      if (storageError) throw storageError;

      // Step 2: Delete from database
      const { error: dbError } = await supabase
        .from("gallery_photos")
        .delete()
        .eq("id", photoId);

      if (dbError) throw dbError;

      // Update local state
      setPhotos(photos.filter((photo) => photo.id !== photoId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch = (photo.file_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || photo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout title="Gallery Manager">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex-1">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#FAD4E8]/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all min-w-[160px]"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-slate-900 text-white">
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* Add New Photo Button */}
              <button
                onClick={() => navigate("/admin/upload")}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all text-sm whitespace-nowrap"
              >
                <ImagePlus className="w-4 h-4" />
                <span className="hidden sm:inline">Upload New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-3" />
            <p className="text-white/50 text-sm">Loading gallery...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && photos.length === 0 && (
          <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ImagePlus className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Photos Yet</h3>
            <p className="text-white/70 text-base mb-8">Start by uploading your first gallery photo</p>
            <button
              onClick={() => navigate("/admin/upload")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
            >
              Upload First Photo
            </button>
          </div>
        )}

        {/* Photo Grid */}
        {!loading && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-black/40">
                  <img
                    src={photo.image_url}
                    alt={photo.file_name || 'Gallery photo'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Photo Info */}
                <div className="p-3">
                  <p className="text-xs font-semibold text-white/90 truncate mb-2">
                    {photo.category}
                  </p>
                  
                  {/* Delete Button */}
                  {deleteConfirm === photo.id ? (
                    <div className="space-y-2">
                      <p className="text-xs text-red-200 text-center font-semibold">Delete this photo?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(photo.id, photo.image_url)}
                          disabled={deleting}
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                        >
                          {deleting ? 'Deleting...' : 'Yes, Delete'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          disabled={deleting}
                          className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(photo.id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20 hover:text-red-200 rounded-lg text-xs font-semibold transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Photo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && photos.length > 0 && filteredPhotos.length === 0 && (
          <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Photos Found</h3>
            <p className="text-white/70 text-sm">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
