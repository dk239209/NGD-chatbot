/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RepoConfig } from '../types/repo';
import { LICENSES } from '../data/repoTemplates';
import {
  Copy,
  Check,
  Download,
  Shield,
  Scale,
  Sparkles,
  Info,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface LicenseTabProps {
  config: RepoConfig;
  onChangeConfig: (newConfig: RepoConfig) => void;
  onCopy: (text: string, label: string) => void;
}

export const LicenseTab: React.FC<LicenseTabProps> = ({
  config,
  onChangeConfig,
  onCopy,
}) => {
  const [copied, setCopied] = useState(false);
  const currentLicense = LICENSES[config.licenseType] || LICENSES['Apache-2.0'];

  const fullLicenseText = currentLicense.fullTextTemplate(
    config.authorName,
    config.year,
    config.repoName
  );

  const handleCopyLicense = () => {
    onCopy(fullLicenseText, `${currentLicense.name} Text`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadLicense = () => {
    const blob = new Blob([fullLicenseText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LICENSE';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const comparisonFeatures = [
    {
      feature: 'Commercial Use',
      apache: true,
      mit: true,
      gpl: true,
      bsd: true,
      desc: 'Can be used in commercial products and closed enterprise environments',
    },
    {
      feature: 'Express Patent Grant',
      apache: true,
      mit: false,
      gpl: true,
      bsd: false,
      desc: 'Explicit cross-patent license from all contributors preventing IP litigation',
    },
    {
      feature: 'Trademark Protection',
      apache: true,
      mit: false,
      gpl: false,
      bsd: true,
      desc: 'Explicitly reserves the name "Aura" and project logos from unauthorized use',
    },
    {
      feature: 'State Changes Required',
      apache: true,
      mit: false,
      gpl: true,
      bsd: false,
      desc: 'Contributors who modify code must note changes in the source files',
    },
    {
      feature: 'Disclose Source (Copyleft)',
      apache: false,
      mit: false,
      gpl: true,
      bsd: false,
      desc: 'Requires anyone distributing modified versions to open source their full codebase',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zinc-900 to-indigo-950/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full text-xs font-semibold inline-flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5" />
              Clear License Information
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Open Source Licensing for Aura
            </h2>
            <p className="text-sm text-zinc-300">
              Clear permissions, patent protections, and commercial rights. Choose between the recommended Apache 2.0 license, MIT, or GPLv3.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyLicense}
              className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied LICENSE!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy LICENSE File</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadLicense}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download LICENSE</span>
            </button>
          </div>
        </div>

        {/* Author / Year Config */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Copyright Holder</label>
            <input
              type="text"
              value={config.authorName}
              onChange={(e) => onChangeConfig({ ...config, authorName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Copyright Year</label>
            <input
              type="text"
              value={config.year}
              onChange={(e) => onChangeConfig({ ...config, year: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Repository Name</label>
            <input
              type="text"
              value={config.repoName}
              onChange={(e) => onChangeConfig({ ...config, repoName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>
        </div>
      </div>

      {/* License Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(LICENSES).map((lic) => {
          const isSelected = config.licenseType === lic.id;
          const isRecommended = lic.id === 'Apache-2.0';
          return (
            <button
              key={lic.id}
              onClick={() => onChangeConfig({ ...config, licenseType: lic.id as any })}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                isSelected
                  ? 'bg-zinc-800/90 border-indigo-500 shadow-xl shadow-indigo-500/10'
                  : 'bg-zinc-900/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
              }`}
            >
              {isRecommended && (
                <span className="absolute -top-2.5 right-4 px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow">
                  Recommended for AI
                </span>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{lic.name}</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{lic.summary}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                <span className="font-mono text-indigo-400">{lic.id}</span>
                <span
                  className={`text-[11px] font-semibold ${
                    isSelected ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                >
                  {isSelected ? '✓ Selected' : 'Select'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Why Apache-2.0 is Recommended Explainer */}
      <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-6 flex items-start space-x-4">
        <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-300 flex-shrink-0 mt-0.5">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-indigo-200">
            Why Apache 2.0 is Recommended for Aura AI Voice Assistant
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            {currentLicense.whyRecommendedForAura}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
            <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-indigo-900/50">
              <span className="font-semibold text-emerald-400 block mb-0.5">✓ Commercial Friendly</span>
              <span className="text-[11px] text-zinc-400">Enterprises can build products on top of Aura</span>
            </div>
            <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-indigo-900/50">
              <span className="font-semibold text-indigo-300 block mb-0.5">✓ Explicit Patent Grant</span>
              <span className="text-[11px] text-zinc-400">Protects users & contributors from patent lawsuits</span>
            </div>
            <div className="p-2.5 bg-zinc-950/60 rounded-lg border border-indigo-900/50">
              <span className="font-semibold text-violet-300 block mb-0.5">✓ Trademark Defense</span>
              <span className="text-[11px] text-zinc-400">Guarantees no third party can claim the Aura name</span>
            </div>
          </div>
        </div>
      </div>

      {/* License Comparison Matrix */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white">License Comparison Matrix</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="py-3 px-4 font-semibold">Key Term / Protection</th>
                <th className="py-3 px-4 font-semibold text-indigo-400">Apache 2.0 (Active)</th>
                <th className="py-3 px-4 font-semibold">MIT</th>
                <th className="py-3 px-4 font-semibold">GPLv3</th>
                <th className="py-3 px-4 font-semibold">BSD 3-Clause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {comparisonFeatures.map((item, idx) => (
                <tr key={idx} className="hover:bg-zinc-800/30">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{item.feature}</span>
                    <span className="text-[11px] text-zinc-400">{item.desc}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {item.apache ? (
                      <span className="flex items-center text-emerald-400 gap-1">
                        <CheckCircle className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center text-zinc-500 gap-1">
                        <XCircle className="w-4 h-4" /> No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {item.mit ? (
                      <span className="flex items-center text-emerald-400 gap-1">
                        <CheckCircle className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center text-zinc-500 gap-1">
                        <XCircle className="w-4 h-4" /> No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {item.gpl ? (
                      <span className="flex items-center text-emerald-400 gap-1">
                        <CheckCircle className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center text-zinc-500 gap-1">
                        <XCircle className="w-4 h-4" /> No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {item.bsd ? (
                      <span className="flex items-center text-emerald-400 gap-1">
                        <CheckCircle className="w-4 h-4" /> Yes
                      </span>
                    ) : (
                      <span className="flex items-center text-zinc-500 gap-1">
                        <XCircle className="w-4 h-4" /> No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generated Full Legal Text */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-white">Full Legal Text (LICENSE)</h3>
            <p className="text-xs text-zinc-400">
              Generated with your project credentials: © {config.year} {config.authorName}
            </p>
          </div>
          <button
            onClick={handleCopyLicense}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Full Text</span>
          </button>
        </div>

        <pre className="p-4 bg-zinc-950 rounded-xl text-xs font-mono text-zinc-300 max-h-96 overflow-y-auto leading-relaxed border border-zinc-800 select-all scrollbar-thin">
          {fullLicenseText}
        </pre>
      </div>
    </div>
  );
};
