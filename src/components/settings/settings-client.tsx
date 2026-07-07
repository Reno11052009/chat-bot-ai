"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Monitor, Moon, Sun, Sparkles, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { MODELS, type ModelId } from "@/components/chat/model-selector";

const PROVIDER_COLORS: Record<string, string> = {
  google: "#4285F4",
  openai: "#10A37F",
  openrouter: "#6B5EE4",
};

const BADGE_COLORS: Record<string, string> = {
  Fast: "bg-emerald-500/15 text-emerald-400",
  Smart: "bg-violet-500/15 text-violet-400",
  Pro: "bg-amber-500/15 text-amber-400",
  New: "bg-blue-500/15 text-blue-400",
  Free: "bg-emerald-500/15 text-emerald-400",
};

const DEFAULT_MODEL_KEY = "chat_default_model";

export function SettingsClient() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [defaultModel, setDefaultModel] = useState<ModelId>("gemini-3.5-flash");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(DEFAULT_MODEL_KEY) as ModelId | null;
    if (stored && MODELS.find((m) => m.id === stored)) {
      setDefaultModel(stored);
    }
  }, []);

  const handleSaveModel = (modelId: ModelId) => {
    setDefaultModel(modelId);
    localStorage.setItem(DEFAULT_MODEL_KEY, modelId);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const grouped = MODELS.reduce<Record<string, typeof MODELS>>((acc, m) => {
    (acc[m.provider] ??= []).push(m);
    return acc;
  }, {});

  const PROVIDER_LABELS: Record<string, string> = {
    google: "Google",
    openai: "OpenAI",
    openrouter: "OpenRouter",
  };

  return (
    <div className="space-y-8">
      {/* Appearance */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Appearance</h3>
        <div className="flex items-center gap-4">
          {mounted && (
            <>
              <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")} className="gap-2">
                <Sun className="w-4 h-4" /> Light
              </Button>
              <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")} className="gap-2">
                <Moon className="w-4 h-4" /> Dark
              </Button>
              <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")} className="gap-2">
                <Monitor className="w-4 h-4" /> System
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Default Model */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Default Model</h3>
          {saved && (
            <span className="text-sm text-emerald-500 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {Object.keys(grouped).map((provider) => (
          <div key={provider} className="space-y-2">
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: PROVIDER_COLORS[provider] }}
              >
                {PROVIDER_LABELS[provider]}
              </span>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: `${PROVIDER_COLORS[provider]}30` }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {grouped[provider].map((model) => {
                const isSelected = defaultModel === model.id;
                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleSaveModel(model.id)}
                    className={`relative flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-150 ${
                      isSelected
                        ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2 ring-offset-background"
                        : "border-border hover:border-muted-foreground/40 hover:bg-muted/40"
                    }`}
                  >
                    <Sparkles
                      className="w-5 h-5 shrink-0"
                      style={{ color: PROVIDER_COLORS[provider] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
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
                      <span className="text-xs text-muted-foreground mt-0.5 block">{model.description}</span>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 shrink-0 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">System Instructions</h3>
        <p className="text-sm text-muted-foreground">
          These instructions will be prepended to every conversation.
        </p>
        <textarea
          className="w-full min-h-[120px] rounded-xl border bg-muted/50 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          placeholder="You are a helpful assistant..."
          defaultValue="You are a helpful and concise AI assistant."
        />
        <Button>Save Instructions</Button>
      </div>
    </div>
  );
}
