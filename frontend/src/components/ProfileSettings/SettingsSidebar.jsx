import { User, Settings as SettingsIcon, Shield, ArrowLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SettingsSidebar = ({ activeTab, setActiveTab, handleLogout }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: "basic", label: "Basic Info", icon: User },
    { id: "account", label: "Account", icon: SettingsIcon },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sticky top-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <h2 className="text-lg font-bold text-white px-3 mb-4">Settings</h2>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
