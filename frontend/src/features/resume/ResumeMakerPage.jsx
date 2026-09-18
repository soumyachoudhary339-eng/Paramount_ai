import React, { useState } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { ResumePreview } from './components/ResumePreview';
 const ResumeMakerPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    targetRole: '',
    summary: '',
    skills: '',
    experience: [{ company: '', role: '', duration: '', details: '' }],
    education: [{ degree: '', institute: '', year: '' }],
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto print:p-0 print:m-0 print:max-w-none">
      <div className="print:hidden">
        <h1 className="text-xl font-bold text-gray-800">AI Resume Builder</h1>
        <p className="text-xs text-gray-500">Fill in your details to auto-generate an ATS-optimized resume</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start print:block print:w-full">
        {/* Form Column (Hidden in Print) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs print:hidden">
          <ResumeForm formData={formData} setFormData={setFormData} />
        </div>

        {/* Live Preview Column */}
        <div className="bg-slate-100 p-6 rounded-2xl border border-gray-200 sticky top-6 print:bg-white print:p-0 print:border-none print:static">
          <ResumePreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default ResumeMakerPage