"use client";

import React from 'react';
import { FileInput, TrendingUp, Newspaper, Brain, FileText, Monitor } from 'lucide-react';

interface PipelineNode {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  tech?: string;
}

const nodes: PipelineNode[] = [
  {
    id: 1,
    title: "Input",
    subtitle: "Ticker or company name",
    icon: FileInput,
  },
  {
    id: 2,
    title: "Market Data",
    subtitle: "1Y prices + fundamentals",
    icon: TrendingUp,
    tech: "yfinance",
  },
  {
    id: 3,
    title: "News Retrieval",
    subtitle: "Recent article headlines",
    icon: Newspaper,
    tech: "NewsAPI",
  },
  {
    id: 4,
    title: "Sentiment",
    subtitle: "Per-headline scoring",
    icon: Brain,
    tech: "FinBERT",
  },
  {
    id: 5,
    title: "Summary",
    subtitle: "Narrative synthesis",
    icon: FileText,
    tech: "BART",
  },
  {
    id: 6,
    title: "Dashboard",
    subtitle: "Unified presentation",
    icon: Monitor,
  },
];

interface SentimentPipelineDiagramProps {
  compact?: boolean;
}

export function SentimentPipelineDiagram({ compact = false }: SentimentPipelineDiagramProps) {
  const containerPadding = compact ? "p-4" : "p-6";
  const titleSize = compact ? "text-xl" : "text-2xl";
  const subtitleSize = compact ? "text-xs" : "text-sm";
  const nodePadding = compact ? "p-3" : "p-4";
  const iconSize = compact ? "w-7 h-7" : "w-9 h-9";
  const techBadgeSize = compact ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <div className={`my-12 ${containerPadding} bg-white/[0.03] rounded-2xl border border-white/10 shadow-lg overflow-hidden`}>
      <h3 className={`${titleSize} font-bold text-zinc-100 mb-3 text-center`}>
        Pipeline Architecture
      </h3>
      <p className="text-zinc-400 text-center mb-8 text-sm">
        Input normalization → Data retrieval → NLP inference → Presentation
      </p>

      {/* Desktop: Horizontal Layout */}
      <div className="hidden md:flex items-center justify-center gap-2 flex-wrap max-w-full">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            {/* Node Card */}
            <div
              className={`relative flex flex-col items-center text-center ${nodePadding} bg-white/[0.04] rounded-xl border border-white/10
                         hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 ease-in-out
                         min-w-[140px] max-w-[160px]`}
            >
              <node.icon className={`${iconSize} text-zinc-300 mb-2`} />
              <h4 className="text-base font-semibold text-zinc-100 mb-1">{node.title}</h4>
              <p className={`${subtitleSize} text-zinc-400 leading-snug`}>{node.subtitle}</p>
              {node.tech && (
                <span className={`mt-2 ${techBadgeSize} bg-white/[0.06] text-zinc-400 rounded-md border border-white/10 font-mono`}>
                  {node.tech}
                </span>
              )}
            </div>

            {/* Arrow (not after last node) */}
            {index < nodes.length - 1 && (
              <div className="flex items-center justify-center px-1">
                <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile: Vertical Layout */}
      <div className="flex md:hidden flex-col items-center gap-3">
        {nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            {/* Node Card */}
            <div
              className={`relative flex flex-col items-center text-center ${nodePadding} bg-white/[0.04] rounded-xl border border-white/10
                         w-full max-w-xs`}
            >
              <node.icon className={`${iconSize} text-zinc-300 mb-2`} />
              <h4 className="text-base font-semibold text-zinc-100 mb-1">{node.title}</h4>
              <p className={`${subtitleSize} text-zinc-400 leading-snug`}>{node.subtitle}</p>
              {node.tech && (
                <span className={`mt-2 ${techBadgeSize} bg-white/[0.06] text-zinc-400 rounded-md border border-white/10 font-mono`}>
                  {node.tech}
                </span>
              )}
            </div>

            {/* Downward Arrow (not after last node) */}
            {index < nodes.length - 1 && (
              <div className="flex items-center justify-center py-1">
                <svg className="w-6 h-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <p className="text-zinc-400 text-center mt-8 text-xs">
        Combines quantitative (price, fundamentals) and qualitative (news, sentiment) signals in a single view
      </p>
    </div>
  );
}
