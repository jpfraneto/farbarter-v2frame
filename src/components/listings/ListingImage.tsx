import { Suspense } from "react";

interface ListingImageProps {
  imageUrl?: string;
  alt: string;
}

export function ListingImage({ imageUrl, alt }: ListingImageProps) {
  return (
    <div className="relative w-full h-64">
      <Suspense
        fallback={<div className="w-full h-full bg-slate-800 animate-pulse" />}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </Suspense>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
    </div>
  );
}
