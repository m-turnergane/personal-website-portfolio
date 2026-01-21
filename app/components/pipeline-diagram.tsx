"use client";

import {
  ArrowDown,
  FileText,
  Database,
  Code,
  Workflow,
  Sparkles,
} from "lucide-react";

interface PipelineStep {
  number: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const n8nSteps: PipelineStep[] = [
  {
    number: "1",
    title: "Drive Folder Trigger",
    description: "Watches BC_Articles_Incoming folder",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    number: "2",
    title: "Google Drive Download",
    description: "Downloads the PDF file",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    number: "3",
    title: "Google Sheets Get Rows",
    description: "Looks up application by ID",
    icon: <Database className="w-4 h-4" />,
  },
  {
    number: "4",
    title: "Merge Data Node",
    description: "Combines file download and application details",
    icon: <Workflow className="w-4 h-4" />,
  },
  {
    number: "5",
    title: "Code Node",
    description: "Merges data + converts PDF to base64",
    icon: <Code className="w-4 h-4" />,
  },
  {
    number: "6",
    title: "HTTP Request",
    description: "POSTs to /analyze_articles endpoint",
    icon: <ArrowDown className="w-4 h-4" />,
  },
  {
    number: "7",
    title: "Google Sheets Append",
    description: "Writes results back to sheet",
    icon: <Database className="w-4 h-4" />,
  },
];

const backendSteps: PipelineStep[] = [
  {
    number: "1",
    title: "Decode base64 PDF",
    description: "Converts base64 string back to PDF bytes",
  },
  {
    number: "2",
    title: "Extract text with pdfplumber",
    description: "Parses PDF content into text",
  },
  {
    number: "3",
    title: "Classify document type",
    description: "Gemini determines document type",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    number: "4",
    title: "Extract individuals/directors",
    description: "Gemini extracts structured data",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    number: "5",
    title: "Compare directors against application",
    description: "Validates extracted data vs submitted metadata",
  },
  {
    number: "6",
    title: "Generate summaries",
    description: "Gemini creates internal + customer messages",
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    number: "7",
    title: "Return structured JSON response",
    description: "Sends verification results back to workflow",
  },
];

function PipelineStep({
  step,
  isLast,
}: {
  step: PipelineStep;
  isLast: boolean;
}) {
  return (
    <div className="relative">
      <div className="flex items-start gap-3 group">
        {/* Number badge */}
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-xs font-mono text-zinc-300 group-hover:bg-white/[0.1] group-hover:border-white/20 transition-all duration-200">
          {step.number}
        </div>

        {/* Content */}
        <div className="flex-1 pb-6">
          <div className="flex items-center gap-2 mb-1">
            {step.icon && (
              <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                {step.icon}
              </span>
            )}
            <h4 className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
              {step.title}
            </h4>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            {step.description}
          </p>
        </div>
      </div>

      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[13px] top-7 w-px h-[calc(100%-28px)] bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
      )}
    </div>
  );
}

export function PipelineDiagram() {
  return (
    <div className="my-8 space-y-6">
      {/* n8n Workflow Section */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.04] transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <Workflow className="w-5 h-5 text-zinc-300" />
          <h3 className="text-lg font-bold text-white">n8n Cloud Workflow</h3>
        </div>

        <div className="space-y-0">
          {n8nSteps.map((step, index) => (
            <PipelineStep
              key={step.number}
              step={step}
              isLast={index === n8nSteps.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Connection Arrow */}
      <div className="flex flex-col items-center py-2">
        <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="font-mono">via ngrok tunnel</span>
          <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <ArrowDown className="w-5 h-5 text-zinc-600" />
      </div>

      {/* FastAPI Backend Section */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.04] transition-all duration-300">
        <div className="flex items-center gap-2 mb-6">
          <Code className="w-5 h-5 text-zinc-300" />
          <h3 className="text-lg font-bold text-white">
            FastAPI Backend (Local)
          </h3>
        </div>

        <div className="space-y-0">
          {backendSteps.map((step, index) => (
            <PipelineStep
              key={step.number}
              step={step}
              isLast={index === backendSteps.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
