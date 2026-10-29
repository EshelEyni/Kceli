// Cloud name and unsigned upload preset are public client configuration, never secrets.
export const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "";
export const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "";
