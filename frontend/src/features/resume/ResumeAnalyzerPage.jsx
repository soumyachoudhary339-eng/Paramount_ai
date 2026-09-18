import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiInstance from '../../api/apiInstance';
import { analyzeResumePDFAPI } from '../../api/apiAnalyzeResume';
import { SkillGapChart } from '../roadmap/components/SkillGapChart';
import { MilestoneCard } from '../roadmap/components/MilestoneCard';

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const validateFile = (file) => {
  if (!file) return 'Choose a PDF file to continue.';
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    return 'Only PDF files are supported.';
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `That file is ${formatFileSize(file.size)}. The limit is ${MAX_FILE_SIZE_MB} MB.`;
  }
  return null;
};

const scoreBand = (score) => {
  if (score >= 80) return { color: '#059669', wash: '#ECFDF5', label: 'Strong match' };
  if (score >= 55) return { color: '#D97706', wash: '#FFFBEB', label: 'Partial match' };
  return { color: '#E11D48', wash: '#FEF2F2', label: 'Needs work' };
};

const ScoreGauge = ({ score = 0 }) => {
  const band = scoreBand(score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: 132, height: 132 }}>
      <svg viewBox="0 0 132 132" className="-rotate-90" width="132" height="132">
        <circle cx="66" cy="66" r={radius} fill="none" stroke="#EEF0FD" strokeWidth="12" />
        <circle
          cx="66"
          cy="66"
          r={radius}
          fill="none"
          stroke={band.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color: '#1B1F3B' }}>
          {score}%
        </span>
        <span className="text-[10px] font-medium" style={{ color: band.color }}>
          {band.label}
        </span>
      </div>
    </div>
  );
};

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 15V4m0 0L8 8m4-4l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DocIcon = ({ className }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const ResumeAnalyzerPage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Full-Stack Developer');
  const [loading, setLoading] = useState(false);
  const [savingRoadmap, setSavingRoadmap] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (analysis) {
      const id = requestAnimationFrame(() => setResultsVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setResultsVisible(false);
  }, [analysis]);

  const applyFile = useCallback((candidate) => {
    const validationError = validateFile(candidate);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setFile(candidate);
  }, []);

  const handleFileInputChange = (e) => {
    const candidate = e.target.files?.[0] ?? null;
    if (candidate) applyFile(candidate);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer?.types?.includes('Files')) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    const candidate = e.dataTransfer.files?.[0] ?? null;
    if (candidate) applyFile(candidate);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    handleRemoveFile();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!targetRole.trim()) {
      setError('Enter a target role so the scan can compare your resume against it.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole.trim());

    try {
      const response = await analyzeResumePDFAPI(formData);
      const analysisData = response.data?.data?.analysis || response.data?.analysis || response.data;
      setAnalysis(analysisData);

      setSavingRoadmap(true);

      // Convert status values to lowercase to pass Backend Enum validation ('pending', 'in-progress', 'completed')
      const rawMilestones = analysisData.milestones || analysisData.roadmap || [];
      const milestonesToSave = rawMilestones.map((m) => ({
        ...m,
        topics: m.topics || m.skills || [],
        status: (m.status || 'pending').toLowerCase(),
      }));

      // Sanitize Skill Gap fields to prevent calculation errors
      const rawSkillGap = analysisData.skillGap || [];
      // Payload definition inside handleSubmit:
      const skillGapToSave = rawSkillGap.map((s) => ({
        name: s.skillName || s.skill || s.name || 'Skill',
        currentLevel: Number(s.currentProficiency ?? s.currentLevel ?? s.current ?? 0),
        requiredLevel: Number(s.targetProficiency ?? s.requiredLevel ?? s.targetLevel ?? 100),
      }));

      await apiInstance.post('/roadmap/create', {
        targetRole: analysisData.targetRole || targetRole.trim(),
        atsScore: Number(analysisData.atsScore || 0),
        milestones: milestonesToSave,
        skillGap: skillGapToSave,
      });

    } catch (err) {
      const status = err.response?.status;
      if (status === 413) {
        setError('That file is too large for the server to process.');
      } else if (status === 415) {
        setError('The server could not read this file as a PDF.');
      } else if (!err.response) {
        setError('Could not reach the server. Check your connection and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to analyze PDF file.');
      }
    } finally {
      setLoading(false);
      setSavingRoadmap(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #7C6EF6)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5" stroke="white" strokeWidth="1.8" />
            <path d="M20 20l-4.3-4.3" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: '#1B1F3B' }}>
            Resume &amp; roadmap scanner
          </h1>
          <p className="text-xs" style={{ color: '#5B6178' }}>
            Upload a PDF resume to get an ATS (Applicant Tracking System) match score, skill gaps, and a learning path
          </p>
        </div>
      </div>

      <div className={`grid gap-6 items-start ${analysis ? '' : 'lg:grid-cols-[0.85fr_1.15fr]'}`}>
        {/* How-it-works panel */}
        {!analysis && (
          <div
            className="hidden lg:flex flex-col gap-5 p-6 rounded-3xl sticky top-6"
            style={{ background: 'linear-gradient(160deg, #F5F5FE, #FFFFFF)', border: '1px solid #E7E8F5' }}
          >
            <span
              className="inline-flex w-fit text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: '#EEF0FD', color: '#4F46E5' }}
            >
              How it works
            </span>
            <h2 className="text-lg font-bold leading-snug" style={{ color: '#1B1F3B' }}>
              Three steps to a sharper resume
            </h2>
            <ol className="space-y-4">
              {[
                { title: 'Upload your resume', desc: 'Drop in a PDF and we read it right away, no account setup needed.' },
                { title: 'Set your target role', desc: 'That role sets the bar for which keywords and skills we check for.' },
                { title: 'Get a plan, not just a score', desc: 'See exactly which skills are missing and what to learn next.' },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-3">
                  <span
                    className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: '#4F46E5', color: 'white' }}
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#1B1F3B' }}>{step.title}</p>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#5B6178' }}>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* File Upload Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-3xl border space-y-4 transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(79,70,229,0.08)]"
          style={{ borderColor: '#E7E8F5', boxShadow: '0 1px 2px rgba(27,31,59,0.04)' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="targetRole" className="block text-xs font-semibold mb-1.5" style={{ color: '#1B1F3B' }}>
                Target role
              </label>
              <input
                id="targetRole"
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full h-[46px] px-3.5 text-sm border rounded-xl outline-none transition focus:ring-2"
                style={{ borderColor: '#E2E4F1' }}
                placeholder="e.g. Full-Stack Developer"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold mb-1.5" style={{ color: '#1B1F3B' }}>
                Resume PDF
              </span>
              {!file ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="w-full h-[46px] px-3.5 flex items-center gap-2.5 text-sm rounded-xl cursor-pointer transition"
                  style={{
                    border: `1.5px dashed ${isDragging ? '#4F46E5' : '#CBCEEE'}`,
                    background: isDragging ? '#EEF0FD' : 'transparent',
                  }}
                >
                  <UploadIcon />
                  <span className="truncate text-xs" style={{ color: '#5B6178' }}>
                    {isDragging ? 'Drop PDF here' : 'Click or drag PDF · up to 10 MB'}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div
                  className="w-full h-[46px] px-3.5 flex items-center justify-between gap-2 text-sm rounded-xl"
                  style={{ border: '1.5px solid #E2E4F1', background: '#F8F8FD' }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <DocIcon />
                    <span className="truncate text-xs font-medium" style={{ color: '#1B1F3B' }}>{file.name}</span>
                    <span className="shrink-0 text-[10px]" style={{ color: '#9295B8' }}>{formatFileSize(file.size)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    disabled={loading || savingRoadmap}
                    className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center transition hover:bg-rose-50"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="text-xs font-medium p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || savingRoadmap || !file}
            className="w-full h-[46px] text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #4338CA)' }}
          >
            {loading ? (savingRoadmap ? 'Saving roadmap to profile…' : 'Analyzing resume with AI…') : 'Scan resume & generate roadmap'}
          </button>
        </form>
      </div>

      {/* AI Diagnostic Output */}
      {analysis && (
        <div
          className="space-y-6 transition-all duration-500 ease-out"
          style={{
            opacity: resultsVisible ? 1 : 0,
            transform: resultsVisible ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          {/* Header Score Card */}
          <div
            className="p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4"
            style={{ background: 'linear-gradient(135deg, #F5F5FE 0%, #FFFFFF 65%)', border: '1px solid #E7E8F5' }}
          >
            <div className="flex items-center gap-5">
              <ScoreGauge score={analysis.atsScore ?? 0} />
              <div>
                <span className="block text-xs font-medium" style={{ color: '#9295B8' }}>Target role</span>
                <h2 className="text-lg font-bold" style={{ color: '#1B1F3B' }}>
                  {analysis.targetRole || targetRole}
                </h2>
                <span className="block text-xs mt-1" style={{ color: '#5B6178' }}>ATS match index</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/roadmap')}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl transition text-white"
                style={{ background: '#4F46E5' }}
              >
                View full interactive roadmap →
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold px-4 py-2.5 rounded-xl border transition hover:bg-white"
                style={{ color: '#4F46E5', borderColor: '#C7C9F5' }}
              >
                Scan another resume
              </button>
            </div>
          </div>

          {/* Skill Gap Chart */}
          <div className="p-6 rounded-3xl bg-white" style={{ border: '1px solid #E7E8F5' }}>
            <h3 className="font-bold text-sm mb-4" style={{ color: '#1B1F3B' }}>Skill gaps against this role</h3>
            <SkillGapChart skills={analysis.skillGap} />
          </div>

          {/* Learning Roadmap */}
          <div className="p-6 rounded-3xl bg-white" style={{ border: '1px solid #E7E8F5' }}>
            <h3 className="font-bold text-sm mb-4" style={{ color: '#1B1F3B' }}>Suggested learning roadmap</h3>
            {(analysis.milestones || analysis.roadmap) && (analysis.milestones?.length > 0 || analysis.roadmap?.length > 0) ? (
              <div className="space-y-3">
                {(analysis.milestones || analysis.roadmap).map((milestone, idx) => (
                  <MilestoneCard key={milestone.id || idx} milestone={milestone} index={idx} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No roadmap milestones were returned for this scan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzerPage;