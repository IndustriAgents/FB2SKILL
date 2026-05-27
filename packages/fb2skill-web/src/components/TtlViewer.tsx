import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";

// Minimal Turtle/N3 language definition for highlight.js.
// Covers what we render: @prefix, IRIs, prefixed names, strings, numbers, comments.
hljs.registerLanguage("turtle", () => ({
  name: "turtle",
  case_insensitive: false,
  contains: [
    hljs.COMMENT("#", "$"),
    {
      className: "keyword",
      begin: /@(prefix|base)\b/,
    },
    {
      className: "keyword",
      begin: /\b(a)\b/, // shorthand for rdf:type
    },
    {
      className: "string",
      begin: '"""',
      end: '"""',
    },
    {
      className: "string",
      begin: '"',
      end: '"',
      illegal: "\\n",
      contains: [{ begin: "\\\\." }],
    },
    {
      className: "string",
      begin: "'",
      end: "'",
      illegal: "\\n",
      contains: [{ begin: "\\\\." }],
    },
    {
      className: "built_in",
      begin: /<[^>\s]+>/, // IRIs
    },
    {
      className: "number",
      begin: /\b-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?\b/,
    },
    {
      className: "literal",
      begin: /\b(true|false)\b/,
    },
    {
      className: "symbol",
      begin: /[A-Za-z_][\w.-]*:[A-Za-z_][\w.-]*/, // prefixed names
    },
    {
      className: "meta",
      begin: /\^\^|@[a-z]+(?:-[a-z0-9]+)*/i, // datatype / language tag
    },
  ],
}));

interface Props {
  ttl: string;
  maxHeight?: string;
}

export default function TtlViewer({ ttl, maxHeight = "70vh" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.removeAttribute("data-highlighted");
      hljs.highlightElement(ref.current);
    }
  }, [ttl]);

  return (
    <div
      className="rounded border border-slate-200 overflow-auto bg-slate-50"
      style={{ maxHeight }}
    >
      <pre className="text-xs leading-relaxed m-0">
        <code ref={ref} className="language-turtle">
          {ttl}
        </code>
      </pre>
    </div>
  );
}
