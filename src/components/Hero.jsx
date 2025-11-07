import React from "react";
import PremiumModal from "./PremiumModal";


/**
 * Hero component with full background image and sample file download
 *
 * Props:
 *  - onUploadClick: function - called when primary CTA is clicked (should open file picker)
 *
 * Behavior:
 *  - Try Trial Version -> calls onUploadClick() if provided; otherwise dispatches 'load-sample' event
 *  - Download sample file -> downloads /sample_sales_data.xlsx from public folder
 */
export default function Hero({ onUploadClick }) {
  // Download sample file from public folder
  const handleSampleDownload = () => {
    const link = document.createElement("a");
    link.href = "/sample_sales_data.xlsx"; // ensure this file exists in /public
    link.download = "sample_sales_data.xlsx";
    link.click();
  };

  // Try Trial: prefer to call parent's upload handler; fallback to dispatch 'load-sample'
  const handleTryTrial = () => {
    if (typeof onUploadClick === "function") {
      onUploadClick(); // parent should click the hidden file input
      return;
    }
    // fallback: dispatch window event which parent can catch and load programmatically
    const event = new CustomEvent("load-sample", { detail: { source: "hero-trial" } });
    window.dispatchEvent(event);
  };

  return (
    <header className="relative overflow-hidden">
      {/* Background image (Cognism) */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{
          backgroundImage:
             "url('/image/banner_hero.webp')",
        }}
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-sm" />

      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-md bg-white/10 p-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M3 7h18" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                  <path
                    d="M8 7v-1a2 2 0 012-2h4a2 2 0 012 2v1"
                    stroke="white"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect x="5" y="8" width="14" height="11" rx="2" stroke="white" strokeWidth="1.4" />
                </svg>
              </div>
              <div className="text-sm font-medium uppercase tracking-wider opacity-90">
                Sales & Business
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
              Sales Insights
              <span className="block text-sky-100 mt-2 text-lg font-medium opacity-90">
                Turn your spreadsheets into actionable data — charts, trends & KPIs in seconds.
              </span>
            </h1>

            <p className="mt-6 text-gray-100 max-w-xl">
              Upload your sales data (CSV / Excel) and instantly explore revenue trends, top
              products, regional splits and downloadable PDF reports — all processed securely in
              your browser.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {/* Primary CTA: Try Trial Version */}
              <button
                onClick={handleTryTrial}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-[1.05] hover:shadow-xl transition-transform duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="white"
                  className="w-5 h-5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4-4-4 4z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
                Try Trial Version
              </button>

              {/* Secondary: Download sample file */}
              <button
                onClick={handleSampleDownload}
                className="inline-flex items-center gap-2 px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/12 transition"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14m0 0l-5-5m5 5l5-5" />
                </svg>
                Download sample file
              </button>
            </div>
            {/* Unlock Premium button (renders inside PremiumModal) */}
            <PremiumModal />
          </div>

          {/* Right Section (metrics preview card) */}
          <div className="hidden lg:block bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
            <div className="text-lg font-semibold mb-2">Instant Insights</div>
            <p className="text-sm text-gray-200 mb-4">
              See your sales metrics update live as you upload your files — revenue, trends, and
              regional data.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">₹1.2M</div>
                <div className="text-xs text-gray-300">Total Sales</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">48</div>
                <div className="text-xs text-gray-300">Regions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">92%</div>
                <div className="text-xs text-gray-300">Growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
