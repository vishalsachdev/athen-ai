import { useState } from 'react';
import { SplitLayout } from './SplitLayout';
import { tools, categories } from '../data/tools';
import { ToolCard } from './ToolCard';

export const SolutionSearch = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hipaaOnly, setHipaaOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 10;

  // Filter tools based on selected category, HIPAA filter, and search query
  const filteredTools = tools.filter(t => {
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    const matchesHipaa = !hipaaOnly || t.hipaaCompliant;
    const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesHipaa && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTools.length / toolsPerPage);
  const startIndex = (currentPage - 1) * toolsPerPage;
  const endIndex = startIndex + toolsPerPage;
  const paginatedTools = filteredTools.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = (callback: () => void) => {
    callback();
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1800px] mx-auto px-6 pt-4 pb-6 font-sans">
      {/* Header */}
      <div className="text-center space-y-1 mb-4">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Athen AI</h1>
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
            {/* Search Filter */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label className="block">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 block">Search Tools</span>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
                    placeholder="Search by name..."
                    className="w-full pl-10 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleFilterChange(() => setSearchQuery(''))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </label>
            </div>

            {/* HIPAA Filter */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hipaaOnly}
                  onChange={(e) => handleFilterChange(() => setHipaaOnly(e.target.checked))}
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
                  onClick={() => handleFilterChange(() => setSelectedCategory(null))}
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
                    onClick={() => handleFilterChange(() => setSelectedCategory(cat.id))}
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
              {paginatedTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {filteredTools.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <p>No tools match your filters</p>
                <button
                  onClick={() => { 
                    setSelectedCategory(null); 
                    setHipaaOnly(false); 
                    setSearchQuery(''); 
                    setCurrentPage(1);
                  }}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = page === 1 || 
                                    page === totalPages || 
                                    Math.abs(page - currentPage) <= 1;
                    
                    if (!showPage && page === 2 && currentPage > 3) {
                      return <span key={page} className="px-2 text-slate-400">...</span>;
                    }
                    if (!showPage && page === totalPages - 1 && currentPage < totalPages - 2) {
                      return <span key={page} className="px-2 text-slate-400">...</span>;
                    }
                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
