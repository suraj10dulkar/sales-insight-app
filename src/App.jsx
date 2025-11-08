// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Hero from "./components/Hero";
import FileUploader from "./components/FileUploader";
import Dashboard from "./components/Dashboard";
import { read, utils } from "xlsx";
import { normalizeRows } from "./utils/parse";
import ImageRotator from "./components/ImageRotator";
import Footer from "./components/Footer";
import AppointmentModal from "./components/AppointmentModal";
import AppointmentBookingPage from "./pages/AppointmentBookingPage";

export default function App() {
  const [rows, setRows] = useState([]);

  // trigger file input inside FileUploader
  const triggerUpload = () => {
    const el = document.querySelector('input[type="file"][accept=".xlsx,.xls,.csv"]');
    if (el) el.click();
  };

  // Programmatically fetch & parse the sample xlsx from /public
  async function loadSampleFile() {
    try {
      const res = await fetch("/sample_sales_data.xlsx");
      if (!res.ok) {
        throw new Error("Failed to fetch sample file from /sample_sales_data.xlsx");
      }
      const ab = await res.arrayBuffer();
      const workbook = read(ab);
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const json = utils.sheet_to_json(ws, { defval: null });
      const parsed = json.map((r, i) => normalizeRows(r, i)).filter(Boolean);
      setRows(parsed);
      console.log("Loaded sample rows:", parsed.length);
    } catch (err) {
      console.error("Error loading sample file:", err);
      alert("Could not load sample file. Ensure sample_sales_data.xlsx is in your public folder.");
    }
  }

  // Listen for custom 'load-sample' event (Hero may dispatch this)
  useEffect(() => {
    const onLoadSample = (e) => {
      console.log("load-sample event:", e?.detail);
      loadSampleFile();
    };
    window.addEventListener("load-sample", onLoadSample);
    return () => window.removeEventListener("load-sample", onLoadSample);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main dashboard route */}
        <Route
          path="/"
          element={
            <div>
              <Hero onUploadClick={triggerUpload} />
              <ImageRotator visibleCount={5} intervalMs={5000} />
              <main className="max-w-6xl mx-auto px-6 -mt-8">
                <FileUploader
                  onData={(parsedRows) => {
                    console.log("App received parsed rows:", parsedRows.length);
                    setRows(parsedRows);
                  }}
                />
                <Dashboard rows={rows} />
              </main>

              <AppointmentModal />
              <Footer />
            </div>
          }
        />

        {/* Booking page route */}
        <Route path="/book-appointment" element={<AppointmentBookingPage />} />

        {/* Catch-all -> redirect to root (prevents blank pages) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
