// Unsigned browser upload to Cloudinary.
// Cloudinary and Supabase do NOT talk to each other directly: we upload the file
// here, get back a hosted URL (secure_url), and store that string in Supabase.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

/**
 * Upload an image or video to Cloudinary and return its hosted URL.
 * `resourceType` is "auto" by default so it handles both images and the hero video.
 */
export async function uploadToCloudinary(
  file: File | Blob,
  resourceType: "image" | "video" | "auto" = "auto"
): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      "Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and " +
        "VITE_CLOUDINARY_UPLOAD_PRESET in .env (see SETUP.md)."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || "Cloudinary upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}
