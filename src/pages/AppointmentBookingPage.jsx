import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import dayjs from "dayjs";

/**
 * AppointmentBookingPage
 * - full background image from /public/image/premium-appointment-button.webp
 * - form overlay with back button to "/"
 */

export default function AppointmentBookingPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    businessType: "",
    dateTime: "",
    location: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function escapeICSText(text = "") {
    return text.replace(/\n/g, "\\n").replace(/,/g, "\\,");
  }

  function downloadICS() {
    if (!form.dateTime || !form.fullName || !form.email) {
      alert("Please provide Full name, Email, and Date/Time to generate invite.");
      return;
    }

    const dt = dayjs(form.dateTime);
    const start = dt.utc().format("YYYYMMDDTHHmmss") + "Z";
    const end = dt.add(30, "minute").utc().format("YYYYMMDDTHHmmss") + "Z";

    const uid = `invite-${Date.now()}@sales-insights.app`;
    const summary = `Sales Insights — Call with ${form.fullName}`;
    const description = `Appointment requested by ${form.fullName} (${form.email}). Notes: ${form.notes || "-"}`;
    const location = form.location || "Online";

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Sales Insights//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `DTSTAMP:${dayjs().utc().format("YYYYMMDDTHHmmss")}Z`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escapeICSText(summary)}`,
      `DESCRIPTION:${escapeICSText(description)}`,
      `LOCATION:${escapeICSText(location)}`,
      `UID:${uid}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ];

    const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sales-insights-invite.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.dateTime) {
      alert("Please fill Full name, Email and Date & Time.");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Submission failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: "url('/image/premium-appointment-button.webp')",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 max-w-xl text-center">
          <div className="flex items-center justify-center mb-4">
            <FaCheckCircle className="text-green-500 text-5xl" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Appointment Confirmed!</h2>
          <p className="text-gray-700 mb-4">
            Your details are submitted. Our support team will contact you within 24 hours to
            confirm your meeting.
          </p>
          <div className="text-sm text-gray-500 mb-6">
            Confirmation sent to: <strong>{form.email}</strong>
          </div>

          <div className="flex justify-center gap-3">
            <a
              href="/"
              className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 transition"
            >
              Back to Dashboard
            </a>
            <button
              onClick={() =>
                setSubmitted(false) ||
                setForm({
                  fullName: "",
                  email: "",
                  businessType: "",
                  dateTime: "",
                  location: "",
                  notes: "",
                })
              }
              className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
            >
              Book Another
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage: "url('/image/premium-appointment-button.webp')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 w-full max-w-3xl">
        {/* Back button */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Book Your Appointment
          </h1>
          <a
            href="/"
            className="text-sm text-sky-700 hover:underline font-medium"
          >
            ← Back to Dashboard
          </a>
        </div>

        <p className="text-gray-600 mb-6">
          Fill in your details below — our support team will confirm within 24
          hours and send a calendar invite.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full name
              </label>
              <input
                required
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                required
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full border px-3 py-2 rounded-md"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Business type
              </label>
              <input
                name="businessType"
                value={form.businessType}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="e.g. Retail, SaaS"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Location (City / Region)
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Bengaluru, India"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Date & Time
              </label>
              <input
                required
                name="dateTime"
                value={form.dateTime}
                onChange={handleChange}
                type="datetime-local"
                className="w-full border px-3 py-2 rounded-md"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Notes (optional)
              </label>
              <input
                name="notes"
                value={form.notes}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-md"
                placeholder="Short context about your business..."
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={downloadICS}
              className="px-4 py-2 rounded-md bg-white border hover:bg-gray-50"
            >
              Download Calendar Invite
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="ml-auto px-5 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700"
            >
              {submitting ? "Submitting..." : "Submit Booking Request"}
            </button>
          </div>

          <div className="text-sm text-gray-500 mt-2">
            After submitting, our team will reach out within 24 hours.
          </div>
        </form>
      </div>
    </main>
  );
}
