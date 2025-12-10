const _baseurl = "https://mindtile-api.vercel.app";

export async function uploadImage(file: File) {
  const signatureResponse = await fetch(`${_baseurl}/api/storage/signature`);

  if (!signatureResponse.ok) {
    throw new Error("Falha ao obter assinatura do backend");
  }

  const { signature, timestamp, cloud_name, api_key, folder } =
    await signatureResponse.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  const cloudinaryResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!cloudinaryResponse.ok) {
    throw new Error("Falha no upload da imagem");
  }

  const data = await cloudinaryResponse.json();
  return data.secure_url;
}
