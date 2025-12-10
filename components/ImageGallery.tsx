"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "./Lightbox";

/**
 * Image Gallery Component
 *
 * Displays a grid of tour images with lightbox functionality
 *
 * Features:
 * - Grid layout with main image + thumbnails
 * - Click to open full-screen lightbox
 * - Keyboard navigation (arrow keys, escape)
 * - Touch/swipe support for mobile
 * - Responsive design
 */

interface ImageGalleryProps {
  images: string[];
  tourName: string;
}

export default function ImageGallery({ images, tourName }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Show single image layout if only one image
  if (images.length === 1) {
    return (
      <>
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden cursor-pointer">
          <Image
            src={images[0]}
            alt={tourName}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            onClick={() => openLightbox(0)}
          />
        </div>
        {lightboxOpen && (
          <Lightbox
            images={images}
            currentIndex={currentIndex}
            onClose={closeLightbox}
            onNext={goToNext}
            onPrevious={goToPrevious}
            tourName={tourName}
          />
        )}
      </>
    );
  }

  // Grid layout for multiple images
  const mainImage = images[0];
  const thumbnails = images.slice(1, 5); // Show up to 4 thumbnails
  const remainingCount = images.length > 5 ? images.length - 5 : 0;

  return (
    <>
      <div className="grid grid-cols-4 gap-2 h-[500px]">
        {/* Main Image - Takes up 2 columns and full height */}
        <div
          className="col-span-2 row-span-2 relative rounded-xl overflow-hidden cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={mainImage}
            alt={`${tourName} - Main view`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>

        {/* Thumbnail Grid - 2 columns x 2 rows */}
        {thumbnails.map((image, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
            onClick={() => openLightbox(index + 1)}
          >
            <Image
              src={image}
              alt={`${tourName} - View ${index + 2}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            {/* Show "+X more" overlay on last thumbnail if there are more images */}
            {index === thumbnails.length - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-2xl font-semibold">
                  +{remainingCount} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNext={goToNext}
          onPrevious={goToPrevious}
          tourName={tourName}
        />
      )}
    </>
  );
}
