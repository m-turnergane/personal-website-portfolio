"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Database,
  BarChart3,
  Sparkles,
  FileText,
  Target,
} from "lucide-react";

interface Step {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: "questionnaire",
    icon: <FileText className="w-6 h-6" />,
    title: "Questionnaire",
    description: "Structured questions on financial context and preferences",
  },
  {
    id: "rules",
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: "Rule-Based Scoring",
    description: "Deterministic baseline calculation",
  },
  {
    id: "ml",
    icon: <Sparkles className="w-6 h-6" />,
    title: "ML Enhancement",
    description: "Data-driven refinement (when samples exist)",
  },
  {
    id: "label",
    icon: <Target className="w-6 h-6" />,
    title: "Risk Label",
    description: "Conservative → Aggressive classification",
  },
  {
    id: "allocation",
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Allocation",
    description: "Suggested equity/income split",
  },
  {
    id: "storage",
    icon: <Database className="w-6 h-6" />,
    title: "Anonymized Storage",
    description: "Persist insights for model improvement",
  },
];

export function RiskAssessmentDiagram() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="my-12 py-8 bg-white/[0.02] rounded-lg border border-white/10">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-zinc-100 mb-2">
            Progressive Intelligence Flow
          </h3>
          <p className="text-sm text-zinc-400">
            Rule-based foundation → ML enhancement → Transparent output
          </p>
        </div>

        {/* Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Card */}
              <div
                className={`
                  relative overflow-hidden
                  bg-white/[0.03] border border-white/10
                  rounded-lg p-5
                  hover:bg-white/[0.05] hover:border-white/20
                  transition-all duration-300
                  ${
                    mounted
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }
                `}
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Subtle pulse effect */}
                <div
                  className="absolute inset-0 animate-pulse opacity-0"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animationDuration: "3s",
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-white/[0.05] text-zinc-300">
                    {step.icon}
                  </div>

                  {/* Step Number */}
                  <div className="absolute top-3 right-3 text-xs font-mono text-zinc-600">
                    {(index + 1).toString().padStart(2, "0")}
                  </div>

                  {/* Title */}
                  <h4 className="text-base font-semibold text-zinc-100 mb-2">
                    {step.title}
                  </h4>

                  {/* Description */}
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow connector (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 z-20 -translate-y-1/2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white/20"
                  >
                    <path
                      d="M5 12h14M12 5l7 7-7 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Arrow connector (mobile only) */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-2">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-white/20"
                  >
                    <path
                      d="M12 5v14M5 12l7 7 7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500 italic">
            Hybrid approach: deterministic rules provide stability, ML adds
            refinement as data grows
          </p>
        </div>
      </div>
    </div>
  );
}
