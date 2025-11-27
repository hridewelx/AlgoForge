import { useState } from "react";
import { Check, X, Eye, EyeOff, Linkedin, Github, Twitter, Plus, Trash2, Mail, AlertCircle } from "lucide-react";

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const AccountTab = ({
  accountData,
  editingUsername,
  setEditingUsername,
  tempUsername,
  setTempUsername,
  handleUpdateUsername,
  showPasswordForm,
  setShowPasswordForm,
  passwordData,
  setPasswordData,
  showPasswords,
  setShowPasswords,
  handlePasswordChange,
  changingPassword,
  formData,
  setActiveTab,
  setShowDeleteModal,
  // New props for email management
  secondaryEmails = [],
  handleAddSecondaryEmail,
  handleRemoveSecondaryEmail,
  handleChangePrimaryEmail,
}) => {
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [addingEmail, setAddingEmail] = useState(false);
  const [showAddEmail, setShowAddEmail] = useState(false);

  const validateAndAddEmail = async () => {
    if (!newEmail.trim()) {
      setEmailError("Email is required");
      return;
    }
    if (!isValidEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (newEmail.toLowerCase() === accountData.email.toLowerCase()) {
      setEmailError("This is already your primary email");
      return;
    }
    if (secondaryEmails.includes(newEmail.toLowerCase())) {
      setEmailError("This email is already added");
      return;
    }

    setAddingEmail(true);
    setEmailError("");
    
    try {
      await handleAddSecondaryEmail(newEmail);
      setNewEmail("");
      setShowAddEmail(false);
    } catch (error) {
      setEmailError(error.message || "Failed to add email");
    } finally {
      setAddingEmail(false);
    }
  };

  // Check if new password matches current password (frontend pre-check)
  const isPasswordSameAsCurrent = passwordData.newPassword && 
    passwordData.currentPassword && 
    passwordData.newPassword === passwordData.currentPassword;

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-lg font-bold text-white mb-6">Account Information</h2>

        {/* Username */}
        <div className="flex items-center justify-between py-4 border-b border-slate-800">
          <div className="flex-1">
            <label className="text-sm text-slate-400">AlgoForge ID</label>
            {editingUsername ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleUpdateUsername}
                  className="p-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setEditingUsername(false);
                    setTempUsername(accountData.username);
                  }}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-white mt-1">{accountData.username}</p>
            )}
          </div>
          {!editingUsername && (
            <button
              onClick={() => setEditingUsername(true)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Edit
            </button>
          )}
        </div>

        {/* Primary Email */}
        <div className="py-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm text-slate-400">Primary Email</label>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-slate-500" />
                <p className="text-white">{accountData.email}</p>
                <span className="px-2 py-0.5 bg-green-600/20 text-green-400 text-xs rounded-full">
                  Primary
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Emails */}
        <div className="py-4 border-b border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm text-slate-400">Additional Emails</label>
            {!showAddEmail && (
              <button
                onClick={() => setShowAddEmail(true)}
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Email
              </button>
            )}
          </div>

          {/* Add new email form */}
          {showAddEmail && (
            <div className="mb-4 p-3 bg-slate-950 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="Enter email address"
                  className={`flex-1 px-3 py-1.5 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 ${
                    emailError ? "border-red-500" : "border-slate-700"
                  }`}
                />
                <button
                  onClick={validateAndAddEmail}
                  disabled={addingEmail}
                  className="p-1.5 bg-green-600 hover:bg-green-500 rounded-lg text-white transition-colors disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setShowAddEmail(false);
                    setNewEmail("");
                    setEmailError("");
                  }}
                  className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {emailError && (
                <div className="flex items-center gap-1 mt-2 text-red-400 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {emailError}
                </div>
              )}
            </div>
          )}

          {/* List of secondary emails */}
          {secondaryEmails.length > 0 ? (
            <div className="space-y-2">
              {secondaryEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-slate-950 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-white text-sm">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleChangePrimaryEmail(email)}
                      className="text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                    >
                      Make Primary
                    </button>
                    <button
                      onClick={() => handleRemoveSecondaryEmail(email)}
                      className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">No additional emails added</p>
          )}
        </div>

        {/* Password */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm text-slate-400">Password</label>
              <p className="text-white mt-1">••••••••</p>
            </div>
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Change Password
            </button>
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordChange} className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                    }
                    className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 pr-10 ${
                      isPasswordSameAsCurrent ? "border-red-500" : "border-slate-700"
                    }`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {isPasswordSameAsCurrent && (
                  <div className="flex items-center gap-1 text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    New password must be different from current password
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    className={`w-full px-3 py-2 bg-slate-900 border rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 pr-10 ${
                      passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                        ? "border-red-500"
                        : "border-slate-700"
                    }`}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <div className="flex items-center gap-1 text-red-400 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    Passwords do not match
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={changingPassword || isPasswordSameAsCurrent || (passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {changingPassword ? "Changing..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Social Accounts */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
        <h2 className="text-lg font-bold text-white mb-6">Social Account</h2>

        {[
          { name: "LinkedIn", icon: Linkedin, color: "text-blue-500", connected: !!formData.linkedin },
          { name: "GitHub", icon: Github, color: "text-white", connected: !!formData.github },
          { name: "Twitter", icon: Twitter, color: "text-sky-400", connected: !!formData.twitter },
        ].map((social) => (
          <div key={social.name} className="flex items-center justify-between py-4 border-b border-slate-800 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center ${social.color}`}>
                <social.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white font-medium">{social.name}</p>
                <p className="text-sm text-slate-500">
                  {social.connected ? "Connected" : "Not Connected"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("basic")}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              {social.connected ? "Update" : "Connect"}
            </button>
          </div>
        ))}
      </div>

      {/* Delete Account */}
      <div className="bg-slate-900 rounded-2xl border border-red-900/30 p-6">
        <h2 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h2>
        <p className="text-sm text-slate-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 border border-red-600 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-sm font-medium transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default AccountTab;
