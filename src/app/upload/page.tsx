"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleBulkUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;

    const files = Array.from(event.target.files);
    const category = "family";

    setUploading(true);
    setMessage("");

    const uploadedFiles = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const filePath = `uploads/${Date.now()}-${file.name}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from("gallery")
        .upload(filePath, file);

      if (error) {
        console.error("🛑 Storage Upload Error:", error);
        continue; // Skip this file if upload fails
      }

      // Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from("gallery")
        .getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      // Determine file type
      const fileType = file.type.startsWith("image") ? "image" : "video";

      // Handle video thumbnails (pre-generated)
      let thumbnailUrl = null;
      if (fileType === "video") {
        const thumbnailPath = `thumbnails/${Date.now()}-${file.name}.jpg`; // Thumbnail path

        // Upload pre-generated thumbnail (if available)
        const { data: thumbData, error: thumbError } = await supabase.storage
          .from("gallery")
          .upload(thumbnailPath, new File([], "placeholder.jpg")); // Replace with real thumbnail file

        if (!thumbError) {
          const { data: thumbPublicUrl } = supabase.storage
            .from("gallery")
            .getPublicUrl(thumbnailPath);
          thumbnailUrl = thumbPublicUrl.publicUrl;
        }
      }

      // Store data for batch insert
      uploadedFiles.push({
        url: publicUrl,
        type: fileType,
        category,
        thumbnail_url: thumbnailUrl,
      });
    }

    // Insert metadata into Supabase Database
    if (uploadedFiles.length > 0) {
      const { error: insertError } = await supabase
        .from("media")
        .insert(uploadedFiles);
      if (insertError) {
        console.error("🛑 Database Insert Error:", insertError);
        setMessage(`Database update failed: ${insertError.message}`);
      } else {
        console.log("✅ All media inserted into database");
        setMessage("Bulk upload successful!");
      }
    }

    setUploading(false);
  };

  // Upload file to Supabase Storage
  const handleUpload = async () => {
    if (!file || !category) {
      setMessage("Please select a file and category.");
      return;
    }

    setUploading(true);
    setMessage("");

    const fileExt = file.name.split(".").pop();
    const filePath = `uploads/${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("gallery") // Make sure your bucket name is "gallery"
      .upload(filePath, file);

    if (error) {
      setMessage(`Upload failed: ${error.message}`);
      setUploading(false);
      return;
    }

    // Generate public URL
    const { data: publicUrlData } = supabase.storage
      .from("gallery")
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    // Determine file type (image or video)
    const fileType = file.type.startsWith("image") ? "image" : "video";

    // Save file info to Supabase Database
    const { error: insertError } = await supabase
      .from("media")
      .insert([{ url: publicUrl, type: fileType, category }]);

    if (insertError) {
      setMessage(`Database update failed: ${insertError.message}`);
    } else {
      setMessage("Upload successful!");
    }

    setUploading(false);
    setFile(null);
    setCategory("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Upload Media</h1>
{*/
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="mb-4"
      />
*/}

      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleBulkUpload}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Select Category</option>
        <option value="family">Family</option>
        <option value="events">Events</option>
        <option value="vacation">Vacation</option>
      </select>

      <button
        onClick={handleUpload}
        disabled={uploading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {message && <p className="mt-4 text-red-600">{message}</p>}
    </div>
  );
}
