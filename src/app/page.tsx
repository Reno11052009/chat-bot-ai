import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Sparkles, Zap, Shield, Globe } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Bot className="w-6 h-6 text-primary" />
          <span>AI ChatBot</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Login
          </Link>
          <Link href="/chat">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Powered by Vercel AI SDK & Next.js App Router</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            The Ultimate AI Assistant <br className="hidden md:block" /> for Everyone
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Experience the next generation of conversational AI. Switch seamlessly between GPT-4o, Grok (xAI), and Gemini 1.5 Pro in a single beautiful interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/chat">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-lg h-14 px-8 rounded-full">
                Start Chatting Now <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-16 w-full rounded-2xl border bg-muted/30 p-2 md:p-4 shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="aspect-[16/9] rounded-xl bg-background border flex overflow-hidden">
              <div className="w-1/4 border-r bg-muted/20 hidden md:flex flex-col p-4 gap-2">
                <div className="h-8 bg-muted rounded-md mb-4" />
                <div className="h-10 bg-muted/50 rounded-md" />
                <div className="h-10 bg-muted/50 rounded-md" />
              </div>
              <div className="flex-1 flex flex-col p-4">
                <div className="flex-1 space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary shrink-0" />
                    <div className="h-20 bg-muted rounded-2xl rounded-tl-sm w-3/4" />
                  </div>
                  <div className="flex gap-4 justify-end">
                    <div className="h-12 bg-primary/20 rounded-2xl rounded-tr-sm w-1/2" />
                    <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
                  </div>
                </div>
                <div className="h-14 bg-muted rounded-xl mt-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">Everything you need</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Blazing Fast", desc: "Streaming responses using Vercel AI SDK for instant feedback." },
                { icon: Globe, title: "Multiple Models", desc: "Access GPT, Claude, and Gemini from a single platform." },
                { icon: Shield, title: "Secure & Private", desc: "Your conversations are encrypted and stored safely." },
              ].map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-background border shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-6 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 AI ChatBot. All rights reserved.</p>
      </footer>
    </div>
  );
}
