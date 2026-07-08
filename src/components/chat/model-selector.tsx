"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Sparkles, Check } from "lucide-react";

export type ModelId =
  | "gemini-3.5-flash"
  | "gemini-3.1-pro"
  | "gemini-3.1-flash-lite"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "gpt-4.1"
  | "meta-llama/llama-4-maverick"
  | "llama3-70b-8192"
  | "openai/gpt-oss-120b"
  | "whisper-large-v3"
  | "whisper-large-v3-turbo";

export interface ModelOption {
  id: ModelId;
  name: string;
  provider: "google" | "openai" | "openrouter" | "groq" | "meta";
  description: string;
  badge?: string;
}

export const MODELS: ModelOption[] = [
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    provider: "google",
    description: "Fastest Gemini model",
    badge: "Fast",
  },
  {
    id: "gemini-3.1-pro",
    name: "Gemini 3.1 Pro",
    provider: "google",
    description: "Advanced reasoning & coding",
    badge: "Smart",
  },
  {
    id: "gemini-3.1-flash-lite",
    name: "Gemini 3.1 Flash-Lite",
    provider: "google",
    description: "Lightweight, low-latency",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Flagship OpenAI model",
    badge: "Pro",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Fast & cost-effective",
    badge: "Fast",
  },
  {
    id: "gpt-4.1",
    name: "GPT-4.1",
    provider: "openai",
    description: "Latest GPT generation",
    badge: "New",
  },
  {
    id: "meta-llama/llama-4-maverick",
    name: "Llama 4 Maverick",
    provider: "meta",
    description: "Meta's frontier open model",
    badge: "Free",
  },
  {
    id: "llama3-70b-8192",
    name: "Llama 3 70B",
    provider: "meta",
    description: "Instant responses via Groq LPU",
    badge: "Fast",
  },
  {
    id: "openai/gpt-oss-120b",
    name: "GPT OSS 120B",
    provider: "openai",
    description: "Open source 120B model",
    badge: "Free",
  },
  {
    id: "whisper-large-v3",
    name: "Whisper",
    provider: "openai",
    description: "Fast & accurate speech-to-text model",
  },
  {
    id: "whisper-large-v3-turbo",
    name: "Whisper Large Turbo",
    provider: "openai",
    description: "Fast & accurate speech-to-text model",
  }
];

const PROVIDER_LABELS: Record<ModelOption["provider"], string> = {
  google: "Google",
  openai: "OpenAI",
  openrouter: "OpenRouter",
  groq: "Groq",
  meta: "Meta",
};

const PROVIDER_COLORS: Record<ModelOption["provider"], string> = {
  google: "#4285F4",
  openai: "#10A37F",
  openrouter: "#6B5EE4",
  groq: "#F55036",
  meta: "#0668E1",
};

const BADGE_COLORS: Record<string, string> = {
  Fast: "bg-emerald-500/15 text-emerald-400",
  Smart: "bg-violet-500/15 text-violet-400",
  Pro: "bg-amber-500/15 text-amber-400",
  New: "bg-blue-500/15 text-blue-400",
};

interface ModelSelectorProps {
  value: ModelId;
  onChange: (model: ModelId) => void;
  disabled?: boolean;
}

export function ModelSelector({ value, onChange, disabled }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = MODELS.find((m) => m.id === value) ?? MODELS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const grouped = MODELS.reduce<Record<string, ModelOption[]>>((acc, m) => {
    (acc[m.provider] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-muted/60 hover:bg-muted text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed group"
        id="model-selector-btn"
      >
        <Sparkles
          className="w-3.5 h-3.5 shrink-0"
          style={{ color: PROVIDER_COLORS[selected.provider] }}
        />
        <span className="max-w-[130px] truncate">{selected.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 rounded-2xl border border-border bg-popover shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="p-1.5 max-h-80 overflow-y-auto">
            {(Object.keys(grouped) as ModelOption["provider"][]).map((provider) => (
              <div key={provider} className="mb-1 last:mb-0">
                <div className="flex items-center gap-2 px-2.5 py-1.5">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: PROVIDER_COLORS[provider] }}
                  >
                    {PROVIDER_LABELS[provider]}
                  </span>
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: `${PROVIDER_COLORS[provider]}30` }}
                  />
                </div>
                {grouped[provider].map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => {
                      onChange(model.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-colors duration-100 ${
                      value === model.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium leading-none">{model.name}</span>
                        {model.badge && (
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                              BADGE_COLORS[model.badge] ?? "bg-muted text-muted-foreground"
                            }`}
                          >
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground mt-0.5 block">
                        {model.description}
                      </span>
                    </div>
                    {value === model.id && (
                      <Check className="w-4 h-4 shrink-0 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
