"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CodeOutputProps {
  html: string;
  css: string;
  className?: string;
}

export function CodeOutput({ html, css, className }: CodeOutputProps) {
  const [copiedTab, setCopiedTab] = useState<"html" | "css" | null>(null);

  const copyToClipboard = async (text: string, tab: "html" | "css") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(tab);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={cn("w-full", className)} data-testid="code-output">
      <Tabs defaultValue="html" className="w-full">
        <div className="flex items-center justify-between">
          <TabsList className="h-9 bg-transparent p-0">
            <TabsTrigger
              value="html"
              className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              HTML
            </TabsTrigger>
            <TabsTrigger
              value="css"
              className="rounded-none border-b-2 border-transparent px-4 pb-2 pt-1 text-xs font-medium uppercase tracking-widest text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              CSS
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="html" className="mt-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-8 gap-1.5 text-xs"
              onClick={() => copyToClipboard(html, "html")}
            >
              {copiedTab === "html" ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
            <pre className="overflow-x-auto rounded-sm border border-border bg-muted/50 p-4 font-mono text-sm leading-relaxed">
              <code className="text-foreground">{html}</code>
            </pre>
          </div>
        </TabsContent>

        <TabsContent value="css" className="mt-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 h-8 gap-1.5 text-xs"
              onClick={() => copyToClipboard(css, "css")}
            >
              {copiedTab === "css" ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
            <pre className="overflow-x-auto rounded-sm border border-border bg-muted/50 p-4 font-mono text-sm leading-relaxed">
              <code className="text-foreground">{css}</code>
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
