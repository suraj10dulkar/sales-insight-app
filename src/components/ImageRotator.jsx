import React, { useEffect, useState, useRef } from "react";

export default function ImageRotator({ visibleCount = 5, intervalMs = 5000 }) {
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
  const [visible, setVisible] = useState(visibleCount);
  const timerRef = useRef(null);

  // 🔹 Detect screen size and adjust visible image count dynamically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        // Mobile screens (<640px) → show 1 image
        setVisible(1);
      } else {
        // Larger screens → show default count (5)
        setVisible(visibleCount);
      }
    };

    handleResize(); // run once at mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visibleCount]);

  // 🔹 Rotate every intervalMs
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setStartIndex((s) => (s + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [intervalMs, images.length]);

  // 🔹 Select images to display
  const windowImgs = [];
  for (let i = 0; i < visible; i++) {
    const idx = (startIndex + i) % images.length;
    windowImgs.push({ src: images[idx], alt: `Business image ${idx + 1}` });
  }

  return (
    <div className="image-rotator-container max-w-7xl mx-auto px-6 my-8">
      <div className="rotator-header flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <h3 className="text-lg font-semibold text-slate-700">
          Visual Stories — Business & Data
        </h3>
        <div className="text-sm text-slate-500 mt-1 sm:mt-0">
          Fresh images rotate every 5s • curated for data & meetings
        </div>
      </div>

      <div className="rotator-window overflow-hidden rounded-xl shadow-md bg-white">
        <div
          className="rotator-track flex gap-3 p-4 transition-transform duration-700 ease-out"
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
                className="w-full h-72 sm:h-64 object-cover transform hover:scale-105 transition-transform duration-500"
                onError={(e) => {
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
