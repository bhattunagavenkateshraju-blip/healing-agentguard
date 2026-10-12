import React, { useState } from 'react';
import { Settings, Cpu, Shield, Key, Sliders, X, Check, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [nebiusEndpoint, setNebiusEndpoint] = useState('https://api.studio.nebius.com/v1');
  const [modelName, setModelName] = useState('NVIDIA/Llama-3-Nemotron-70B-Instruct');
  const [gpuCluster, setGpuCluster] = useState('8x NVIDIA H100 SXM5 80GB');
  const [temperature, setTemperature] = useState(0.2);
  const [maxRetries, setMaxRetries] = useState(2);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden font-sans">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Nebius Cloud & Nemotron-70B Settings
              </h3>
              <p className="text-xs text-slate-400">
                Configure autonomous agent inference cluster and execution limits
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs font-mono">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              NEBIUS CLUSTER ENDPOINT
            </label>
            <input
              type="text"
              value={nebiusEndpoint}
              onChange={(e) => setNebiusEndpoint(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 text-xs"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Default: Nebius AI Studio OpenAI-compatible endpoint
            </span>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              PRIMARY REASONING MODEL
            </label>
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 text-xs cursor-pointer"
            >
              <option value="NVIDIA/Llama-3-Nemotron-70B-Instruct">
                NVIDIA Llama-3-Nemotron-70B-Instruct (Recommended for DevOps)
              </option>
              <option value="NVIDIA/Nemotron-4-340B-Instruct">
                NVIDIA Nemotron-4-340B-Instruct (High Capacity)
              </option>
              <option value="gemini-2.5-flash">
                Google Gemini 2.5 Flash (Ultra-low latency fallback)
              </option>
            </select>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">
              NEBIUS COMPUTE ACCELERATOR
            </label>
            <select
              value={gpuCluster}
              onChange={(e) => setGpuCluster(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 text-xs cursor-pointer"
            >
              <option value="8x NVIDIA H100 SXM5 80GB">8x NVIDIA H100 SXM5 80GB (Europe North 1)</option>
              <option value="4x NVIDIA L40S 48GB">4x NVIDIA L40S 48GB (US Central 1)</option>
              <option value="Serverless Ephemeral Worker">Serverless Ephemeral Worker Pool</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                TEMPERATURE ({temperature})
              </label>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 block">Low value = deterministic AST code patch</span>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                MAX SANDBOX RETRIES
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={maxRetries}
                onChange={(e) => setMaxRetries(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
          >
            {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? 'Saved' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
