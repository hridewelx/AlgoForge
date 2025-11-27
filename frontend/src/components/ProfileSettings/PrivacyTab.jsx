import { Shield } from "lucide-react";

const PrivacyTab = () => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-12 text-center">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <Shield className="w-8 h-8 text-slate-600" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Coming Soon</h3>
      <p className="text-slate-400">Privacy settings will be available soon.</p>
    </div>
  );
};

export default PrivacyTab;
