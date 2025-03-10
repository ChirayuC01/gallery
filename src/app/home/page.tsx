"use client";

import LogoutButton from "@/components/LogoutButton";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to Our Family Gallery
          </h1>
          <LogoutButton />
        </div>
        <p className="text-gray-600 mb-4">
          This gallery is a collection of our cherished family moments, captured
          in photos and videos. We hope you enjoy looking back at these
          wonderful memories.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Image
            src="https://picsum.photos/400/300"
            alt="Family photo 1"
            width={400}
            height={300}
            className="rounded-lg"
          />
          <Image
            src="https://picsum.photos/400/300?random=2"
            alt="Family photo 2"
            width={400}
            height={300}
            className="rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
