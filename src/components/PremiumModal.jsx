import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLock,
  FaHeadset,
  FaUpload,
  FaUsers,
  FaCloudUploadAlt,
  FaChartLine,
  FaRobot,
  FaCheckCircle,
} from "react-icons/fa";

export default function PremiumModal() {
  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const openModal = () => {
    setSubscribed(false);
    setIsProcessing(false);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSubscribed(false);
    setIsProcessing(false);
  };

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      // small UX delay so user sees the spinner
      await new Promise((r) => setTimeout(r, 700));

      // Build absolute URL target
      const origin = window.location.origin || `${window.location.protocol}//${window.location.host}`;
      const absoluteTarget = `${origin}/book-appointment`;

      // Log for debugging
      console.log("Premium subscribe -> redirecting to:", absoluteTarget);

      // Close the modal first for smooth UX
      setOpen(false);

      // Primary redirect: absolute path
      window.location.assign(absoluteTarget);

      // NOTE: If your hosting / dev server does not have a server route for /book-appointment,
      // the above may fall back to your root page. In that case, the hash-based fallback below
      // works for SPAs (it won't cause server routing issues).
      //
      // If you prefer the hash fallback instead of absolute redirect, uncomment the next line:
      // window.location.href = `${origin}/#book-appointment`;

    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* CTA Button */}
      <div className="mt-4">
        <button
          onClick={openModal}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-amber-400 text-white font-semibold px-5 py-3 rounded-lg shadow-lg hover:scale-[1.03] transition"
        >
          <FaLock className="opacity-90" />
          Unlock Premium Version
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Modal content */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-amber-400 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">Unlock Premium</h3>
                      <p className="text-sm mt-1 opacity-90">
                        AI-driven business insights — just $20/month.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">Starting at</div>
                      <div className="text-2xl font-bold">USD $20</div>
                      <div className="text-xs opacity-90">per month</div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  {!subscribed ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column — Features */}
                        <div className="space-y-5">
                          <FeatureRow
                            icon={<FaHeadset />}
                            title="Priority Support"
                            desc="Dedicated support with responses within 24 hours."
                          />
                          <FeatureRow
                            icon={<FaUpload />}
                            title="Larger Uploads"
                            desc="Handle bigger data sets and seamless parsing for enterprise use."
                          />
                          <FeatureRow
                            icon={<FaCloudUploadAlt />}
                            title="Automated Data Sync"
                            desc="Connect cloud sources for scheduled or bulk uploads."
                          />
                          <FeatureRow
                            icon={<FaUsers />}
                            title="Custom Data Mapping"
                            desc="We’ll map your business-specific KPIs and metrics accurately."
                          />
                        </div>

                        {/* Right Column — Why Upgrade + AI section */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-bold text-black mb-3 text-lg">Why Upgrade?</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                            <li>Get early access to AI-powered business forecasting.</li>
                            <li>Unlock smart insights that adapt to your sales patterns.</li>
                            <li>Upload 10x more data and receive automated summaries.</li>
                            <li>Dedicated data expert support and onboarding.</li>
                          </ul>

                          <div className="mt-5 border-t pt-3">
                            <h5 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                              <FaRobot className="text-pink-500" />
                              AI-Driven Growth
                            </h5>
                            <p className="text-sm text-gray-600">
                              Our premium AI engine analyzes seasonal trends, predicts future sales,
                              and highlights underperforming regions automatically — empowering you
                              to make smarter decisions, faster.
                            </p>
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                            <FaChartLine className="text-amber-500" />
                            Enhanced with Machine Learning & Predictive Modeling
                          </div>
                        </div>
                      </div>

                      {/* Footer section */}
                      <div className="mt-6 border-t pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <div className="text-sm text-gray-600">
                            Start your premium access today — cancel anytime.
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Secure payment & instant activation.
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={closeModal}
                            className="px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                          >
                            Maybe later
                          </button>

                          <button
                            onClick={handleSubscribe}
                            disabled={isProcessing}
                            className="inline-flex items-center gap-3 bg-pink-500 text-white px-5 py-3 rounded-lg shadow hover:scale-[1.02] transition"
                          >
                            {isProcessing ? (
                              <>
                                <span className="w-4 h-4 border-2 border-t-white border-white/30 rounded-full animate-spin inline-block" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <FaLock />
                                Subscribe — $20/mo
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // Success screen (unlikely when redirecting, kept for completeness)
                    <div className="text-center py-8">
                      <div className="flex items-center justify-center mb-4">
                        <FaCheckCircle className="text-green-500 text-5xl" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Subscription Activated</h3>
                      <p className="text-sm text-gray-700 max-w-lg mx-auto mb-4">
                        Your premium access is active! You now have access to AI-powered insights,
                        larger uploads, and dedicated expert support. Expect a welcome email within
                        24 hours.
                      </p>

                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={closeModal}
                          className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 transition"
                        >
                          Close
                        </button>

                        <button
                          onClick={closeModal}
                          className="px-4 py-2 rounded-md bg-pink-500 text-white hover:bg-pink-600 transition"
                        >
                          Go to Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* Reusable feature row with fixed alignment */
function FeatureRow({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 text-lg">
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <div className="font-medium text-gray-800">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </div>
    </div>
  );
}
