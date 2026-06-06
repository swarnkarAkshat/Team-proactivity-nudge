import { useState } from 'react';
import {
  Send,
  Loader2,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
  BarChart3,
  Globe2,
  Briefcase,
  Target,
  FileText,
  Mail
} from 'lucide-react';

interface N8nReportItem {
  title?: string;
  description?: string;
  risk_or_problem?: string;
  business_impact?: string;
  estimated_value?: string;
  expected_outcome?: string;
}

const WEBHOOK_URL = 'https://n8n.ianman.com/webhook/Team%20proactivity%20nudge';

function App() {
  const [businessObjective, setBusinessObjective] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [priorityFocus, setPriorityFocus] = useState('');
  const [region, setRegion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportData, setReportData] = useState<N8nReportItem[] | null>(null);

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

      const text = await response.text();
      let rawData;
      try {
        rawData = JSON.parse(text);
      } catch (e) {
        // Fallback for raw text or TSV responses
        const parts = text.split('\t');
        if (parts.length >= 6) {
          rawData = {
            title: parts[0].trim(),
            description: parts[1].trim(),
            risk_or_problem: parts[2].trim(),
            business_impact: parts[3].trim(),
            estimated_value: parts[4].trim(),
            expected_outcome: parts[5].trim()
          };
        } else {
          rawData = { title: 'AI Insights', description: text };
        }
      }

      // Handle n8n array-wrapped responses or single objects
      let dataArray: any[] = [];
      
      if (Array.isArray(rawData)) {
        if (rawData.length > 0 && rawData[0].json) {
          dataArray = rawData.map(item => item.json);
        } else {
          dataArray = rawData;
        }
      } else if (rawData && typeof rawData === 'object') {
        if (rawData.data && Array.isArray(rawData.data)) {
          dataArray = rawData.data;
        } else {
          dataArray = [rawData];
        }
      }

      // Robust case-insensitive mapping
      const normalizeItem = (item: any): N8nReportItem => {
        if (!item || typeof item !== 'object') return {};
        const getVal = (keyStr: string) => {
          const found = Object.keys(item).find(k => k.toLowerCase().replace(/_/g, '') === keyStr.toLowerCase().replace(/_/g, ''));
          return found ? item[found] : undefined;
        };
        return {
          title: getVal('title'),
          description: getVal('description') || getVal('desc'),
          risk_or_problem: getVal('riskorproblem') || getVal('risk') || getVal('problem'),
          business_impact: getVal('businessimpact') || getVal('impact'),
          estimated_value: getVal('estimatedvalue') || getVal('value'),
          expected_outcome: getVal('expectedoutcome') || getVal('outcome')
        };
      };

      const finalData: N8nReportItem[] = dataArray.map(normalizeItem);

      if (!finalData.length || (!finalData[0].title && !finalData[0].description)) {
        console.warn('Unexpected n8n response structure:', rawData);
      }

      setReportData(finalData);
    } catch (err) {
      console.error('Error generating report:', err);
      setError('Unable to generate report. Please try again.');
    } finally {
      setIsLoading(false);
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
                  <option value="" disabled>Choose the Business Objective</option>
                  <option value="Vendor Identification & Management">Vendor Identification & Management</option>
                  <option value="Quality Control & Inspections">Quality Control & Inspections</option>
                  <option value="Engineering & Design Support">Engineering & Design Support</option>
                  <option value="Logistics & Export Coordination">Logistics & Export Coordination</option>
                  <option value="Cost & Sourcing Optimization">Cost & Sourcing Optimization</option>
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
                  <option value="" disabled>Choose the Project Category</option>
                  <option value="Global Sourcing & Procurement">Global Sourcing & Procurement</option>
                  <option value="Mechanical & Detail Engineering">Mechanical & Detail Engineering</option>
                  <option value="Fabrication & Assembly">Fabrication & Assembly</option>
                  <option value="Reverse & Allied Engineering">Reverse & Allied Engineering</option>
                  <option value="Quality Testing & FAT">Quality Testing & FAT</option>
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
                  <option value="" disabled>Choose the Priority Focus</option>
                  <option value="Delayed Suppliers">Delayed Suppliers</option>
                  <option value="High Value Orders">High Value Orders</option>
                  <option value="Critical Deliveries">Critical Deliveries</option>
                  <option value="Pending RFQs">Pending RFQs</option>
                  <option value="Vendor Escalations">Vendor Escalations</option>
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
                  <option value="" disabled>Choose the Region</option>
                  <option value="India">India</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Europe">Europe</option>
                  <option value="Global">Global</option>
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
            {reportData && !isLoading && reportData.length > 0 && (
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

                <div className="space-y-8">
                  {reportData.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="bg-slate-50/80 border-b border-slate-200 p-6 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 shadow-inner">
                          <Target className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 leading-tight mb-2">
                            {item.title || 'Proactive Intervention Identified'}
                          </h3>
                          <p className="text-slate-600 leading-relaxed text-sm">
                            {item.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Risk / Problem */}
                          <div className="bg-red-50/50 border border-red-100/50 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-red-800 mb-3">
                              <AlertCircle className="w-4 h-4" />
                              Risk or Problem
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                              {item.risk_or_problem || 'N/A'}
                            </p>
                          </div>

                          {/* Expected Outcome */}
                          <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-3">
                              <CheckCircle2 className="w-4 h-4" />
                              Expected Outcome
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                              {item.expected_outcome || 'N/A'}
                            </p>
                          </div>

                          {/* Business Impact */}
                          <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-blue-800 mb-3">
                              <Briefcase className="w-4 h-4" />
                              Business Impact
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                              {item.business_impact || 'N/A'}
                            </p>
                          </div>

                          {/* Estimated Value */}
                          <div className="bg-amber-50/50 border border-amber-100/50 rounded-xl p-5 hover:shadow-md transition-shadow">
                            <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-3">
                              <BarChart3 className="w-4 h-4" />
                              Estimated Value
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed">
                              {item.estimated_value || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
