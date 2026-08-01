export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default'); // preset por defecto o fallback demo

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Cloudinary upload failed: ${res.statusText}`);
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error al subir a Cloudinary, usando fallback:', error);
    // Si falla o no hay credenciales, retornamos un data URL o placeholder limpio
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
