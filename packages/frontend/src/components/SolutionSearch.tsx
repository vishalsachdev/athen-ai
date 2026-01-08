import { useState } from 'react';
import { SplitLayout } from './SplitLayout';
import { tools, categories } from '../data/tools';
import { ToolCard } from './ToolCard';

export const SolutionSearch = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hipaaOnly, setHipaaOnly] = useState(false);

  // Filter tools based on selected category and HIPAA filter
  const filteredTools = tools.filter(t => {
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    const matchesHipaa = !hipaaOnly || t.hipaaCompliant;
    return matchesCategory && matchesHipaa;
  });

  return (
    <div className="max-w-[1800px] mx-auto px-6 pt-4 pb-6 font-sans">
      {/* Header */}
      <div className="text-center space-y-1 mb-4">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Athena</h1>
        <p className="text-slate-500 text-sm">Your AI consultant for healthcare tools</p>
      </div>

      {/* Split Layout: Chat (left) + Tabs (right) */}
      <SplitLayout />

      {/* Browse Tools Section */}
      <div className="pt-8 border-t border-slate-200 mt-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-6">Browse All Tools</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Filters Panel (Left) */}
          <div className="lg:col-span-3 space-y-6">
            {/* HIPAA Filter */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hipaaOnly}
                  onChange={(e) => setHipaaOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="font-medium text-slate-700">HIPAA Compliant Only</span>
                  <p className="text-xs text-slate-500">Show only verified compliant tools</p>
                </div>
              </label>
            </div>

            {/* Category Filters */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === null
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All Tools
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-medium">{cat.label}</span>
                    <span className="block text-xs opacity-75">{cat.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="text-sm text-slate-500 px-2">
              <p>{filteredTools.length} tools shown</p>
              <p>{tools.filter(t => t.hipaaCompliant).length} HIPAA compliant total</p>
            </div>
          </div>

          {/* Tools Grid (Right) */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {filteredTools.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p>No tools match your filters</p>
                <button
                  onClick={() => { setSelectedCategory(null); setHipaaOnly(false); }}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
