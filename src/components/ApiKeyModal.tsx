import React, { useState } from 'react';
import { GeminiService } from '../services/gemini';
import { X, Key, ShieldCheck, ExternalLink, Check, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  onClose: () => void;
  onKeySaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(GeminiService.getApiKey());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    GeminiService.setApiKey(apiKey.trim());
    setStatusMessage('Key saved successfully!');
    onKeySaved();
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    GeminiService.setApiKey('');
    setStatusMessage('Key removed. Using local fallback engine.');
    onKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
      <div className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-stone-100">
              Google Gemini API Key
            </h3>
            <p className="text-xs text-stone-400">
              100% Free on Google AI Studio • No credit card needed
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-300 block mb-1 uppercase tracking-wider">
              Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800/80 text-xs text-stone-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Cost Guarantee:</span>
            </div>
            <p>
              Google AI Studio offers a free tier with 15 RPM / 1M TPM for Gemini 1.5 & 2.0 Flash. Your key stays strictly in your browser's local memory.
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-400 hover:underline pt-1 font-semibold"
            >
              <span>Get Free Key at Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="text-[11px] text-stone-500 italic">
            * Note: If you don't have a key right now, leave it empty! The built-in intelligent fallback engine will automatically simulate full Gemini matching during your demo.
          </div>

          {statusMessage && (
            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between gap-2">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-400 hover:text-rose-300"
              >
                Clear Key
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-md transition-all"
              >
                Save Key
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
