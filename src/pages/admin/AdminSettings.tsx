import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import ImageCropperModal from "@/components/ui/ImageCropperModal";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getSetting, setSetting } from "@/lib/siteSettings";

export default function AdminSettings() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Current published media URLs (Cloudinary), with local-file fallbacks.
  const [heroUrl, setHeroUrl] = useState<string>("/hero.mp4");
  const [heritageUrl, setHeritageUrl] = useState<string>("/heritage.png");
  const [festiveUrl, setFestiveUrl] = useState<string>("/festive-banner.png");

  // Studio States
  const [studioImage, setStudioImage] = useState<string | null>(null);
  const [studioType, setStudioType] = useState<"heritage" | "festive" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSetting("hero_video").then((v) => v && setHeroUrl(v));
    getSetting("heritage_image").then((v) => v && setHeritageUrl(v));
    getSetting("festive_banner").then((v) => v && setFestiveUrl(v));
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadSuccess(false);
    }
  };

  const openStudio = (e: React.ChangeEvent<HTMLInputElement>, type: "heritage" | "festive") => {
    const file = e.target.files?.[0];
    if (file) {
      setStudioType(type);
      setStudioImage(URL.createObjectURL(file));
    }
    // clear input so same file can be selected again
    e.target.value = "";
  };

  const handleStudioSave = async (blob: Blob) => {
    if (!studioType) return;

    const toastId = `upload-${studioType}`;
    toast.loading(`Uploading ${studioType} image...`, { id: toastId });
    try {
      const url = await uploadToCloudinary(blob, "image");
      if (studioType === "heritage") {
        await setSetting("heritage_image", url);
        setHeritageUrl(url);
      } else {
        await setSetting("festive_banner", url);
        setFestiveUrl(url);
      }
      toast.success(`Successfully published ${studioType} image!`, { id: toastId });
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`, { id: toastId });
    } finally {
      setStudioImage(null);
      setStudioType(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(selectedFile, "video");
      await setSetting("hero_video", url);
      setHeroUrl(url);
      setUploadSuccess(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      toast.success("Hero video published successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Error uploading video: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 relative">
      
      {studioImage && studioType && (
        <ImageCropperModal
          isOpen={true}
          imageSrc={studioImage}
          aspectRatio={studioType === "heritage" ? 4 / 5 : 4 / 3}
          title={`Edit ${studioType === "heritage" ? "Our Story" : "Festive Banner"} Image`}
          onClose={() => { setStudioImage(null); setStudioType(null); }}
          onSave={handleStudioSave}
        />
      )}

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">Store Settings</h1>
        <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Configure your boutique preferences and media.</p>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: General Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-12 overflow-hidden"
        >
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-heading text-[#1a3326] mb-4">Store Status</h2>
              <div className="flex items-center gap-4 bg-white/40 p-6 rounded-xl border border-white">
                <input type="checkbox" defaultChecked className="w-6 h-6 accent-forest rounded cursor-pointer" />
                <div>
                  <label className="font-bold text-[#1a3326] tracking-wide block">Store is Live</label>
                  <p className="text-sm text-charcoal/60 mt-1">Uncheck this to put the store in maintenance mode.</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

            <div>
              <h2 className="text-2xl font-heading text-[#1a3326] mb-4">Shipping Preferences</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#1a3326]/70 mb-3">Free Shipping Threshold (₹)</label>
                  <input type="number" defaultValue={5000} className="w-full bg-white/50 border border-white shadow-sm rounded-lg p-4 text-[#1a3326] focus:bg-white focus:border-gold/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#1a3326]/70 mb-3">Standard Shipping Cost (₹)</label>
                  <input type="number" defaultValue={250} className="w-full bg-white/50 border border-white shadow-sm rounded-lg p-4 text-[#1a3326] focus:bg-white focus:border-gold/50 outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button className="bg-gradient-to-r from-forest to-[#1a3326] text-ivory px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold tracking-wide">
                Save Settings
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Storefront Media */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-12 overflow-hidden flex flex-col"
        >
          <h2 className="text-2xl font-heading text-[#1a3326] mb-2">Homepage Hero Video</h2>
          <p className="text-sm text-charcoal/60 mb-8">This video plays automatically on the main landing page.</p>

          <div className="bg-black/5 rounded-xl border border-black/10 overflow-hidden relative aspect-video flex items-center justify-center">
            <video
              src={previewUrl || heroUrl}
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover"
            />
            {previewUrl && (
              <div className="absolute top-4 right-4 bg-gold text-forest text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded shadow-md z-10">
                Preview Mode
              </div>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-white/40 p-5 rounded-xl border border-white text-sm text-charcoal/70 space-y-2">
              <p><strong className="text-[#1a3326]">Recommended Size:</strong> 1920x1080 (16:9 ratio)</p>
              <p><strong className="text-[#1a3326]">Max File Size:</strong> 20MB</p>
              <p><strong className="text-[#1a3326]">Format:</strong> MP4 only</p>
            </div>

            <input 
              type="file" 
              accept="video/mp4" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileSelect}
            />
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 bg-white border border-charcoal/20 text-[#1a3326] px-6 py-3.5 rounded-lg hover:bg-gray-50 transition-all font-semibold tracking-wide"
              >
                {previewUrl ? "Choose Different Video" : "Upload New Video"}
              </button>
              
              {selectedFile && (
                <button 
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-gradient-to-r from-gold to-[#e8c875] text-[#1a3326] px-6 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all font-bold tracking-wide disabled:opacity-50"
                >
                  {isUploading ? "Uploading..." : "Confirm & Publish"}
                </button>
              )}
            </div>
            {uploadSuccess && (
              <p className="text-green-600 font-bold text-sm text-center mt-4">
                ✓ Hero video published successfully!
              </p>
            )}
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent my-10" />
          
          {/* Heritage Image */}
          <h2 className="text-2xl font-heading text-[#1a3326] mb-2">Our Story Image</h2>
          <p className="text-sm text-charcoal/60 mb-8">This image appears in the Heritage section on the homepage.</p>

          <div className="bg-black/5 rounded-xl border border-black/10 overflow-hidden relative aspect-[4/5] max-w-[240px] mx-auto flex items-center justify-center">
            <img
              src={heritageUrl}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Heritage preview"
            />
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-white/40 p-5 rounded-xl border border-white text-sm text-charcoal/70 space-y-2">
              <p><strong className="text-[#1a3326]">Recommended Aspect:</strong> 4:5</p>
              <p><strong className="text-[#1a3326]">Format:</strong> PNG or JPG</p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => openStudio(e, 'heritage');
                  input.click();
                }}
                className="w-full bg-white border border-charcoal/20 text-[#1a3326] px-6 py-3.5 rounded-lg hover:bg-gray-50 transition-all font-semibold tracking-wide"
              >
                Open Studio to Upload
              </button>
            </div>
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-black/10 to-transparent my-10" />
          
          {/* Festive Banner */}
          <h2 className="text-2xl font-heading text-[#1a3326] mb-2">Festive Banner</h2>
          <p className="text-sm text-charcoal/60 mb-8">This banner appears in the Festive Edition section on the homepage.</p>

          <div className="bg-black/5 rounded-xl border border-black/10 overflow-hidden relative aspect-[4/3] max-w-sm mx-auto flex items-center justify-center">
            <img
              src={festiveUrl}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Festive preview"
              onError={(e) => {
                // Fallback since we haven't uploaded one yet initially
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-white/40 p-5 rounded-xl border border-white text-sm text-charcoal/70 space-y-2">
              <p><strong className="text-[#1a3326]">Recommended Aspect:</strong> 4:3</p>
              <p><strong className="text-[#1a3326]">Format:</strong> PNG or JPG</p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e: any) => openStudio(e, 'festive');
                  input.click();
                }}
                className="w-full bg-white border border-charcoal/20 text-[#1a3326] px-6 py-3.5 rounded-lg hover:bg-gray-50 transition-all font-semibold tracking-wide"
              >
                Open Studio to Upload
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
