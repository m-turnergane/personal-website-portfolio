import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import { PipelineDiagram } from "./pipeline-diagram";
import { RiskAssessmentDiagram } from "./risk-assessment-diagram";
import { SentimentPipelineDiagram } from "./sentiment-pipeline-diagram";
import { TradeoffsTable } from "./tradeoffs-table";
import { ImageStrip } from "./image-strip";

// Custom MDX components
const components = {
  PipelineDiagram,
  RiskAssessmentDiagram,
  SentimentPipelineDiagram,
  TradeoffsTable,
  ImageStrip,
  Image: (props: any) => (
    <Image {...props} className="rounded-lg my-4" />
  ),
  h1: (props: any) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-neutral-100" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-3xl font-bold mt-6 mb-3 text-neutral-100" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-2xl font-semibold mt-5 mb-2 text-neutral-100" {...props} />
  ),
  h4: (props: any) => (
    <h4 className="text-xl font-semibold mt-4 mb-2 text-neutral-200" {...props} />
  ),
  p: (props: any) => (
    <p className="text-neutral-300 leading-relaxed mb-4" {...props} />
  ),
  a: (props: any) => (
    <a
      className="text-white/80 hover:text-white underline underline-offset-2 transition-colors"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside space-y-2 mb-4 text-neutral-300" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside space-y-2 mb-4 text-neutral-300" {...props} />
  ),
  li: (props: any) => <li className="ml-4" {...props} />,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-white/20 pl-4 py-2 my-4 italic text-neutral-400 bg-white/[0.03] rounded-r"
      {...props} 
    />
  ),
  code: (props: any) => {
    // Inline code
    if (!props.className) {
      return (
        <code
          className="bg-neutral-800 text-white/80 px-1.5 py-0.5 rounded text-sm font-mono"
          {...props}
        />
      );
    }
    // Block code (handled by pre)
    return <code {...props} />;
  },
  pre: (props: any) => (
    <pre
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 overflow-x-auto mb-4 text-sm"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border border-neutral-700 bg-neutral-800 px-4 py-2 text-left font-semibold"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="border border-neutral-700 px-4 py-2" {...props} />
  ),
  hr: (props: any) => (
    <hr className="border-neutral-800 my-8" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-neutral-100" {...props} />
  ),
  em: (props: any) => (
    <em className="italic text-neutral-300" {...props} />
  ),
};

export function MDXContent({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none">
      <MDXRemote source={content} components={components} />
    </div>
  );
}
