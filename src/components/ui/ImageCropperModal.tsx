import React, { useState, useRef } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, Check, X } from "lucide-react";
import "cropperjs/dist/cropper.css";

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  aspectRatio: number;
  onClose: () => void;
  onSave: (blob: Blob) => void;
  title?: string;
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  aspectRatio,
  onClose,
  onSave,
  title = "Edit Image",
}: ImageCropperModalProps) {
  const cropperRef = useRef<ReactCropperElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSave = () => {
    setIsProcessing(true);
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          onSave(blob);
        }
        setIsProcessing(false);
      }, "image/png");
    }
  };

  const handleRotateLeft = () => cropperRef.current?.cropper?.rotate(-90);
  const handleRotateRight = () => cropperRef.current?.cropper?.rotate(90);
  
  const handleFlipHorizontal = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const currentScaleX = cropper.getData().scaleX || 1;
      cropper.scaleX(-currentScaleX);
    }
  };

  const handleFlipVertical = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const currentScaleY = cropper.getData().scaleY || 1;
      cropper.scaleY(-currentScaleY);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-black/10">
              <h3 className="font-heading text-2xl text-[#1a3326]">{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 text-charcoal/50 hover:text-charcoal hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cropper Container */}
            <div className="flex-1 bg-black/5 p-6 overflow-hidden min-h-[400px] flex items-center justify-center relative">
              <Cropper
                src={imageSrc}
                style={{ height: "100%", width: "100%", maxHeight: "50vh" }}
                aspectRatio={aspectRatio}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                dragMode="move"
                background={false}
                autoCropArea={1}
              />
            </div>

            {/* Toolbar & Footer */}
            <div className="p-6 bg-white border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              
              {/* Tools */}
              <div className="flex items-center gap-2">
                <button onClick={handleRotateLeft} className="p-3 text-[#1a3326] hover:bg-black/5 rounded-lg border border-black/10 transition-colors" title="Rotate Left">
                  <RotateCcw size={20} />
                </button>
                <button onClick={handleRotateRight} className="p-3 text-[#1a3326] hover:bg-black/5 rounded-lg border border-black/10 transition-colors" title="Rotate Right">
                  <RotateCw size={20} />
                </button>
                <div className="w-px h-6 bg-black/10 mx-2" />
                <button onClick={handleFlipHorizontal} className="p-3 text-[#1a3326] hover:bg-black/5 rounded-lg border border-black/10 transition-colors" title="Flip Horizontal">
                  <FlipHorizontal size={20} />
                </button>
                <button onClick={handleFlipVertical} className="p-3 text-[#1a3326] hover:bg-black/5 rounded-lg border border-black/10 transition-colors" title="Flip Vertical">
                  <FlipVertical size={20} />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-6 py-3 font-semibold text-charcoal bg-black/5 hover:bg-black/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="flex-1 sm:flex-none px-6 py-3 font-bold text-[#1a3326] bg-gradient-to-r from-gold to-[#e8c875] hover:shadow-lg rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Check size={18} />
                  {isProcessing ? "Processing..." : "Apply & Save"}
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
