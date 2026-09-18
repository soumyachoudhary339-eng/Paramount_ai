
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    { title: 'View Roadmap', desc: 'Track phase milestone', icon: '🗺️', route: '/roadmap', color: 'bg-indigo-50 border-indigo-100 text-indigo-900' },
    { title: 'Scan Resume', desc: 'Check ATS Compatibility', icon: '📄', route: '/resume-analyzer', color: 'bg-emerald-50 border-emerald-100 text-emerald-900' },
    { title: 'Create Resume', desc: 'Build ATS optimized CV', icon: '🛠️', route: '/resume-maker', color: 'bg-amber-50 border-amber-100 text-amber-900' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <h3 className="text-sm font-bold text-gray-800 mb-4">🚀 Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.route)}
            className={`p-4 rounded-xl border text-left transition hover:scale-[1.01] ${item.color}`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h4 className="text-xs font-bold">{item.title}</h4>
                <p className="text-[10px] opacity-75 mt-0.5">{item.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};