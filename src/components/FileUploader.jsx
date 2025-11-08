import React, { useState, useRef } from "react";
import { read, utils } from "xlsx";
import Papa from "papaparse";
import { normalizeRows } from "../utils/parse";

export default function FileUploader({ onData, onParsingStart, onParsingEnd }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  async function handleFileObject(file) {
    setError(null);
    setIsParsing(true);
    if (typeof onParsingStart === "function") onParsingStart();
    setFileName(file.name || "file");

    try {
      const ext = (file.name || "").split(".").pop().toLowerCase();
      if (ext === "csv") {
        await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const json = results.data;
              const rows = json.map((r, i) => normalizeRows(r, i)).filter(Boolean);
              onData(rows);
              resolve();
            },
            error: (err) => {
              reject(err);
            },
          });
        });
      } else if (ext === "xlsx" || ext === "xls") {
        const ab = await file.arrayBuffer();
        const wb = read(ab);
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = utils.sheet_to_json(ws, { defval: null });
        const rows = json.map((r, i) => normalizeRows(r, i)).filter(Boolean);
        onData(rows);
      } else {
        setError("Unsupported file type — please upload .csv, .xlsx, or .xls");
        onData([]); // signal no data
      }
    } catch (err) {
      console.error(err);
      setError("Failed to parse file. Try a different file or check format.");
      onData([]); // inform parent of failure
    } finally {
      setIsParsing(false);
      if (typeof onParsingEnd === "function") onParsingEnd();
    }
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileObject(file);
    // reset so same file can be re-uploaded if needed
    e.target.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileObject(file);
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  return (
    <div className="w-full">
      <div className="relative rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 p-1 shadow-xl">
        <div className="bg-white/95 dark:bg-slate-900/80 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
          {/* Top header: stacks on mobile */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {/* Left: animated headline */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 justify-center sm:justify-start">
                <div
                  aria-hidden
                  className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white animate-pulse-slow mx-auto sm:mx-0"
                >
                  {/* simple SVG analytics icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-95">
                    <path d="M3 3v18h18" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="6" y="12" width="2.6" height="6" rx="0.6" fill="white" />
                    <rect x="11" y="8" width="2.6" height="10" rx="0.6" fill="white" />
                    <rect x="16" y="4" width="2.6" height="14" rx="0.6" fill="white" />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3 className="text-white text-lg sm:text-xl font-semibold leading-tight">
                    <span className="inline-block pr-1">Upload your files</span>
                    <span className="inline-block ml-1 text-sm opacity-90 block sm:inline">— see your sales insights in a sec</span>
                  </h3>
                  <p className="mt-1 text-white/90 text-sm">
                    Accepts <strong>.csv</strong>, <strong>.xlsx</strong>, and <strong>.xls</strong>. Drag &amp; drop or click to choose a file.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: optional CTA placeholder (keeps layout) */}
            <div className="flex-shrink-0 hidden sm:flex items-center">
              {/* reserved for future CTA */}
            </div>
          </div>

          {/* Drop zone card */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            className={`mt-4 sm:mt-6 border-2 ${dragActive ? "border-dashed border-white/90 bg-white/5" : "border-dashed border-white/30 bg-white/3"} rounded-xl p-4 sm:p-6 transition-all duration-200`}
          >
            {/* Use column on mobile so button doesn't overlap text */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="rounded-md bg-white/6 p-3 flex-shrink-0">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-white/90">
                      <path d="M12 3v12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 7l4-4 4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="min-w-0 text-center sm:text-left">
                    <div className="text-white font-medium text-sm sm:text-base">Drag & drop your file here</div>
                    <div className="text-xs sm:text-sm text-white/80 mt-1">
                      Or click to browse from your computer — supported: <span className="font-semibold">.csv</span>, <span className="font-semibold">.xlsx</span>, <span className="font-semibold">.xls</span>
                    </div>
                  </div>
                </div>

                {/* file info / status */}
                <div className="mt-4">
                  {isParsing ? (
                    <div className="flex items-center gap-3 justify-center sm:justify-start">
                      <svg className="animate-spin h-5 w-5 text-white/90" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"></circle>
                        <path className="opacity-95" d="M4 12a8 8 0 018-8" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"></path>
                      </svg>
                      <div className="text-sm text-white/90">Parsing <strong>{fileName}</strong> — building your insights...</div>
                    </div>
                  ) : fileName ? (
                    <div className="text-sm text-white/90 text-center sm:text-left">
                      Selected file: <strong>{fileName}</strong>
                      {error && <div className="mt-1 text-xs text-rose-200">{error}</div>}
                    </div>
                  ) : (
                    <div className="text-sm text-white/70 text-center sm:text-left">No file chosen yet.</div>
                  )}
                </div>
              </div>

              {/* Right column: Browse button (placed below on mobile) */}
              <div className="flex-shrink-0 flex flex-col items-center sm:items-end gap-3">
                <input
                  aria-label="Upload file"
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleInputChange}
                  className="hidden"
                />
                <label
                  htmlFor="file"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/12 rounded-lg text-white cursor-pointer select-none text-sm sm:text-base"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-95">
                    <path d="M12 3v12" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 7l4-4 4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Browse files
                </label>

                {/* optional small hint under the button on mobile */}
                <div className="hidden sm:block text-xs text-white/60">We never upload your files — processing happens in your browser.</div>
              </div>
            </div>

            {/* show the hint under the drop zone for mobile */}
            <div className="mt-3 block sm:hidden text-xs text-white/60 text-center">
              We never upload your files — processing happens in your browser.
            </div>
          </div>

          {/* error / hint row */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-white/70 text-center sm:text-left">
              Pro tip: sample file includes Date, Product, Region, Sales, Quantity columns — we’ll auto-detect similar headers.
            </div>
            <div>
              {error ? (
                <div className="text-xs text-rose-200">{error}</div>
              ) : (
                <div className="hidden sm:block text-xs text-white/60">We never upload your files — processing happens in your browser.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
