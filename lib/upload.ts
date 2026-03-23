export async function uploadImage(file: File) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "pixloc_unsigned");
    formData.append("folder", "pixloc-products");

    const res = await fetch(
        "https://api.cloudinary.com/v1_1/dzndn0tqj/image/upload",
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await res.json();

    if (!data.secure_url) {
        throw new Error("Upload image échoué");
    }

    return data.secure_url as string;
}