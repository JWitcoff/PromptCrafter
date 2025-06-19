import { Wand2 } from "lucide-react";
import PromptGenerator from "@/components/prompt-generator";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Wand2 className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Prompt Generator</h1>
            </div>
            <div className="text-sm text-slate-500">
              Optimized for OpenAI Models
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PromptGenerator />

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 pt-8">
          <div className="text-center text-sm text-slate-500">
            <p>Built for OpenAI API integration • Supports 6 models • 11 task types • 5 tones</p>
            <p className="mt-2">Generated prompts are optimized for each model's specific capabilities and behavior patterns.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
