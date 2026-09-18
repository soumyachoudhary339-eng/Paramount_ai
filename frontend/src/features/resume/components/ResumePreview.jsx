import React from 'react';

export const ResumePreview = ({ formData }) => {
  const { fullName, email, phone, targetRole, summary, skills, experience } = formData;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Action Header - Hidden during print */}
      <div className="flex justify-between items-center print:hidden">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Preview</span>
        <button
          onClick={handlePrint}
          className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition"
        >
          Print / Export PDF 🖨️
        </button>
      </div>

      {/* Printable Sheet: Pure Tailwind print classes for fixed positioning */}
      <div
        id="printable-resume"
        className="bg-white p-8 rounded-lg shadow-md min-h-[600px] text-gray-800 space-y-4 print:fixed print:inset-0 print:z-[9999] print:m-0 print:p-8 print:w-full print:h-auto print:bg-white print:shadow-none print:border-none print:block"
      >
        {/* Header */}
        <div className="border-b pb-3 border-gray-200">
          <h1 className="text-xl font-bold uppercase text-slate-900">{fullName || 'Your Name'}</h1>
          <p className="text-xs font-semibold text-indigo-600">{targetRole || 'Target Role'}</p>
          <div className="text-[10px] text-gray-500 mt-1 space-x-3">
            {email && <span>📧 {email}</span>}
            {phone && <span>📞 {phone}</span>}
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-700 border-b border-gray-200 pb-0.5 mb-1">Summary</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">{summary}</p>
          </div>
        )}

        {/* Skills */}
        {skills && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-700 border-b border-gray-200 pb-0.5 mb-1">Skills</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {skills.split(',').map((skill, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md font-medium print:border print:border-gray-300">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience?.some((e) => e.company || e.role) && (
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-700 border-b border-gray-200 pb-0.5 mb-2">Experience</h4>
            {experience.map((exp, idx) => (
              <div key={idx} className="mb-2 text-[11px]">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>{exp.role || 'Role'} {exp.company && `at ${exp.company}`}</span>
                  <span className="text-gray-400 text-[10px]">{exp.duration}</span>
                </div>
                {exp.details && <p className="text-gray-600 mt-0.5 text-[10px]">{exp.details}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};