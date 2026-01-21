"use client";

import Image from "next/image";

interface ImageItem {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageStripProps {
  images: ImageItem[];
}

export function ImageStrip({ images }: ImageStripProps) {
  return (
    <div className="my-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image, index) => (
          <div
            key={image.src}
            className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]
                       hover:border-white/20 transition-all duration-300"
          >
            {/* Image container with aspect ratio */}
            <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover object-top transition-transform duration-500
                           group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Subtle overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Caption */}
            {image.caption && (
              <div className="p-4 bg-white/[0.03]">
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {image.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
