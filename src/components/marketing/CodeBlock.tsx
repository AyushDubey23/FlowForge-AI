"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface CodeBlockProps {
  filename?: string;
  code: string;
  className?: string;
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      data-cursor="Copy JSON"
      className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10 flex items-center gap-1 text-[10px] font-mono"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

export default function CodeBlock({
  filename = "ast_compiler_output.json",
  code,
  className = "",
}: CodeBlockProps) {
  return (
    <div className={`p-4 rounded-xl bg-[#0F1424] border border-[#FFB454]/20 font-mono text-[11px] shadow-lg ${className}`}>
      <div className="flex items-center justify-between text-zinc-400 border-b border-white/10 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-[#FFB454]" />
          <span className="text-zinc-300 font-bold">{filename}</span>
        </div>
        <CopyButton text={code} />
      </div>
      <motion.pre
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="overflow-x-auto text-zinc-300 leading-relaxed font-mono whitespace-pre-wrap"
      >
        <code>{code}</code>
      </motion.pre>
    </div>
  );
}
