import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../utilities/axiosClient";
import { toast } from "react-hot-toast";
import {
  Settings as SettingsIcon,
  Shield,
  Globe,
  Bell,
  Database,
  Code,
  Zap,
  Lock,
  Users,
  FileCode,
  Clock,
  Server,
  RefreshCw,
  Save,
  ToggleLeft,
  ToggleRight,
  Info,
  CheckCircle,
  AlertTriangle,
  HardDrive,
  Cpu,
  Activity,
  Key,
  Mail,
  Palette,
} from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const { user, isAuthenticated } = useSelector((state) => state.authentication);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchSettings();
    }
  }, [isAuthenticated, user]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [settingsRes, healthRes] = await Promise.all([
        axiosClient.get("/admin/settings"),
        axiosClient.get("/admin/health"),
      ]);
      setSettings(settingsRes.data.settings);
      setSystemHealth(healthRes.data);
    } catch (error) {
      toast.error("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (category, key) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key],
      },
    }));
  };

  const handleChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // In a real app, this would save to backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // Color utility functions for Tailwind compatibility
  const getTextColor = (color) => {
    const colors = {
      blue: "text-blue-400",
      purple: "text-purple-400",
      emerald: "text-emerald-400",
      orange: "text-orange-400",
      red: "text-red-400",
      yellow: "text-yellow-400",
      cyan: "text-cyan-400",
      green: "text-green-400",
      slate: "text-slate-400",
    };
    return colors[color] || "text-slate-400";
  };

  const getBgColor = (color) => {
    const colors = {
      blue: "bg-blue-500/10",
      purple: "bg-purple-500/10",
      emerald: "bg-emerald-500/10",
      orange: "bg-orange-500/10",
      red: "bg-red-500/10",
      yellow: "bg-yellow-500/10",
      cyan: "bg-cyan-500/10",
      green: "bg-green-500/10",
      slate: "bg-slate-500/10",
    };
    return colors[color] || "bg-slate-500/10";
  };

  const getActiveLangStyle = (color, isEnabled) => {
    if (!isEnabled) return "bg-slate-800/50 hover:bg-slate-700/50";
    const styles = {
      slate: "bg-slate-500/10 border border-slate-500/30",
      blue: "bg-blue-500/10 border border-blue-500/30",
      orange: "bg-orange-500/10 border border-orange-500/30",
      yellow: "bg-yellow-500/10 border border-yellow-500/30",
      cyan: "bg-cyan-500/10 border border-cyan-500/30",
    };
    return styles[color] || "bg-slate-500/10 border border-slate-500/30";
  };

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "features", label: "Features", icon: Zap },
    { id: "limits", label: "Limits", icon: Lock },
    { id: "languages", label: "Languages", icon: Code },
    { id: "system", label: "System", icon: Server },
  ];

  const Toggle = ({ enabled, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-blue-600" : "bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400">Administrator privileges required</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Platform Settings
          </h1>
          <p className="text-slate-400 mt-1">
            Configure your AlgoForge platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSettings}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-800 overflow-hidden">
        {/* General Settings */}
        {activeTab === "general" && settings?.general && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                General Settings
              </h3>
              <div className="space-y-4">
                {/* Platform Name */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Platform Name</p>
                    <p className="text-xs text-slate-500">
                      The name displayed across your platform
                    </p>
                  </div>
                  <input
                    type="text"
                    value={settings.general.platformName}
                    onChange={(e) =>
                      handleChange("general", "platformName", e.target.value)
                    }
                    className="w-full sm:w-64 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Platform Description */}
                <div className="flex flex-col gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Platform Description
                    </p>
                    <p className="text-xs text-slate-500">
                      Brief description for SEO and marketing
                    </p>
                  </div>
                  <textarea
                    value={settings.general.platformDescription}
                    onChange={(e) =>
                      handleChange("general", "platformDescription", e.target.value)
                    }
                    rows={2}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Maintenance Mode */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Maintenance Mode
                    </p>
                    <p className="text-xs text-slate-500">
                      Temporarily disable access for non-admin users
                    </p>
                  </div>
                  <Toggle
                    enabled={settings.general.maintenanceMode}
                    onChange={() => handleToggle("general", "maintenanceMode")}
                  />
                </div>

                {/* Allow Registrations */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      Allow New Registrations
                    </p>
                    <p className="text-xs text-slate-500">
                      Enable or disable new user sign-ups
                    </p>
                  </div>
                  <Toggle
                    enabled={settings.general.allowRegistrations}
                    onChange={() => handleToggle("general", "allowRegistrations")}
                  />
                </div>

                {/* Email Verification */}
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-400" />
                      Require Email Verification
                    </p>
                    <p className="text-xs text-slate-500">
                      Users must verify email before accessing platform
                    </p>
                  </div>
                  <Toggle
                    enabled={settings.general.requireEmailVerification}
                    onChange={() =>
                      handleToggle("general", "requireEmailVerification")
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features Settings */}
        {activeTab === "features" && settings?.features && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Feature Toggles
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    key: "aiAssistant",
                    label: "AI Assistant",
                    description: "Enable AI-powered coding help",
                    icon: Cpu,
                    color: "purple",
                  },
                  {
                    key: "editorials",
                    label: "Problem Editorials",
                    description: "Show solution explanations",
                    icon: FileCode,
                    color: "blue",
                  },
                  {
                    key: "leaderboard",
                    label: "Leaderboard",
                    description: "Public rankings and scores",
                    icon: Activity,
                    color: "emerald",
                  },
                  {
                    key: "discussions",
                    label: "Discussions",
                    description: "Community discussion forums",
                    icon: Users,
                    color: "orange",
                  },
                  {
                    key: "contests",
                    label: "Contests",
                    description: "Timed coding competitions",
                    icon: Clock,
                    color: "red",
                  },
                ].map((feature) => (
                  <div
                    key={feature.key}
                    className={`p-4 bg-slate-800/50 rounded-lg border ${
                      settings.features[feature.key]
                        ? "border-slate-600"
                        : "border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${getBgColor(feature.color)} rounded-lg`}>
                          <feature.icon
                            className={`w-5 h-5 ${getTextColor(feature.color)}`}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {feature.label}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <Toggle
                        enabled={settings.features[feature.key]}
                        onChange={() => handleToggle("features", feature.key)}
                      />
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <div className="flex items-center gap-2">
                        {settings.features[feature.key] ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs text-emerald-400">Enabled</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-slate-500" />
                            <span className="text-xs text-slate-500">Disabled</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Limits Settings */}
        {activeTab === "limits" && settings?.limits && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-400" />
                Rate Limits & Constraints
              </h3>
              <div className="space-y-4">
                {/* Max Submissions Per Day */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Max Submissions Per Day
                    </p>
                    <p className="text-xs text-slate-500">
                      Limit per user to prevent abuse
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.limits.maxSubmissionsPerDay}
                      onChange={(e) =>
                        handleChange(
                          "limits",
                          "maxSubmissionsPerDay",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                      className="w-24 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm text-center focus:border-blue-500"
                    />
                    <span className="text-slate-500 text-sm">per day</span>
                  </div>
                </div>

                {/* Max Code Length */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Max Code Length
                    </p>
                    <p className="text-xs text-slate-500">
                      Maximum characters allowed per submission
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.limits.maxCodeLength}
                      onChange={(e) =>
                        handleChange(
                          "limits",
                          "maxCodeLength",
                          parseInt(e.target.value)
                        )
                      }
                      min={1000}
                      step={1000}
                      className="w-28 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm text-center focus:border-blue-500"
                    />
                    <span className="text-slate-500 text-sm">chars</span>
                  </div>
                </div>

                {/* Submission Timeout */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Submission Timeout
                    </p>
                    <p className="text-xs text-slate-500">
                      Maximum execution time per submission
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.limits.submissionTimeout}
                      onChange={(e) =>
                        handleChange(
                          "limits",
                          "submissionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                      max={60}
                      className="w-20 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm text-center focus:border-blue-500"
                    />
                    <span className="text-slate-500 text-sm">seconds</span>
                  </div>
                </div>

                {/* Max Test Cases */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Max Test Cases Per Problem
                    </p>
                    <p className="text-xs text-slate-500">
                      Maximum number of test cases allowed
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={settings.limits.maxTestCases}
                      onChange={(e) =>
                        handleChange(
                          "limits",
                          "maxTestCases",
                          parseInt(e.target.value)
                        )
                      }
                      min={1}
                      max={100}
                      className="w-20 bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm text-center focus:border-blue-500"
                    />
                    <span className="text-slate-500 text-sm">cases</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-400">
                    About Rate Limits
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Rate limits help protect your platform from abuse and ensure fair
                    resource distribution among all users. Adjust these values based
                    on your server capacity and user needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Languages Settings */}
        {activeTab === "languages" && settings?.languages && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                Programming Languages
              </h3>

              {/* Default Language */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg mb-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    Default Language
                  </p>
                  <p className="text-xs text-slate-500">
                    Pre-selected language for new submissions
                  </p>
                </div>
                <select
                  value={settings.languages.default}
                  onChange={(e) =>
                    handleChange("languages", "default", e.target.value)
                  }
                  className="bg-slate-700 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm focus:border-blue-500"
                >
                  {settings.languages.enabled.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Enabled Languages */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm font-medium text-white mb-4">
                  Enabled Languages
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "c", name: "C", color: "slate" },
                    { id: "cpp", name: "C++", color: "blue" },
                    { id: "java", name: "Java", color: "orange" },
                    { id: "javascript", name: "JavaScript", color: "yellow" },
                    { id: "python", name: "Python", color: "cyan" },
                  ].map((lang) => (
                    <label
                      key={lang.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        settings.languages.enabled.includes(lang.id)
                          ? getActiveLangStyle(lang.color, true)
                          : "bg-slate-700/50 border border-slate-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={settings.languages.enabled.includes(lang.id)}
                        onChange={() => {
                          const enabled = settings.languages.enabled;
                          if (enabled.includes(lang.id)) {
                            if (enabled.length > 1) {
                              handleChange(
                                "languages",
                                "enabled",
                                enabled.filter((l) => l !== lang.id)
                              );
                            }
                          } else {
                            handleChange("languages", "enabled", [
                              ...enabled,
                              lang.id,
                            ]);
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                      />
                      <span className="text-sm text-white">{lang.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === "system" && systemHealth && (
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Server className="w-5 h-5 text-purple-400" />
                System Information
              </h3>

              {/* Health Status */}
              <div className="p-4 bg-slate-800/50 rounded-lg mb-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-white">System Health</p>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      systemHealth.status === "healthy"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {systemHealth.status === "healthy" ? "All Systems Operational" : "Issues Detected"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Database */}
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-slate-400">Database</span>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {systemHealth.database?.connected ? "Connected" : "Disconnected"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {systemHealth.database?.dataSize}
                    </p>
                  </div>

                  {/* Memory */}
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-slate-400">Memory</span>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {systemHealth.memoryUsage?.heapUsed}
                    </p>
                    <p className="text-xs text-slate-500">
                      of {systemHealth.memoryUsage?.heapTotal}
                    </p>
                  </div>

                  {/* Uptime */}
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs text-slate-400">Uptime</span>
                    </div>
                    <p className="text-sm font-medium text-white">
                      {Math.floor(systemHealth.uptime / 3600)}h{" "}
                      {Math.floor((systemHealth.uptime % 3600) / 60)}m
                    </p>
                    <p className="text-xs text-slate-500">
                      {Math.floor(systemHealth.uptime % 60)}s
                    </p>
                  </div>

                  {/* Node Version */}
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <HardDrive className="w-4 h-4 text-orange-400" />
                      <span className="text-xs text-slate-400">Runtime</span>
                    </div>
                    <p className="text-sm font-medium text-white">
                      Node.js
                    </p>
                    <p className="text-xs text-slate-500">
                      {systemHealth.nodeVersion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Storage Info */}
              <div className="p-4 bg-slate-800/50 rounded-lg mb-4">
                <p className="text-sm font-medium text-white mb-4">Storage Usage</p>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Data Size</span>
                      <span className="text-white">
                        {systemHealth.database?.dataSize}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: "45%" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Storage Size</span>
                      <span className="text-white">
                        {systemHealth.database?.storageSize}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: "35%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <p className="text-sm font-medium text-white mb-4">Quick Actions</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      toast.success("Cache cleared successfully");
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Clear Cache
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Backup initiated");
                    }}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <Database className="w-4 h-4" />
                    Backup Database
                  </button>
                  <button
                    onClick={fetchSettings}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <Activity className="w-4 h-4" />
                    Health Check
                  </button>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-400">
                    System Administration
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Changes to system settings can affect platform stability. Make
                    sure to backup your data before making significant changes.
                  </p>
                </div>
              </div>
            </div>

            {/* API Keys Section */}
            <div className="mt-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-semibold text-white">API Configuration</h3>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Judge0 API</p>
                    <p className="text-xs text-slate-500">Code execution service</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Gemini AI API</p>
                    <p className="text-xs text-slate-500">AI assistant service</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-white">Redis Cache</p>
                    <p className="text-xs text-slate-500">Session & rate limiting</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
