import React from 'react';

export const ResumeForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, [section]: updated }));
  };

  const addField = (section, initialObj) => {
    setFormData((prev) => ({ ...prev, [section]: [...prev[section], initialObj] }));
  };

  return (
    <form className="space-y-6 text-xs">
      {/* Personal Info */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800 border-b pb-1 text-sm">Personal Information</h3>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            className="p-2 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="p-2 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="p-2 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <input
            type="text"
            name="targetRole"
            placeholder="Target Role (e.g. Full-Stack Developer)"
            value={formData.targetRole}
            onChange={handleChange}
            className="p-2 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <textarea
          name="summary"
          rows="2"
          placeholder="Professional Summary"
          value={formData.summary}
          onChange={handleChange}
          className="w-full p-2 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <h3 className="font-bold text-gray-800 border-b pb-1 text-sm">Key Skills</h3>
        <input
          type="text"
          name="skills"
          placeholder="Comma separated (e.g. React, Node.js, Express, MongoDB)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full p-2 border rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      {/* Dynamic Experience */}
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b pb-1">
          <h3 className="font-bold text-gray-800 text-sm">Experience</h3>
          <button
            type="button"
            onClick={() => addField('experience', { company: '', role: '', duration: '', details: '' })}
            className="text-indigo-600 font-bold hover:underline"
          >
            + Add
          </button>
        </div>

        {formData.experience.map((exp, idx) => (
          <div key={idx} className="p-3 bg-slate-50 rounded-xl space-y-2 border">
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => handleDynamicChange('experience', idx, 'company', e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Role"
                value={exp.role}
                onChange={(e) => handleDynamicChange('experience', idx, 'role', e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Duration (e.g. 2022 - Present)"
                value={exp.duration}
                onChange={(e) => handleDynamicChange('experience', idx, 'duration', e.target.value)}
                className="p-1.5 border rounded-lg bg-white"
              />
            </div>
            <textarea
              placeholder="Responsibilities / Accomplishments"
              rows="2"
              value={exp.details}
              onChange={(e) => handleDynamicChange('experience', idx, 'details', e.target.value)}
              className="w-full p-1.5 border rounded-lg bg-white"
            />
          </div>
        ))}
      </div>
    </form>
  );
};