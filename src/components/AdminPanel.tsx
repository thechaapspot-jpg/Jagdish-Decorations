import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, Trash2, LogOut, Image, X, Loader2, AlertCircle, Grid3x3, Grid2x2, LayoutGrid, ArrowUpDown, HardDrive } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// 🔥 SUPABASE CONFIGURATION
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qxxqdgdjvuriiknoggyx.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4eHFkZ2RqdnVyaWlrbm9nZ3l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMjM2OTAsImV4cCI6MjA3ODY5OTY5MH0.SOphqvysZKa3qX7taIydwTvVjli8KQWL6F0LJqPRyTQ';

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  
  // New features state
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null); // For confirmation modal
  const [category, setCategory] = useState('wedding'); // Category selection
  const [sortOrder, setSortOrder] = useState('newest'); // newest or oldest
  const [gridSize, setGridSize] = useState(4); // 2, 3, or 4 columns
  const [storageUsed, setStorageUsed] = useState(0); // Storage usage in MB
  const [storageLimit] = useState(1024); // 1GB limit (Supabase free tier)
  
  // Lazy loading refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [visibleImages, setVisibleImages] = useState(new Set<string>());

  // Initialize Supabase client
  const supabase = {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.access_token) {
          sessionStorage.setItem('supabase_token', data.access_token);
          return { data: { user: data.user }, error: null };
        }
        return { data: null, error: data.error || { message: 'Login failed' } };
      },
      signOut: async () => {
        sessionStorage.removeItem('supabase_token');
        return { error: null };
      }
    },
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          const formData = new FormData();
          formData.append('file', file);
          const token = sessionStorage.getItem('supabase_token');
          const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'apikey': SUPABASE_ANON_KEY
            },
            body: formData
          });
          const data = await response.json();
          return response.ok ? { data, error: null } : { data: null, error: data };
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `${SUPABASE_URL}/storage/v1/object/public/gallery/${path}` }
        }),
        remove: async (paths: string[]) => {
          const token = sessionStorage.getItem('supabase_token');
          const response = await fetch(`${SUPABASE_URL}/storage/v1/object/gallery`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
              'apikey': SUPABASE_ANON_KEY
            },
            body: JSON.stringify({ prefixes: paths })
          });
          return response.ok ? { data: {}, error: null } : { data: null, error: await response.json() };
        }
      })
    },
    from: (table: string) => ({
      select: (columns = '*') => ({
        order: (column: string, options: { ascending: boolean }) => ({
          then: async (resolve: (arg: any) => void) => {
            const token = sessionStorage.getItem('supabase_token');
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}&order=${column}.${options.ascending ? 'asc' : 'desc'}`, {
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${token}`
              }
            });
            const data = await response.json();
            resolve({ data, error: null });
          }
        })
      }),
      insert: async (values: any) => {
        const token = sessionStorage.getItem('supabase_token');
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${token}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(values)
        });
        const data = await response.json();
        return response.ok ? { data, error: null } : { data: null, error: data };
      },
      delete: () => ({
        eq: (column: string, value: string) => ({
          then: async (resolve: (arg: any) => void) => {
            const token = sessionStorage.getItem('supabase_token');
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
              method: 'DELETE',
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${token}`
              }
            });
            resolve({ error: response.ok ? null : await response.json() });
          }
        })
      })
    })
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = sessionStorage.getItem('supabase_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Load photos when logged in or sort changes
  useEffect(() => {
    if (isLoggedIn) {
      loadPhotos();
      getStorageUsage();
    }
  }, [isLoggedIn, sortOrder]);

  // Lazy loading intersection observer
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-id');
            if (id) {
              setVisibleImages(prev => new Set([...prev, id]));
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // ✅ STEP 1: LOGIN WITH SUPABASE AUTH
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setIsLoggedIn(true);
      setEmail('');
      setPassword('');
      toast.success('Welcome back, Admin!');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ STEP 2: LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setPhotos([]);
    toast.success('Logged out successfully');
  };

  // ✅ STEP 3: LOAD PHOTOS FROM DATABASE (with sorting)
  const loadPhotos = async () => {
    try {
      const result: any = await new Promise((resolve) => {
        supabase
          .from('gallery_photos')
          .select('*')
          .order('created_at', { ascending: sortOrder === 'oldest' })
          .then(resolve);
      });

      if (result?.error) throw result.error;
      setPhotos(result?.data || []);
    } catch (err) {
      console.error('Error loading photos:', err);
      toast.error('Failed to load photos');
    }
  };

  // ✅ GET STORAGE USAGE
  const getStorageUsage = async () => {
    try {
      const token = sessionStorage.getItem('supabase_token');
      const response = await fetch(`${SUPABASE_URL}/rest/v1/gallery_photos?select=file_path`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${token}`
        }
      });
      const photos = await response.json();
      
      // Calculate approximate storage (each image ~1-2MB average)
      const estimatedUsage = (photos.length * 1.5).toFixed(2);
      setStorageUsed(parseFloat(estimatedUsage));
    } catch (err) {
      console.error('Error calculating storage:', err);
    }
  };

  // ✅ STEP 4: UPLOAD IMAGE TO SUPABASE STORAGE + SAVE TO DATABASE (with alt text & toast)
  const handleFileUpload = async (e: any) => {
    const files = Array.from(e.target.files) as File[];
    if (files.length === 0) return;

    setUploading(true);
    const uploadToast = toast.loading('Preparing upload...');

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      try {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name}: Only image files allowed`, { id: uploadToast });
          failCount++;
          continue;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name}: File too large (max 5MB)`, { id: uploadToast });
          failCount++;
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `images/${fileName}`;

        toast.loading(`Uploading ${file.name}...`, { id: uploadToast });

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        // Save to database with category
        const { error: dbError } = await supabase
          .from('gallery_photos')
          .insert({
            image_url: urlData.publicUrl,
            file_path: filePath,
            file_name: file.name,
            category: category,
            alt_text: file.name
          });

        if (dbError) throw dbError;

        successCount++;
      } catch (err: any) {
        console.error('Upload error:', err);
        failCount++;
      }
    }

    setUploading(false);
    
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} photo${successCount > 1 ? 's' : ''}!`, { id: uploadToast });
    } else {
      toast.error(`Failed to upload ${failCount} photo${failCount > 1 ? 's' : ''}`, { id: uploadToast });
    }
    
    loadPhotos(); // Refresh gallery
    getStorageUsage(); // Update storage
    e.target.value = ''; // Reset input
  };

  // ✅ STEP 5: DELETE PHOTO FROM STORAGE + DATABASE (with confirmation modal)
  const handleDeleteClick = (photo: any) => {
    setDeleteConfirm(photo);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    const deleteToast = toast.loading('Deleting photo...');

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([deleteConfirm.file_path]);

      if (storageError) throw storageError;

      // Delete from database (using wrapper then)
      const deleteResult: any = await new Promise((resolve) => {
        supabase
          .from('gallery_photos')
          .delete()
          .eq('id', deleteConfirm.id)
          .then(resolve);
      });

      if (deleteResult?.error) throw deleteResult.error;

      // Update UI
      setPhotos(prev => prev.filter(p => p.id !== deleteConfirm.id));
      toast.success('Photo deleted successfully!', { id: deleteToast });
      getStorageUsage(); // Update storage
    } catch (err: any) {
      console.error('Delete error:', err);
      toast.error('Failed to delete photo', { id: deleteToast });
    } finally {
      setDeleteConfirm(null);
    }
  };

  // Lazy loading callback
  const imageRef = useCallback((node: HTMLDivElement | null, photoId: string) => {
    if (node && observerRef.current) {
      node.setAttribute('data-id', photoId);
      observerRef.current.observe(node);
    }
  }, []);

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#e5e7eb', color: '#000' }}>
        <Toaster position="top-center" />
        <div className="w-full max-w-md">
          <div className="border border-gray-400 rounded-2xl shadow-2xl p-8 space-y-6" style={{ background: '#d1d5db' }}>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-black">Jagdish Decorations</h1>
              <p className="text-black">Admin Panel</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400"
                  placeholder="admin@jagdish.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}
                  className="w-full px-4 py-3 border border-gray-300 bg-gray-100 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition placeholder-gray-400"
                  placeholder="Enter password"
                />
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700 text-black px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-black" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-black py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-black" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            <div className="text-center text-xs text-black space-y-1">
              <p className="text-black">🔐 Secured with Supabase Authentication</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen" style={{ background: '#e5e7eb', color: '#000' }}>
      <Toaster position="top-center" />
      {/* Header */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                {/* Custom SVG Logo */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-black leading-tight">Jagdish Decorations</h1>
                <span className="text-sm text-black leading-tight">Welcome, Admin</span>
              </div>
            </div>
            {/* ...existing code... */}
          </div>
          <button
            onClick={handleLogout}
            className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 text-black hover:bg-slate-700 rounded-lg transition"
          >
            <LogOut className="w-5 h-5 text-black" />
            <span className="hidden sm:inline text-black">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Storage Usage Indicator */}
        <div className="rounded-xl shadow-xl border border-gray-400 p-4 mb-6" style={{ background: '#d1d5db' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-700" />
              <span className="text-sm font-bold text-black">Storage Usage</span>
            </div>
            <span className="text-sm font-bold text-black">
              {storageUsed} MB / {storageLimit} MB
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                storageUsed / storageLimit > 0.9 ? 'bg-red-500' :
                storageUsed / storageLimit > 0.7 ? 'bg-yellow-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min((storageUsed / storageLimit) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Upload Section */}
        <div className="rounded-xl shadow-xl border border-gray-400 p-6 mb-8" style={{ background: '#d1d5db' }}>
          <h2 className="text-lg font-semibold text-black mb-4">Upload Photos</h2>
          
          {/* Category Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Decoration Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            >
              <option value="wedding">Wedding Decoration</option>
              <option value="car">Car Decoration</option>
              <option value="birthday">Birthday Decoration</option>
              <option value="baby">Baby Shower</option>
              <option value="corporate">Corporate Event</option>
              <option value="stage">Stage Decoration</option>
              <option value="housewarming">Housewarming</option>
              <option value="other">Other</option>
            </select>
          </div>

          <label className="block">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition cursor-pointer ${
              uploading 
                ? 'border-blue-500 bg-blue-900/30' 
                : 'border-gray-300 hover:border-blue-500 bg-gray-100/50 group'
            }`}>
              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-3 animate-spin" />
                  <p className="text-blue-600 font-medium">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-400 mx-auto mb-3 transition" />
                  <p className="text-gray-200 font-medium mb-1">Click to upload photos</p>
                  <p className="text-sm text-gray-400">JPG, PNG, WEBP (Max 5MB per file)</p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Category Heading above gallery */}
        <div className="mb-2">
          <h3 className="text-md font-bold text-black">Category: {category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        </div>
        {/* Gallery Section */}
        <div className="rounded-xl shadow-xl border border-gray-400 p-6" style={{ background: '#d1d5db' }}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold text-black">
              Gallery ({photos.length} {photos.length === 1 ? 'photo' : 'photos'})
            </h2>
            
            <div className="flex items-center gap-3">
              {/* Sort Toggle */}
              <button
                onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="text-sm">{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
              </button>

              {/* Grid Size Toggle */}
              <div className="flex items-center gap-1 border border-gray-300 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setGridSize(2)}
                  className={`p-2 rounded transition ${gridSize === 2 ? 'bg-blue-500 text-white' : 'text-gray-900 hover:bg-gray-200'}`}
                  title="2 columns"
                >
                  <Grid2x2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridSize(3)}
                  className={`p-2 rounded transition ${gridSize === 3 ? 'bg-blue-500 text-white' : 'text-gray-900 hover:bg-gray-200'}`}
                  title="3 columns"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridSize(4)}
                  className={`p-2 rounded transition ${gridSize === 4 ? 'bg-blue-500 text-white' : 'text-gray-900 hover:bg-gray-200'}`}
                  title="4 columns"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-12">
              <Image className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-black mb-2">No photos yet</p>
              <p className="text-sm text-black">Upload your first decoration photo above!</p>
            </div>
          ) : (
            <div className={`grid gap-4 ${
              gridSize === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              gridSize === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}>
              {photos.map((photo: any) => (
                <div 
                  key={photo.id} 
                  ref={(node) => imageRef(node, photo.id)}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-xl transition border border-gray-300"
                >
                  {visibleImages.has(photo.id) ? (
                    <img
                      src={photo.image_url}
                      alt={photo.alt_text || photo.file_name}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(photo)}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteClick(photo)}
                      className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-all transform scale-90 group-hover:scale-100 shadow-xl"
                    >
                      <Trash2 className="w-7 h-7 text-red-900" />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-black text-xs font-bold truncate">{photo.file_name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={selectedImage.image_url}
            alt={selectedImage.alt_text || selectedImage.file_name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-4 right-4 text-center bg-black bg-opacity-50 p-3 rounded-lg">
            <p className="text-white font-medium">{selectedImage.file_name}</p>
            {selectedImage.alt_text && (
              <p className="text-gray-300 text-sm mt-1">{selectedImage.alt_text}</p>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-black opacity-80">
        Developed & Powered by <a href="https://vipulxdev.com" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-blue-700">Vipul</a>
      </footer>
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="border border-gray-400 rounded-xl p-6 max-w-sm w-full shadow-2xl" style={{ background: '#d1d5db' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-black mb-2">Delete Photo?</h3>
            <p className="text-black mb-6">
              Are you sure you want to delete "{deleteConfirm.file_name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-slate-600 bg-slate-700 text-gray-200 rounded-lg hover:bg-slate-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
