import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import { X, Plus, Image as ImageIcon } from "lucide-react";
import ImageCropperModal from "@/components/ui/ImageCropperModal";
import { fetchProduct, createProduct, updateProduct } from "@/lib/products";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AdminProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [activeTab, setActiveTab] = useState("basic");
  const tabs = [
    { id: "basic", label: "Basic Info" },
    { id: "pricing", label: "Pricing & Inventory" },
    { id: "details", label: "Craft & Details" },
    { id: "media", label: "Media & SEO" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Sarees",
    sku: "",
    barcode: "",
    price: 0,
    mrp: 0,
    costPrice: 0,
    taxRate: 0,
    sizes: "",
    color: "",
    inStock: true,
    stockCount: 0,
    fabric: "",
    craftType: "",
    washCare: "",
    weightGrams: 0,
    dispatchDays: "",
    bestSeller: false,
    newArrival: false,
    tags: "",
    metaTitle: "",
    metaDesc: "",
    image: "",
    hoverImage: "",
    galleryImages: "",
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [studioImage, setStudioImage] = useState<string | null>(null);

  // Fetch product data if editing
  useEffect(() => {
    if (isEditing) {
      fetchProduct(id!)
        .then(data => {
          if (data) {
            // sizes/tags are comma-separated strings in the form, but may come
            // back from the DB as arrays (or null) — coerce to a string so the
            // text inputs stay controlled.
            const toCsv = (v: any) =>
              Array.isArray(v) ? v.join(", ") : (v ?? "");
            setFormData((prev) => ({
              ...prev,
              ...data,
              sizes: toCsv(data.sizes),
              tags: toCsv(data.tags),
              price: Number(data.price) || 0,
              mrp: Number(data.mrp) || 0,
              costPrice: Number(data.costPrice) || 0,
              taxRate: Number(data.taxRate) || 0,
              stockCount: Number(data.stockCount) || 0,
              weightGrams: Number(data.weightGrams) || 0,
            }));
            const images: string[] = [];
            if (data.image) images.push(data.image);
            if (data.hoverImage) images.push(data.hoverImage);
            if (data.galleryImages) {
              try {
                const parsed = JSON.parse(data.galleryImages);
                if (Array.isArray(parsed)) images.push(...parsed);
              } catch (e) {}
            }
            setUploadedImages(images);
          }
        })
        .catch(err => console.error("Failed to load product", err));
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : (type === "number" ? Number(value) : value),
    }));
  };

  const handleSave = async () => {
    try {
      const submitData = { ...formData };
      submitData.image = uploadedImages[0] || "";
      submitData.hoverImage = uploadedImages[1] || "";
      submitData.galleryImages = JSON.stringify(uploadedImages.slice(2));

      if (!submitData.name || !submitData.image) {
        toast.error("A product name and at least one image are required.");
        return;
      }

      if (isEditing) {
        await updateProduct(id!, submitData);
      } else {
        await createProduct(submitData);
      }

      toast.success(isEditing ? "Product updated successfully!" : "Product created successfully!");
      navigate("/admin/products");
    } catch (err: any) {
      toast.error(`Error saving product: ${err.message}`);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (files.length === 1) {
      setStudioImage(URL.createObjectURL(files[0]));
    } else {
      toast.loading(`Uploading ${files.length} images...`, { id: "bulk-upload" });
      try {
        const uploadedUrls = await Promise.all(
          files.map(file => uploadToCloudinary(file, "image"))
        );
        setUploadedImages(prev => [...prev, ...uploadedUrls]);
        toast.success(`Successfully uploaded ${files.length} images!`, { id: "bulk-upload" });
      } catch (err: any) {
        toast.error(err?.message || "Error uploading images.", { id: "bulk-upload" });
      }
    }
    e.target.value = "";
  };

  const handleStudioSave = async (blob: Blob) => {
    toast.loading("Uploading product image...", { id: "prod-upload" });
    try {
      const url = await uploadToCloudinary(blob, "image");
      setUploadedImages(prev => [...prev, url]);
      toast.success("Image uploaded successfully!", { id: "prod-upload" });
    } catch (err: any) {
      toast.error(err?.message || "Error uploading image.", { id: "prod-upload" });
    } finally {
      setStudioImage(null);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Shared Input Styles
  const labelClass = "block text-xs font-bold uppercase tracking-widest text-[#1a3326]/70 mb-3";
  const inputClass = "w-full bg-white/50 border border-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] rounded-lg p-4 text-[#1a3326] focus:bg-white focus:border-gold/50 focus:ring-4 focus:ring-gold/10 outline-none transition-all duration-300";

  return (
    <div className="space-y-10 pb-32 relative">
      
      {studioImage && (
        <ImageCropperModal
          isOpen={true}
          imageSrc={studioImage}
          aspectRatio={3 / 4}
          title="Product Image Studio"
          onClose={() => setStudioImage(null)}
          onSave={handleStudioSave}
        />
      )}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-5xl font-heading text-[#1a3326] tracking-tight">{isEditing ? "Edit Product" : "New Product"}</h1>
          <p className="text-charcoal/60 mt-3 text-lg font-medium tracking-wide">Configure product details, variations, and SEO.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate("/admin/products")} className="px-8 py-3.5 rounded-lg text-charcoal bg-white/60 backdrop-blur-md border border-white/50 hover:bg-white shadow-sm transition-all font-semibold tracking-wide">
            Discard
          </button>
          <button onClick={handleSave} className="bg-gradient-to-r from-forest to-[#1a3326] text-ivory px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold tracking-wide">
            Save Product
          </button>
        </div>
      </motion.header>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 overflow-hidden"
      >
        {/* Tabs */}
        <div className="flex border-b border-black/5 px-8 pt-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-8 py-5 text-sm font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? "text-[#1a3326]"
                  : "text-charcoal/40 hover:text-charcoal/70"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeFormTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                />
              )}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-12">
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === "basic" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-3xl">
              <div>
                <label className={labelClass}>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="e.g. Red Bandhani Silk Saree" />
              </div>
              <div>
                <label className={labelClass}>Rich Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} h-40 resize-none`} placeholder="Tell the story of this piece..." />
              </div>
              <div>
                <label className={labelClass}>Store Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  <option value="Sarees">Sarees</option>
                  <option value="Lehengas">Lehengas</option>
                  <option value="Kurtis">Kurtis</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Festive">Festive</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PRICING & INVENTORY */}
          {activeTab === "pricing" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 max-w-4xl">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Selling Price (₹)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Original MRP (₹)</label>
                  <input type="number" name="mrp" value={formData.mrp} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Internal Cost Price (₹)</label>
                  <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Tax Rate (%)</label>
                  <input type="number" name="taxRate" value={formData.taxRate} onChange={handleChange} className={inputClass} />
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent my-8" />

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Stock Keeping Unit (SKU)</label>
                  <input type="text" name="sku" value={formData.sku} onChange={handleChange} className={inputClass} placeholder="SK-2025-RED" />
                </div>
                <div>
                  <label className={labelClass}>Barcode / UPC</label>
                  <input type="text" name="barcode" value={formData.barcode} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Warehouse Stock Count</label>
                  <input type="number" name="stockCount" value={formData.stockCount} onChange={handleChange} className={inputClass} />
                </div>
                <div className="flex items-center gap-4 mt-8 bg-white/40 p-4 rounded-lg border border-white">
                  <input type="checkbox" name="inStock" checked={formData.inStock} onChange={handleChange} className="w-5 h-5 accent-forest rounded" />
                  <label className="font-semibold text-[#1a3326] tracking-wide">Product is currently In Stock</label>
                </div>
              </div>
              
              <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent my-8" />
              <div>
                 <label className={labelClass}>Available Sizes (Variants)</label>
                 <input type="text" name="sizes" value={formData.sizes} onChange={handleChange} className={inputClass} placeholder="e.g. XS, S, M, L, XL" />
                 <p className="text-xs text-charcoal/50 mt-2 font-medium">Enter a comma-separated list to generate variants on the storefront.</p>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CRAFT & DETAILS */}
          {activeTab === "details" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 max-w-4xl">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className={labelClass}>Fabric / Material</label>
                  <input type="text" name="fabric" value={formData.fabric} onChange={handleChange} className={inputClass} placeholder="Pure Banarasi Silk" />
                </div>
                <div>
                  <label className={labelClass}>Dominant Color</label>
                  <input type="text" name="color" value={formData.color} onChange={handleChange} className={inputClass} placeholder="Ruby Red" />
                </div>
                <div>
                  <label className={labelClass}>Craft Type</label>
                  <input type="text" name="craftType" value={formData.craftType} onChange={handleChange} className={inputClass} placeholder="Zari Handwork" />
                </div>
                <div>
                  <label className={labelClass}>Wash Care Instructions</label>
                  <input type="text" name="washCare" value={formData.washCare} onChange={handleChange} className={inputClass} placeholder="Dry Clean Only" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/5">
                 <div>
                  <label className={labelClass}>Shipping Weight (grams)</label>
                  <input type="number" name="weightGrams" value={formData.weightGrams} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Estimated Dispatch Time</label>
                  <input type="text" name="dispatchDays" value={formData.dispatchDays} onChange={handleChange} className={inputClass} placeholder="Ships in 3-5 days" />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: MEDIA & SEO */}
          {activeTab === "media" && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 max-w-4xl">
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-heading text-[#1a3326]">Product Media</h2>
                    <p className="text-sm text-charcoal/60 mt-1">Upload and arrange images. The first image is the main cover.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.multiple = true;
                      input.onchange = handleFileSelect as any;
                      input.click();
                    }}
                    className="flex items-center gap-2 bg-white border border-charcoal/20 text-[#1a3326] px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all font-semibold text-sm"
                  >
                    <Plus size={16} /> Add Image
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-[3/4] bg-white rounded-xl shadow-sm border border-black/5 group overflow-hidden">
                      <img src={img} alt={`Product ${idx+1}`} className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => removeImage(idx)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                        <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                          {idx === 0 ? "Main Cover" : idx === 1 ? "Hover Image" : `Gallery ${idx - 1}`}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {uploadedImages.length === 0 && (
                    <div className="col-span-full py-16 border-2 border-dashed border-black/10 rounded-xl flex flex-col items-center justify-center text-charcoal/40 bg-white/30">
                      <ImageIcon size={48} className="mb-4 opacity-50" />
                      <p className="font-semibold text-charcoal/60">No images uploaded yet.</p>
                      <p className="text-xs mt-1">Click "Add Image" to open the studio.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent my-8" />
              
              <div className="grid grid-cols-2 gap-8">
                <div className="flex items-center gap-4 bg-white/40 p-4 rounded-lg border border-white">
                  <input type="checkbox" name="bestSeller" checked={formData.bestSeller} onChange={handleChange} className="w-5 h-5 accent-forest rounded" />
                  <label className="font-semibold text-[#1a3326] tracking-wide">Feature as Best Seller</label>
                </div>
                <div className="flex items-center gap-4 bg-white/40 p-4 rounded-lg border border-white">
                  <input type="checkbox" name="newArrival" checked={formData.newArrival} onChange={handleChange} className="w-5 h-5 accent-forest rounded" />
                  <label className="font-semibold text-[#1a3326] tracking-wide">Feature as New Arrival</label>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-black/5 to-transparent my-8" />

              <div className="space-y-8">
                <div>
                  <label className={labelClass}>Search Tags</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleChange} className={inputClass} placeholder="bridal, summer, reception" />
                </div>
                <div>
                  <label className={labelClass}>SEO Meta Title</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>SEO Meta Description</label>
                  <textarea name="metaDesc" value={formData.metaDesc} onChange={handleChange} className={`${inputClass} h-32 resize-none`} />
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
