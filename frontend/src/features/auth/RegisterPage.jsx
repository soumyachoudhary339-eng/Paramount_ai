import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MOCK_CAREER_OPTIONS } from '../../data/mockCareerData';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { completeRegistration } = useAuth();
  
  // Track Multi-Step Form (1 = Account Setup, 2 = Career Goal Setup)
  const [step, setStep] = useState(1);

  // Backend Dynamic Career Data States
  const [careerOptions, setCareerOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [currentMapping, setCurrentMapping] = useState(null);

  // Consolidated Form State
  const [formData, setFormData] = useState({
    // Step 1: User Account Details
    name: '',
    email: '',
    password: '',
    // Step 2: Dynamic Career Options
    degree: '',
    targetRole: '',
    careerGoalText: '',
    experienceLevel: 'Beginner',
    targetIndustry: '',
    skills: [],
  });

  // Fetch Career Options from Express Backend when moving to Step 2
  useEffect(() => {
  if (step === 2) {
    setLoadingOptions(true);
    
    // Express API simulation delay (500ms)
    setTimeout(() => {
      setCareerOptions(MOCK_CAREER_OPTIONS);
      if (MOCK_CAREER_OPTIONS.length > 0) {
        applyDegreeData(MOCK_CAREER_OPTIONS[0]);
      }
      setLoadingOptions(false);
    }, 500);
  }
}, [step]);

  // Handle Degree Change & Auto-Fill Dependent Fields
  const handleDegreeChange = (e) => {
    const selectedDegreeStr = e.target.value;
    const matched = careerOptions.find((item) => item.degree === selectedDegreeStr);
    
    if (matched) {
      applyDegreeData(matched);
    }
  };

  const applyDegreeData = (mapping) => {
    setCurrentMapping(mapping);
    setFormData((prev) => ({
      ...prev,
      degree: mapping.degree,
      targetRole: mapping.roles?.[0]?.label || '',
      careerGoalText: mapping.defaultGoal || '',
      targetIndustry: mapping.targetIndustries?.[0] || '',
      skills: mapping.defaultSkills || [],
    }));
  };

  // Standard Text Input Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Move from Step 1 to Step 2
  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.password) {
      setStep(2);
    }
  };

  // Skill Removal Handler
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Final Form Submission to Redux & Backend Flow
  const handleFinalSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name: formData.name,
      email: formData.email,
    };

    const goalData = {
      degree: formData.degree,
      targetRole: formData.targetRole,
      careerGoalText: formData.careerGoalText,
      experienceLevel: formData.experienceLevel,
      targetIndustry: formData.targetIndustry,
      skills: formData.skills,
      suggestedCourses: currentMapping?.suggestedCourses || [],
    };

    // Save state globally
    completeRegistration(userData, goalData);

    // Redirect to Main Dashboard / Roadmap View
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      
      {/* Left Hero Branding Panel */}
      <div className="md:w-1/2 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-950 text-white flex flex-col justify-between p-8 md:p-12">
        <div>
          <span className="bg-indigo-600/40 border border-indigo-400/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Step {step} of 2
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mt-6">
            {step === 1 ? 'Create Student Account' : 'Define Your Career Destination'}
          </h1>
          <p className="text-indigo-200 mt-3 text-sm max-w-md">
            {step === 1
              ? 'Enter your account details to start customizing your AI-powered career path.'
              : 'Select your degree to auto-load targeted roles, skills, and industry roadmaps.'}
          </p>
        </div>

        <div className="pt-8 border-t border-indigo-700/50 text-xs text-indigo-300 flex justify-between">
          <span>Better Skills → Bigger Opportunities</span>
          <span>CareerForger ✨</span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12">
        <div className="w-full max-w-lg bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100">
          
          {/* STEP 1: Basic Personal Inputs */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h3 className="text-xl font-bold text-gray-800">1. Basic Details</h3>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. student@college.edu"
                  className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-600">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 font-bold transition text-sm mt-2"
              >
                Next: Career Goal & Setup →
              </button>
            </form>
          )}

          {/* STEP 2: API Mapped Qualification & Career Inputs */}
          {step === 2 && (
            <div>
              {loadingOptions ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                  <p className="text-sm font-semibold text-gray-600 mt-3">Fetching MongoDB Career Options...</p>
                </div>
              ) : (
                <form onSubmit={handleFinalSubmit} className="space-y-5">
                  <h3 className="text-xl font-bold text-gray-800">2. Qualification & Career Goal</h3>

                  {/* Degree Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                      Degree / Qualification
                    </label>
                    <select
                      name="degree"
                      value={formData.degree}
                      onChange={handleDegreeChange}
                      className="w-full p-3 border rounded-xl bg-white text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {careerOptions.map((opt) => (
                        <option key={opt._id || opt.degree} value={opt.degree}>
                          {opt.degree}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Target Career Roles (Grid selection) */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-2">
                      Target Career Role
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {currentMapping?.roles?.map((role) => (
                        <button
                          key={role.label}
                          type="button"
                          onClick={() => setFormData({ ...formData, targetRole: role.label })}
                          className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition ${
                            formData.targetRole === role.label
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow'
                              : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300'
                          }`}
                        >
                          <span>{role.icon || '🎯'}</span>
                          <span className="truncate">{role.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description Box */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                      Career Goal Description
                    </label>
                    <textarea
                      name="careerGoalText"
                      rows={2}
                      maxLength={200}
                      value={formData.careerGoalText}
                      onChange={handleChange}
                      placeholder="Type your goal objective..."
                      className="w-full p-3 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-2">
                      Current Experience
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['Beginner', 'Student', 'Intermediate', 'Advanced'].map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setFormData({ ...formData, experienceLevel: lvl })}
                          className={`py-2 text-[11px] font-semibold rounded-lg border transition ${
                            formData.experienceLevel === lvl
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Industry Dropdown */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                      Target Industry
                    </label>
                    <select
                      name="targetIndustry"
                      value={formData.targetIndustry}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {currentMapping?.targetIndustries?.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic Skills Chips */}
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-600 mb-2">
                      Current Skills
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-medium px-2.5 py-1 rounded-full flex items-center space-x-1"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="hover:text-red-500 font-bold ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Suggested Courses Preview */}
                  {currentMapping?.suggestedCourses?.length > 0 && (
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs">
                      <span className="font-bold text-indigo-900">📚 Related Mapped Courses:</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {currentMapping.suggestedCourses.map((c, i) => (
                          <span key={i} className="bg-white border text-indigo-800 px-2 py-0.5 rounded text-[11px]">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 bg-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-300 text-xs font-bold transition"
                    >
                      ‹ Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-emerald-600 text-white py-2.5 rounded-xl hover:bg-emerald-700 text-xs font-bold transition shadow-md"
                    >
                      Complete Registration ✨
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-xs text-gray-600 mt-6">
            Already registered?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};