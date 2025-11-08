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
      const origin =
        window.location.origin || `${window.location.protocol}//${window.location.host}`;
      const absoluteTarget = `${origin}/book-appointment`;

      // Close the modal first for smooth UX, then redirect
      setOpen(false);
      window.location.assign(absoluteTarget);
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

            {/* Modal content - flex column with constrained height */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-amber-400 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Unlock Premium</h3>
                      <p className="text-xs sm:text-sm mt-1 opacity-90">
                        AI-driven business insights — just $20/month.
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm">Starting at</div>
                      <div className="text-lg sm:text-2xl font-bold">USD $20</div>
                      <div className="text-[10px] sm:text-xs opacity-90">per month</div>
                    </div>
                  </div>
                </div>

                {/* Body (scrollable) */}
                <div className="p-4 sm:p-6 overflow-auto flex-1">
                  {!subscribed ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Left Column — Features */}
                        <div className="space-y-4">
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
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-sm sm:text-base">
                          <h4 className="font-bold text-black mb-2">Why Upgrade?</h4>
                          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2 mb-3">
                            <li>Get early access to AI-powered business forecasting.</li>
                            <li>Unlock smart insights that adapt to your sales patterns.</li>
                            <li>Upload 10x more data and receive automated summaries.</li>
                            <li>Dedicated data expert support and onboarding.</li>
                          </ul>

                          <div className="mt-2 border-t pt-3">
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

                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                            <FaChartLine className="text-amber-500" />
                            Enhanced with Machine Learning & Predictive Modeling
                          </div>
                        </div>
                      </div>

                      {/* Extra explanatory paragraphs for mobile (reduce size) */}
                      <div className="mt-4 text-xs sm:text-sm text-gray-600">
                        <p className="mb-2">
                          Start your premium access for advanced features like priority support, bigger uploads, and AI forecasting.
                        </p>
                        <p className="mb-0">Cancel anytime. Secure payment & instant activation.</p>
                      </div>
                    </>
                  ) : (
                    // Success content (keeps inside scroll area but usually small)
                    <div className="text-center py-4">
                      <div className="flex items-center justify-center mb-3">
                        <FaCheckCircle className="text-green-500 text-4xl" />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold mb-1">Subscription Activated</h3>
                      <p className="text-sm text-gray-700 max-w-lg mx-auto mb-2">
                        Your premium access is active! Expect a welcome email within 24 hours.
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer (kept visible; not part of scroll) */}
                <div className="border-t pt-3 px-4 sm:px-6 py-3 bg-white/95 flex flex-col sm:flex-row items-center sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1 text-sm text-gray-600 text-center sm:text-left">
                    Start your premium access today — cancel anytime.
                    <div className="text-xs text-gray-400 mt-1">Secure payment & instant activation.</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={closeModal}
                      className="px-3 py-2 rounded-md text-gray-700 bg-white hover:bg-gray-100 transition text-sm"
                    >
                      Maybe later
                    </button>

                    <button
                      onClick={handleSubscribe}
                      disabled={isProcessing}
                      className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg shadow hover:scale-[1.02] transition text-sm"
                    >
                      {isProcessing ? (
                        <>
                          <span className="w-4 h-4 border-2 border-t-white border-white/30 rounded-full animate-spin inline-block" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FaLock />
                          <span>Subscribe — $20/mo</span>
                        </>
                      )}
                    </button>
                  </div>
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
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-pink-50 flex items-center justify-center text-pink-600 text-lg">
        {icon}
      </div>
      <div className="flex flex-col justify-center">
        <div className="font-medium text-gray-800 text-sm sm:text-base">{title}</div>
        <div className="text-xs sm:text-sm text-gray-600">{desc}</div>
      </div>
    </div>
  );
}
