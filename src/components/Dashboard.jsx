import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import StatCard from "./StatCard";

/* Simulated API delay */
const SIMULATED_DELAY_MS = 500; // set to 5 if you truly want 5ms

export default function Dashboard({ rows = [] }) {
  const summary = useMemo(() => computeSummary(rows), [rows]);

  // AI feedback state: keyed by section id
  const [aiState, setAiState] = useState({
    monthly: { loading: false, result: null, timeMs: 0 },
    region: { loading: false, result: null, timeMs: 0 },
    products: { loading: false, result: null, timeMs: 0 },
  });

  function runAIFeedback(sectionKey) {
    // set loading
    setAiState((s) => ({ ...s, [sectionKey]: { loading: true, result: null, timeMs: 0 } }));
    const start = Date.now();

    setTimeout(() => {
      const delta = Date.now() - start;
      const result = generateAIResponse(summary, sectionKey);
      setAiState((s) => ({ ...s, [sectionKey]: { loading: false, result, timeMs: delta } }));
    }, SIMULATED_DELAY_MS);
  }

  function exportToPDF(summary) {
    if (!summary || !summary.totalSales) {
      alert("No data to export.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("Sales Insights Report", 40, 50);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 70);

    const summaryRows = [
      ["Total Sales", `₹ ${Number(summary.totalSales || 0).toLocaleString()}`],
      ["Total Quantity", `${Number(summary.totalQuantity || 0).toLocaleString()}`],
      ["Best Month", summary.bestMonth?.month ?? "-"],
      ["Top Region", summary.topRegion?.region ?? "-"],
      ["Top Product", summary.topProducts?.[0]?.product ?? "-"],
    ];

    autoTable(doc, {
      startY: 90,
      head: [["Metric", "Value"]],
      body: summaryRows,
      theme: "grid",
    });

    const startY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 160;
    const prodBody = (summary.topProducts || []).slice(0, 50).map((p) => [
      p.product,
      `₹ ${Number(p.sales).toLocaleString()}`,
      Number(p.quantity).toLocaleString(),
    ]);
    autoTable(doc, {
      startY,
      head: [["Product", "Sales", "Quantity"]],
      body: prodBody,
      styles: { fontSize: 10 },
      theme: "striped",
    });

    doc.save("sales-insights-report.pdf");
  }

  // Placeholder because rows empty: show "No data yet"
  if (!rows || rows.length === 0) {
    return (
      <section className="mt-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-2">No data yet</h2>
          <p className="text-sm text-gray-600 mb-6">
            Upload an Excel/CSV file to see Monthly Sales Trend, Sales by Region, Top Products and more.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Rows" value={rows.length} />
        <StatCard title="Total Sales" value={`₹ ${formatNumber(summary.totalSales)}`} />
        <StatCard title="Total Quantity" value={formatNumber(summary.totalQuantity)} />
      </div>

      {/* Trend + Region */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-700">Monthly Sales Trend</h3>
            <div>
              <button
                onClick={() => exportToPDF(summary)}
                className="inline-flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-1 rounded hover:opacity-95 transition"
              >
                Export PDF
              </button>
            </div>
          </div>

          {summary.monthlySeries.length ? (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <LineChart data={summary.monthlySeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-10">No monthly data available.</div>
          )}

          {/* AI CTA and response for monthly */}
          <div className="mt-4">
            <button
              onClick={() => runAIFeedback("monthly")}
              className="inline-flex items-center gap-2 px-3 py-1 bg-sky-600 text-white rounded hover:opacity-95 transition"
            >
              Get your AI-generated forecast insight
            </button>

            <div className="mt-3">
              {aiState.monthly.loading ? (
                <div className="text-sm text-gray-600 flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-t-sky-600 rounded-full animate-spin inline-block" />
                  Getting AI insight...
                </div>
              ) : aiState.monthly.result ? (
                <ForecastCard result={aiState.monthly.result} timeMs={aiState.monthly.timeMs} />
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-medium text-gray-700 mb-2">Sales by Region</h3>
          {summary.regionSeries.length ? (
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={summary.regionSeries} dataKey="sales" nameKey="region" outerRadius={90} label>
                    {summary.regionSeries.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={pickColor(idx)} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-10">No region data available.</div>
          )}

          {/* AI CTA and response for region */}
          <div className="mt-4">
            <button
              onClick={() => runAIFeedback("region")}
              className="inline-flex items-center gap-2 px-3 py-1 bg-sky-600 text-white rounded hover:opacity-95 transition"
            >
              Get your AI-generated forecast insight
            </button>

            <div className="mt-3">
              {aiState.region.loading ? (
                <div className="text-sm text-gray-600 flex items-center gap-3">
                  <span className="w-4 h-4 border-2 border-t-sky-600 rounded-full animate-spin inline-block" />
                  Getting AI insight...
                </div>
              ) : aiState.region.result ? (
                <ForecastCard result={aiState.region.result} timeMs={aiState.region.timeMs} />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products (full width) */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-medium text-gray-700 mb-3">Top Products</h3>

        {summary.topProducts.length ? (
          <>
            <div className="mb-4">
              {summary.topProducts.slice(0, 12).map((p, idx) => (
                <div key={p.product} className="flex items-center justify-between py-3 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{p.product}</div>
                      <div className="text-xs text-gray-500">Qty: {formatNumber(p.quantity)}</div>
                    </div>
                  </div>
                  <div className="font-semibold text-gray-800">₹ {formatNumber(p.sales)}</div>
                </div>
              ))}
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={summary.topProducts.slice(0, 12).map((x) => ({ name: x.product, sales: x.sales }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="text-sm text-gray-500 p-6">No product data available.</div>
        )}

        {/* AI CTA and response for products */}
        <div className="mt-4">
          <button
            onClick={() => runAIFeedback("products")}
            className="inline-flex items-center gap-2 px-3 py-1 bg-sky-600 text-white rounded hover:opacity-95 transition"
          >
            Get your AI-generated forecast insight
          </button>

          <div className="mt-3">
            {aiState.products.loading ? (
              <div className="text-sm text-gray-600 flex items-center gap-3">
                <span className="w-4 h-4 border-2 border-t-sky-600 rounded-full animate-spin inline-block" />
                Getting AI insight...
              </div>
            ) : aiState.products.result ? (
              <ForecastCard result={aiState.products.result} timeMs={aiState.products.timeMs} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
        <h4 className="font-medium text-gray-700 mb-2">Quick Insights</h4>
        <ul className="list-disc list-inside text-sm text-gray-700">
          <li>
            Best month: <strong>{summary.bestMonth?.month ?? "-"}</strong> (₹ {formatNumber(summary.bestMonth?.sales ?? 0)})
          </li>
          <li>
            Top region: <strong>{summary.topRegion?.region ?? "-"}</strong> (₹ {formatNumber(summary.topRegion?.sales ?? 0)})
          </li>
          <li>
            Top product: <strong>{summary.topProducts[0]?.product ?? "-"}</strong> (₹ {formatNumber(summary.topProducts[0]?.sales ?? 0)})
          </li>
        </ul>
      </div>

      {/* Raw data preview */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
        <h4 className="font-medium text-gray-700 mb-2">Raw data preview</h4>
        <div className="overflow-auto">
          <table className="min-w-full text-sm border-collapse" style={{ border: "1px solid #e5e7eb" }}>
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase" style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th className="px-3 py-2" style={{ borderRight: "1px solid #e5e7eb" }}>#</th>
                <th className="px-3 py-2" style={{ borderRight: "1px solid #e5e7eb" }}>Date</th>
                <th className="px-3 py-2" style={{ borderRight: "1px solid #e5e7eb" }}>Product</th>
                <th className="px-3 py-2" style={{ borderRight: "1px solid #e5e7eb" }}>Region</th>
                <th className="px-3 py-2" style={{ borderRight: "1px solid #e5e7eb" }}>Sales</th>
                <th className="px-3 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 500).map((r, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50" style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td className="px-3 py-2" style={{ borderRight: "1px solid #f3f4f6" }}>{r._rowIndex}</td>
                  <td className="px-3 py-2" style={{ borderRight: "1px solid #f3f4f6" }}>{r.Date ?? "-"}</td>
                  <td className="px-3 py-2" style={{ borderRight: "1px solid #f3f4f6" }}>{r.Product}</td>
                  <td className="px-3 py-2" style={{ borderRight: "1px solid #f3f4f6" }}>{r.Region}</td>
                  <td className="px-3 py-2" style={{ borderRight: "1px solid #f3f4f6" }}>₹ {formatNumber(r.Sales)}</td>
                  <td className="px-3 py-2">{formatNumber(r.Quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ------------------ ForecastCard + AI generator ------------------ */

function ForecastCard({ result, timeMs }) {
  return (
    <div className="mt-3 bg-sky-50 border border-sky-100 rounded-lg p-4 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-semibold text-sky-700 mb-1">{result.title}</div>
          <div className="text-gray-700">{result.message}</div>
        </div>
        <div className="text-xs text-gray-400 text-right">
          <div>Simulated: {timeMs}ms</div>
          <div className="mt-1 text-green-600 font-medium">{result.confidence}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------ AI response generator (static but tailored) ------------------ */

function generateAIResponse(summary, sectionKey) {
  // safe guards
  const bestMonth = summary.bestMonth?.month ?? "N/A";
  const bestMonthSales = Number(summary.bestMonth?.sales || 0);
  const topRegion = summary.topRegion?.region ?? "N/A";
  const topRegionSales = Number(summary.topRegion?.sales || 0);
  const topProduct = summary.topProducts?.[0]?.product ?? "N/A";
  const topProductSales = Number(summary.topProducts?.[0]?.sales || 0);

  if (sectionKey === "monthly") {
    const growthHint = bestMonthSales > summary.totalSales * 0.15
      ? "Exceptional performance — consider allocating more ad budget to this period."
      : "Solid month — investigate promotions that contributed to growth.";

    return {
      title: `Monthly forecast & recommendation`,
      message: `Based on recent trends, ${bestMonth} remains the strongest month. Forecast indicates a ~5-8% uplift if current trends continue. ${growthHint} Additionally, consider bundling your top products during this month.`,
      confidence: "Confidence: High",
    };
  }

  if (sectionKey === "region") {
    const advice = topRegionSales > summary.totalSales * 0.4
      ? `The ${topRegion} region contributes a major portion of revenue — diversify outreach in smaller regions to reduce concentration risk.`
      : `Balanced regional performance — scale what works in ${topRegion} into adjacent territories.`;

    return {
      title: `Regional forecast & action plan`,
      message: `AI suggests a modest growth of 6% in ${topRegion} over the next quarter with targeted promotions. ${advice} Consider localised campaigns and partner promotions.`,
      confidence: "Confidence: Medium-High",
    };
  }

  // products
  const crossSell = summary.topProducts?.[1]?.product
    ? `Consider cross-selling ${summary.topProducts[1].product} with ${topProduct}.`
    : `Explore bundling opportunities to increase average order value.`;

  return {
    title: `Product-level forecast`,
    message: `Top product "${topProduct}" is expected to continue leading sales. Optimize inventory for ${topProduct} and monitor price sensitivity. ${crossSell} Short-term forecast indicates a 4-7% uplift with targeted discounts.`,
    confidence: "Confidence: Medium",
  };
}

/* ------------------ helpers ------------------ */

function computeSummary(rows) {
  const summary = {
    totalSales: 0,
    totalQuantity: 0,
    monthlySeries: [],
    regionSeries: [],
    topProducts: [],
    bestMonth: null,
    topRegion: null,
  };

  if (!rows || !rows.length) return summary;

  const byMonth = {};
  const byRegion = {};
  const byProduct = {};

  rows.forEach((r) => {
    const sales = Number(r.Sales) || 0;
    const qty = Number(r.Quantity) || 0;
    summary.totalSales += sales;
    summary.totalQuantity += qty;

    const month = r.Date ? dayjs(r.Date).format("YYYY-MM") : "(Unknown)";
    byMonth[month] = (byMonth[month] || 0) + sales;

    const reg = r.Region || "(Unknown)";
    byRegion[reg] = (byRegion[reg] || 0) + sales;

    const prod = r.Product || "(Unknown)";
    if (!byProduct[prod]) byProduct[prod] = { sales: 0, quantity: 0 };
    byProduct[prod].sales += sales;
    byProduct[prod].quantity += qty;
  });

  summary.monthlySeries = Object.keys(byMonth)
    .sort()
    .map((m) => ({ month: m, sales: byMonth[m] }));

  if (summary.monthlySeries.length) {
    summary.bestMonth = summary.monthlySeries.reduce((a, b) => (b.sales > a.sales ? b : a), summary.monthlySeries[0]);
  }

  summary.regionSeries = Object.keys(byRegion).map((r) => ({ region: r, sales: byRegion[r] }));
  if (summary.regionSeries.length) {
    summary.topRegion = summary.regionSeries.reduce((a, b) => (b.sales > a.sales ? b : a), summary.regionSeries[0]);
  }

  summary.topProducts = Object.keys(byProduct)
    .map((p) => ({ product: p, sales: byProduct[p].sales, quantity: byProduct[p].quantity }))
    .sort((a, b) => b.sales - a.sales);

  return summary;
}

function formatNumber(n) {
  if (n === undefined || n === null) return "0";
  return Number(n).toLocaleString();
}

function pickColor(i) {
  const palette = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a4de6c", "#d0ed57", "#8dd1e1"];
  return palette[i % palette.length];
}
