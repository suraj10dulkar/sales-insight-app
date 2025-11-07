import React, { useEffect, useState, useRef } from "react";

/**
 * ImageRotator
 * - shows a sliding window of images side-by-side
 * - every 5s the window advances by 1 image (wraps around)
 * - props:
 *    visibleCount (number) - how many images shown side-by-side (default 5)
 *    intervalMs (number) - how often to rotate in ms (default 5000)
 */
export default function ImageRotator({ visibleCount = 5, intervalMs = 5000 }) {
  // 10 curated Unsplash image queries (business / excel / analytics / meeting)
  const images = [
    "image/image_1.webp",
    "image/image_2.png",
    "image/image_3.webp",
    "image/image_4.jpg",
    "image/image_5.jpg",
    "image/image_6.webp",
    "image/image_7.png",
    "image/image_8.avif",
    "image/image_9.jpg",
    "image/image_10.jpg",
  ];

  const [startIndex, setStartIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // rotate index every intervalMs
    timerRef.current = setInterval(() => {
      setStartIndex((s) => (s + 1) % images.length);
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [intervalMs, images.length]);

  // produce the current slice of images to display (wrap-around)
  const windowImgs = [];
  for (let i = 0; i < visibleCount; i++) {
    const idx = (startIndex + i) % images.length;
    windowImgs.push({ src: images[idx], alt: `Business image ${idx + 1}` });
  }

  return (
    <div className="image-rotator-container max-w-7xl mx-auto px-6 my-8">
      <div className="rotator-header flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-700">Visual Stories — Business & Data</h3>
        <div className="text-sm text-slate-500">Fresh images rotate every 5s • curated for data & meetings</div>
      </div>

      <div className="rotator-window overflow-hidden rounded-xl shadow-md bg-white">
        <div
          className="rotator-track flex gap-3 p-4 transition-transform duration-700 ease-out"
          // small translate for subtle slide (CSS handles fade)
          style={{ transform: `translateX(0)` }}
        >
          {windowImgs.map((img, i) => (
            <figure
              key={i}
              className="rotator-item flex-1 min-w-0 rounded-lg overflow-hidden bg-gray-100"
              title={img.alt}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-72 object-cover transform hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // fallback: remove broken src to avoid broken image icon
                  e.currentTarget.style.display = "none";
                }}
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
