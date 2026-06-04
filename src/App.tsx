import { useState } from 'react';
import {
  Bot,
  Send,
  Loader2,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Globe2,
  Briefcase,
  Target,
  FileText,
  Mail
} from 'lucide-react';

interface N8nResponse {
  summary: string[];
  priorities: {
    name: string;
    priority: string;
    reason: string;
    action: string;
  }[];
  recommendations: string[];
}

const WEBHOOK_URL = 'https://n8n.ianman.com/webhook/Team%20proactivity%20nudge';

function App() {
  const [businessObjective, setBusinessObjective] = useState('Vendor Identification & Management');
  const [projectCategory, setProjectCategory] = useState('Global Sourcing & Procurement');
  const [priorityFocus, setPriorityFocus] = useState('Delayed Suppliers');
  const [region, setRegion] = useState('India');
  const [additionalContext, setAdditionalContext] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<N8nResponse | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessObjective,
          projectCategory,
          priorityFocus,
          region,
          additionalContext
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const rawData = await response.json();

      // Handle n8n array-wrapped responses (e.g., webhook returning all items)
      const data = Array.isArray(rawData) ? rawData[0] : rawData;

      // Ensure the required fields exist and are arrays to prevent crashes
      const parsedData = {
        summary: Array.isArray(data?.summary) ? data.summary : [],
        priorities: Array.isArray(data?.priorities) ? data.priorities : [],
        recommendations: Array.isArray(data?.recommendations) ? data.recommendations : []
      };

      // If all arrays are empty, the payload structure doesn't match what we expect
      if (!parsedData.summary.length && !parsedData.priorities.length && !parsedData.recommendations.length) {
        console.error('Unexpected n8n response structure:', rawData);
        throw new Error('Received an unexpected data format from the webhook.');
      }

      setReportData(parsedData);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Unable to generate report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const priorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden">

      {/* TOP HEADER */}
      <header className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <img
            src="https://www.essnps.com/wp-content/uploads/2025/07/ESSNPS%C2%AE.svg"
            alt="ESSNPS Logo"
            className="h-10 w-auto object-contain"
          />
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <h1 className="text-lg font-bold text-slate-800 leading-tight hidden sm:block">AI Proactivity Nudge</h1>
        </div>
        <a href="mailto:info@essnps.com" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors group">
          <div className="w-9 h-9 rounded-full bg-slate-100 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
            <Mail className="w-4 h-4 group-hover:text-blue-600" />
          </div>
          <span className="text-sm font-semibold hidden sm:inline-block">info@essnps.com</span>
        </a>
      </header>

      {/* MAIN CONTENT PANELS */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* LEFT PANEL */}
        <div className="w-full md:w-[35%] bg-white border-r border-slate-200 flex flex-col h-full shadow-sm relative z-10">
          <div className="p-6 md:p-8 flex-1 overflow-y-auto">

            <h2 className="text-2xl font-semibold mb-6 text-slate-800">Generate Daily Report</h2>

            <div className="space-y-5">
              {/* Business Objective */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Target className="w-4 h-4 text-slate-400" />
                  Business Objective
                </label>
                <select
                  disabled={isLoading}
                  value={businessObjective}
                  onChange={(e) => setBusinessObjective(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option>Vendor Identification & Management</option>
                  <option>Quality Control & Inspections</option>
                  <option>Engineering & Design Support</option>
                  <option>Logistics & Export Coordination</option>
                  <option>Cost & Sourcing Optimization</option>
                </select>
              </div>

              {/* Project Category */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400" />
                  Project Category
                </label>
                <select
                  disabled={isLoading}
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option>Global Sourcing & Procurement</option>
                  <option>Mechanical & Detail Engineering</option>
                  <option>Fabrication & Assembly</option>
                  <option>Reverse & Allied Engineering</option>
                  <option>Quality Testing & FAT</option>
                </select>
              </div>

              {/* Priority Focus */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                  Priority Focus
                </label>
                <select
                  disabled={isLoading}
                  value={priorityFocus}
                  onChange={(e) => setPriorityFocus(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option>Delayed Suppliers</option>
                  <option>High Value Orders</option>
                  <option>Critical Deliveries</option>
                  <option>Pending RFQs</option>
                  <option>Vendor Escalations</option>
                </select>
              </div>

              {/* Region */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-slate-400" />
                  Region
                </label>
                <select
                  disabled={isLoading}
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option>India</option>
                  <option>Middle East</option>
                  <option>Europe</option>
                  <option>Global</option>
                </select>
              </div>

              {/* Additional Context */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-400" />
                  Additional Context
                </label>
                <textarea
                  disabled={isLoading}
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  rows={4}
                  placeholder="Focus on delayed suppliers and critical procurement opportunities."
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block p-3 transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-slate-100 bg-white">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full group relative flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-3.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-blue-600 overflow-hidden"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating AI Proactivity Report...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Generate Daily Proactivity Report</span>
                </>
              )}

              {/* Button Highlight Effect */}
              {!isLoading && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
              )}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full md:w-[65%] bg-slate-50/50 flex flex-col h-full overflow-y-auto relative">

          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

          <div className="p-8 md:p-12 max-w-4xl mx-auto w-full relative">

            {/* EMPTY STATE */}
            {!isLoading && !reportData && !error && (
              <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                  <BarChart3 className="w-10 h-10 text-blue-500/50" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Waiting for report generation...</h3>
                <p className="text-slate-500 max-w-sm">
                  Configure your parameters on the left and click generate to receive actionable AI insights for your supply chain.
                </p>
              </div>
            )}

            {/* LOADING STATE */}
            {isLoading && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
                  <h2 className="text-lg font-medium text-slate-700">Analyzing procurement data...</h2>
                </div>

                {/* Skeleton Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm shimmer-effect">
                      <div className="w-8 h-8 bg-slate-100 rounded-lg mb-4" />
                      <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-50 rounded w-1/2" />
                    </div>
                  ))}
                </div>

                {/* Skeleton Priorities */}
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <div className="h-5 bg-slate-100 rounded w-48 mb-6 shimmer-effect" />
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-lg border border-slate-50 shimmer-effect">
                      <div className="w-12 h-12 bg-slate-100 rounded-full shrink-0" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-100 rounded w-1/3" />
                        <div className="h-3 bg-slate-50 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ERROR STATE */}
            {error && !isLoading && (
              <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Generation Failed</h3>
                <p className="text-slate-500 max-w-sm mb-8">{error}</p>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                >
                  <RefreshCcw className="w-4 h-4" />
                  Try Again
                </button>
              </div>
            )}

            {/* SUCCESS STATE */}
            {reportData && !isLoading && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">AI Proactivity Report</h2>
                    <p className="text-sm text-slate-500 mt-1">Generated based on {region} region data</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Live Data
                  </span>
                </div>

                {/* 1. Executive Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    Executive Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {reportData?.summary?.map((item, idx) => (
                      <div key={idx} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-slate-700 font-medium leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Top Priorities */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Top Priorities Action Plan
                  </h3>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100">
                      {reportData?.priorities?.map((priority, idx) => (
                        <div key={idx} className="p-5 md:p-6 hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-lg">
                                {priority?.name?.charAt(0) || '?'}
                              </div>
                              <h4 className="font-semibold text-slate-900 text-lg">{priority?.name || 'Unknown'}</h4>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${priorityColor(priority?.priority || 'Medium')}`}>
                              {priority?.priority || 'Medium'} Priority
                            </span>
                          </div>
                          <div className="ml-13 space-y-2">
                            <div className="flex items-start gap-2 text-sm">
                              <span className="font-medium text-slate-500 w-16 shrink-0">Reason:</span>
                              <span className="text-slate-800">{priority?.reason || 'No reason provided'}</span>
                            </div>
                            <div className="flex items-start gap-2 text-sm bg-blue-50/50 p-3 rounded-lg border border-blue-100 mt-3">
                              <span className="font-medium text-blue-700 w-16 shrink-0">Action:</span>
                              <span className="text-blue-900 font-medium flex items-center gap-2">
                                {priority?.action || 'No action specified'}
                                <ChevronRight className="w-4 h-4 text-blue-400" />
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. AI Recommendations */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-indigo-500" />
                    AI Recommendations
                  </h3>
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 shadow-inner">
                    <ul className="space-y-3">
                      {reportData?.recommendations?.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </div>
                          <span className="text-slate-700 font-medium">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
