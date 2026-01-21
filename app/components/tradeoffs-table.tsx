"use client";

import React from 'react';

interface TradeoffRow {
  layer: string;
  why: string;
  tradeoff: string;
}

const tradeoffs: TradeoffRow[] = [
  {
    layer: "News pull (bounded window)",
    why: "Keeps the narrative \"fresh\" and reduces noise",
    tradeoff: "Fewer articles means missing some context; more articles means latency + cost + dilution"
  },
  {
    layer: "FinBERT on headlines",
    why: "Headlines are short, high-signal, and faster to score",
    tradeoff: "Headline-only sentiment can miss nuance present in article bodies"
  },
  {
    layer: "Summarizer on structured input",
    why: "Converts \"10 links\" into a digest you can actually read",
    tradeoff: "Summaries can hallucinate if the input is messy; strict input formatting matters"
  },
  {
    layer: "Streamlit caching patterns",
    why: "Keeps the app responsive even with heavyweight models",
    tradeoff: "Cache invalidation becomes a product decision (freshness vs speed)"
  },
  {
    layer: "Explainability via per-headline outputs",
    why: "Lets you audit why the dashboard \"feels\" positive/negative",
    tradeoff: "More UI surface area; you need to keep it clean and scannable"
  }
];

export function TradeoffsTable() {
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-100">Layer</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-100">Why it's there</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-100">Tradeoff I accepted</th>
          </tr>
        </thead>
        <tbody>
          {tradeoffs.map((row, index) => (
            <tr 
              key={index}
              className="border-b border-white/[0.05] hover:bg-white/[0.02] transition-colors"
            >
              <td className="px-4 py-3 text-sm text-zinc-300 font-medium">{row.layer}</td>
              <td className="px-4 py-3 text-sm text-zinc-400">{row.why}</td>
              <td className="px-4 py-3 text-sm text-zinc-400">{row.tradeoff}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
