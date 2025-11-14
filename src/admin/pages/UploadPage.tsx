import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { AdminLayout } from "../components/AdminLayout";
import { supabase, GALLERY_BUCKET } from "../../lib/supabase";
import { Upload, Image as ImageIcon, X, CheckCircle, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UploadPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState("stage");
  const navigate = useNavigate();

  const categories = [
    { name: "Stage Decoration", value: "stage" },
    { name: "Wedding Decoration", value: "wedding" },
    { name: "Car Decoration", value: "car" },
    { name: "Birthday Party", value: "birthday" },
    { name: "Baby Shower", value: "baby" },
    { name: "Housewarming", value: "housewarming" },
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      // Step 1: Generate unique filename with category folder structure
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `images/${category}/${fileName}`;

      // Step 2: Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(GALLERY_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Step 3: Get public URL
      const { data: urlData } = supabase.storage
        .from(GALLERY_BUCKET)
        .getPublicUrl(filePath);

      // Step 4: Save to database
      const { error: dbError } = await supabase
        .from("gallery_photos")
        .insert({
          image_url: urlData.publicUrl,
          category: category,
          file_name: fileName,
        });

      if (dbError) throw dbError;

      setUploadSuccess(true);
      
      // Reset after 2 seconds and redirect
      setTimeout(() => {
        navigate('/admin/gallery');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setPreview(null);
    setError("");
    setUploadSuccess(false);
  };

  return (
    <AdminLayout title="Upload Photos">
      <div className="max-w-3xl mx-auto">
        {/* Upload Container */}
        <div className="bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {!preview ? (
            /* Drag & Drop Area */
            <div
              {...getRootProps()}
              className={`p-12 sm:p-16 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/20 hover:border-blue-400/50 hover:bg-white/5'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <div className="relative mx-auto mb-8 w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl blur-xl opacity-75" />
                  <div className="relative w-24 h-24 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-3">
                  {isDragActive ? 'Drop Your Photo Here!' : 'Upload Gallery Photo'}
                </h3>
                
                <p className="text-white/70 text-lg mb-8">
                  {isDragActive ? 'Release to upload' : 'Drag and drop your image or click to browse'}
                </p>
                
                <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:scale-[1.02]">
                  <ImageIcon className="w-6 h-6" />
                  Choose File
                </div>
                
                <p className="mt-6 text-sm text-white/50">
                  Supported formats: PNG, JPEG, JPG • Maximum size: 5MB
                </p>
              </div>
            </div>
          ) : (
            /* Preview & Upload Section */
            <div className="p-8">
              {/* Preview Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ImageIcon className="w-6 h-6 text-blue-400" />
                  Photo Preview
                </h3>
                <button
                  onClick={handleCancel}
                  className="p-2.5 hover:bg-red-500/20 rounded-xl transition-all text-white/70 hover:text-red-400"
                  title="Cancel and choose another"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
                
              {/* Image Preview */}
              <div className="mb-6">
                <div className="relative rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-xl">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-80 object-contain mx-auto"
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-white/90 mb-2">
                  Select Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-slate-900 text-white">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* File Info */}
              <div className="mb-6 p-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/60 mb-1 font-semibold">Filename</p>
                    <p className="text-sm text-white font-medium truncate">{file?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1 font-semibold">Size</p>
                    <p className="text-sm text-white font-medium">{((file?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-200 mb-1">Upload Failed</p>
                    <p className="text-xs text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-200 mb-1">Upload Successful!</p>
                    <p className="text-xs text-green-300">Redirecting to gallery...</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleUpload}
                  disabled={uploading || uploadSuccess}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:transform-none"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading to Supabase...</span>
                    </>
                  ) : uploadSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Uploaded Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload to Gallery</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={uploading}
                  className="px-6 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="text-xl">ℹ️</span>
            How Upload Works
          </h3>
          <ul className="text-sm text-white/70 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Images are uploaded to Supabase Storage in organized folders by category</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Each photo gets a public URL and is saved to the database automatically</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Photos instantly appear on your website gallery after upload</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}
