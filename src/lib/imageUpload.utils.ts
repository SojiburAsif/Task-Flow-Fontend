import { publicEnv } from "./env";


export const uploadToImgbb = async (file: File) => {
  const apiKey = publicEnv.NEXT_PUBLIC_IIMGBB_KEY; // Ensure this is in your .env
  if (!apiKey) throw new Error("ImgBB API Key is missing");

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!json.success) throw new Error(json.error.message || "Upload failed");
  
  return json.data.url as string;
};