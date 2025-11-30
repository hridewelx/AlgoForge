import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axiosClient from "../utilities/axiosClient";
import { toast, Toaster } from "react-hot-toast";
import { userLogout, setAvatar as setGlobalAvatar } from "../authenticationSlicer";
import Navbar from "../components/UI/Navbar";
import { useTheme } from "../contexts/ThemeContext";
import {
  BasicInfoTab,
  AccountTab,
  PrivacyTab,
  DeleteAccountModal,
  SettingsSidebar,
} from "../components/ProfileSettings";

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { username } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useSelector((state) => state.authentication);
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Basic Info form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    location: "",
    birthday: "",
    summary: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
  });

  // Account form data
  const [accountData, setAccountData] = useState({
    username: "",
    email: "",
  });

  // Secondary emails
  const [secondaryEmails, setSecondaryEmails] = useState([]);

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Edit modes
  const [editingUsername, setEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState("");

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Avatar
  const [avatar, setAvatar] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Wait for auth check to complete before making decisions
    if (authLoading) return;
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // Only allow editing own profile
    if (user && username && user.username !== username) {
      navigate(`/algoforge/profile/${username}`);
      return;
    }
    fetchProfile();
  }, [authLoading, isAuthenticated, navigate, user, username]);

  const fetchProfile = async () => {
    try {
      const response = await axiosClient.get("/profile/getprofile");
      const userData = response.data.user;

      // Format date for input field (YYYY-MM-DD)
      let formattedDate = "";
      if (userData.birthday) {
        const date = new Date(userData.birthday);
        formattedDate = date.toISOString().split("T")[0];
      }

      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        gender: userData.gender || "",
        location: userData.location || "",
        birthday: formattedDate,
        summary: userData.summary || "",
        website: userData.website || "",
        github: userData.github || "",
        linkedin: userData.linkedin || "",
        twitter: userData.twitter || "",
      });

      setAccountData({
        username: userData.username || "",
        email: userData.email || "",
      });
      setSecondaryEmails(userData.secondaryEmails || []);
      setTempUsername(userData.username || "");
      setAvatar(userData.avatar || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Avatar upload
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await axiosClient.post("/profile/uploadavatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatar(response.data.avatar);
      // Update global Redux state so Navbar reflects the change
      dispatch(setGlobalAvatar(response.data.avatar));
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Avatar remove
  const handleRemoveAvatar = async () => {
    if (!avatar) return;

    setUploadingAvatar(true);
    try {
      await axiosClient.delete("/profile/removeavatar");
      setAvatar("");
      // Update global Redux state so Navbar reflects the change
      dispatch(setGlobalAvatar(""));
      toast.success("Profile picture removed");
    } catch (error) {
      console.error("Error removing avatar:", error);
      toast.error(error.response?.data?.message || "Failed to remove image");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosClient.put("/profile/updateprofile", formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Username update
  const handleUpdateUsername = async () => {
    if (!tempUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (tempUsername === accountData.username) {
      setEditingUsername(false);
      return;
    }
    try {
      await axiosClient.put("/profile/updateprofile", { username: tempUsername });
      setAccountData((prev) => ({ ...prev, username: tempUsername }));
      setEditingUsername(false);
      toast.success("Username updated successfully");
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error(error.response?.data?.message || "Failed to update username");
    }
  };

  // Add secondary email
  const handleAddSecondaryEmail = async (email) => {
    try {
      const response = await axiosClient.post("/profile/email/add", { email });
      setSecondaryEmails(response.data.secondaryEmails);
      toast.success("Email added successfully");
    } catch (error) {
      console.error("Error adding email:", error);
      throw new Error(error.response?.data?.message || "Failed to add email");
    }
  };

  // Remove secondary email
  const handleRemoveSecondaryEmail = async (email) => {
    try {
      const response = await axiosClient.delete("/profile/email/remove", { data: { email } });
      setSecondaryEmails(response.data.secondaryEmails);
      toast.success("Email removed successfully");
    } catch (error) {
      console.error("Error removing email:", error);
      toast.error(error.response?.data?.message || "Failed to remove email");
    }
  };

  // Change primary email
  const handleChangePrimaryEmail = async (newPrimaryEmail) => {
    try {
      const response = await axiosClient.put("/profile/email/changeprimary", { newPrimaryEmail });
      setAccountData((prev) => ({ ...prev, email: response.data.email }));
      setSecondaryEmails(response.data.secondaryEmails);
      toast.success("Primary email changed successfully");
    } catch (error) {
      console.error("Error changing primary email:", error);
      toast.error(error.response?.data?.message || "Failed to change primary email");
    }
  };

  // Password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    // Frontend check: prevent same password
    if (passwordData.newPassword === passwordData.currentPassword) {
      toast.error("New password must be different from current password");
      return;
    }
    setChangingPassword(true);
    try {
      await axiosClient.put("/profile/changepassword", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error('Please type "DELETE" to confirm');
      return;
    }
    setDeleting(true);
    try {
      await axiosClient.delete("/profile/deleteaccount");
      toast.success("Account deleted successfully");
      dispatch(userLogout());
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    dispatch(userLogout());
    navigate("/");
  };

  // Show loading while auth is being checked
  if (authLoading || loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-100'} flex items-center justify-center`}>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Navbar */}
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Account Settings</h1>
          <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} mt-1`}>Manage your profile and preferences</p>
        </div>
        
        <div className="flex gap-8">
          {/* Sidebar */}
          <SettingsSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleLogout={handleLogout}
            isDark={isDark}
          />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <BasicInfoTab
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                saving={saving}
                avatar={avatar}
                uploadingAvatar={uploadingAvatar}
                handleAvatarUpload={handleAvatarUpload}
                handleRemoveAvatar={handleRemoveAvatar}
                fileInputRef={fileInputRef}
                isDark={isDark}
              />
            )}

            {/* Account Tab */}
            {activeTab === "account" && (
              <AccountTab
                accountData={accountData}
                editingUsername={editingUsername}
                setEditingUsername={setEditingUsername}
                tempUsername={tempUsername}
                setTempUsername={setTempUsername}
                handleUpdateUsername={handleUpdateUsername}
                showPasswordForm={showPasswordForm}
                setShowPasswordForm={setShowPasswordForm}
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                showPasswords={showPasswords}
                setShowPasswords={setShowPasswords}
                handlePasswordChange={handlePasswordChange}
                changingPassword={changingPassword}
                formData={formData}
                setActiveTab={setActiveTab}
                setShowDeleteModal={setShowDeleteModal}
                secondaryEmails={secondaryEmails}
                handleAddSecondaryEmail={handleAddSecondaryEmail}
                handleRemoveSecondaryEmail={handleRemoveSecondaryEmail}
                handleChangePrimaryEmail={handleChangePrimaryEmail}
                isDark={isDark}
              />
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && <PrivacyTab isDark={isDark} />}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        deleteConfirmText={deleteConfirmText}
        setDeleteConfirmText={setDeleteConfirmText}
        handleDeleteAccount={handleDeleteAccount}
        deleting={deleting}
        isDark={isDark}
      />
    </div>
  );
};

export default Settings;
