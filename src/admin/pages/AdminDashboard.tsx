import { useEffect, useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { 
  ImagePlus, 
  TrendingUp, 
  Images, 
  Upload,
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface Stats {
  total: number;
  thisMonth: number;
  categories: { [key: string]: number };
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ total: 0, thisMonth: 0, categories: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch total photos
      const { count: totalCount } = await supabase
        .from("gallery_photos")
        .select("*", { count: "exact", head: true });

      // Fetch this month's photos
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: monthCount } = await supabase
        .from("gallery_photos")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonth.toISOString());

      // Fetch category counts
      const { data: photos } = await supabase
        .from("gallery_photos")
        .select("category");

      const categoryCounts: { [key: string]: number } = {};
      photos?.forEach((photo) => {
        categoryCounts[photo.category] = (categoryCounts[photo.category] || 0) + 1;
      });

      setStats({
        total: totalCount || 0,
        thisMonth: monthCount || 0,
        categories: categoryCounts,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const categoryList = [
    { name: "Stage", key: "stage", color: "from-pink-500 to-rose-500" },
    { name: "Wedding", key: "wedding", color: "from-purple-500 to-indigo-500" },
    { name: "Car", key: "car", color: "from-blue-500 to-cyan-500" },
    { name: "Birthday", key: "birthday", color: "from-amber-500 to-orange-500" },
    { name: "Baby", key: "baby", color: "from-green-500 to-emerald-500" },
    { name: "Housewarming", key: "housewarming", color: "from-violet-500 to-purple-500" },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="relative bg-gradient-to-r from-blue-600 via-violet-600 to-blue-600 rounded-2xl p-8 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-8 h-8 text-white" />
              <h2 className="text-3xl font-bold text-white">Welcome to Admin Portal</h2>
            </div>
            <p className="text-white/90 text-lg">Manage your gallery and showcase stunning decorations</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Images */}
          <div className="group bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-blue-500/50 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Images className="w-7 h-7 text-white" />
              </div>
              {loading ? (
                <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
              ) : (
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">{stats.total}</div>
                  <div className="text-sm text-white/60 font-medium">Total Photos</div>
                </div>
              )}
            </div>
            <div className="text-sm text-blue-400 font-semibold">Gallery Collection</div>
          </div>

          {/* This Month */}
          <div className="group bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-violet-500/50 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              {loading ? (
                <div className="w-8 h-8 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
              ) : (
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">{stats.thisMonth}</div>
                  <div className="text-sm text-white/60 font-medium">This Month</div>
                </div>
              )}
            </div>
            <div className="text-sm text-violet-400 font-semibold flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Recent Uploads
            </div>
          </div>

          {/* Categories */}
          <div className="group bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 transition-all shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="text-2xl">📁</span>
              </div>
              {loading ? (
                <div className="w-8 h-8 border-2 border-white/20 border-t-emerald-500 rounded-full animate-spin" />
              ) : (
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">{Object.keys(stats.categories).length}</div>
                  <div className="text-sm text-white/60 font-medium">Categories</div>
                </div>
              )}
            </div>
            <div className="text-sm text-emerald-400 font-semibold">Active Collections</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/admin/upload")}
              className="group relative bg-gradient-to-br from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 rounded-xl p-6 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-white text-lg mb-1">Upload Photos</h4>
                  <p className="text-sm text-white/80">Add new images to gallery</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => navigate("/admin/gallery")}
              className="group relative bg-gradient-to-br from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 rounded-xl p-6 transition-all shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <ImagePlus className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-bold text-white text-lg mb-1">Manage Gallery</h4>
                  <p className="text-sm text-white/80">View, edit, and delete photos</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Category Breakdown */}
        {!loading && Object.keys(stats.categories).length > 0 && (
          <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Category Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categoryList.map((category) => {
                const count = stats.categories[category.key] || 0;
                return (
                  <div
                    key={category.key}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${category.color} rounded-lg mb-3 flex items-center justify-center shadow-lg`}>
                      <span className="text-white font-bold text-lg">{count}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">{category.name}</div>
                    <div className="text-xs text-white/60 mt-1">{count} photos</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
