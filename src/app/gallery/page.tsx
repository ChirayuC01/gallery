"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import ReactPlayer from "react-player";
import Modal from "react-modal";

// Set the modal root element
Modal.setAppElement("#modal-root");

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  category?: string;
}

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch media from Supabase
  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase.from("media").select("*");

      if (error) {
        console.error("Error fetching media:", error);
      } else {
        console.log("✅ Media fetched:", data);
        setMedia(data);
      }
    };

    fetchMedia();
  }, []);

  // Open modal
  const openModal = (item: MediaItem) => {
    setSelectedMedia(item);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Family Gallery</h1>

        {/* Media Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer"
              onClick={() => openModal(item)}
            >
              {item.type === "image" ? (
                <Image
                  src={item.url}
                  alt="Gallery item"
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                  unoptimized
                />
              ) : (
                <div className="relative">
                  <Image
                    src={`${item.url}?thumbnail=true`}
                    alt="Video thumbnail"
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-bold">
                    ▶ Play
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Enlarged Image/Video */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70"
      >
        {selectedMedia && (
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl">
            {selectedMedia.type === "image" ? (
              <Image
                src={selectedMedia.url}
                alt="Selected media"
                width={800}
                height={600}
                className="max-h-[90vh] rounded-lg"
                unoptimized
              />
            ) : (
              <ReactPlayer
                url={selectedMedia.url}
                controls
                playing
                width="100%"
                height="100%"
              />
            )}
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
