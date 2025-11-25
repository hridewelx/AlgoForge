import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../utilities/axiosClient";
import axios from "axios";
import { toast } from "react-hot-toast";
import Editor from "@monaco-editor/react";

const EditorialManagement = () => {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.authentication);
  const isAdmin = user?.role === "admin";
  const fileInputRef = useRef(null);

  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [approaches, setApproaches] = useState([]);
  const [expandedApproach, setExpandedApproach] = useState(null);
  
  // Video upload state
  const [videoFile, setVideoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [existingVideos, setExistingVideos] = useState([]);

  const languages = [
    { value: "python", label: "Python", icon: "🐍" },
    { value: "javascript", label: "JavaScript", icon: "📜" },
    { value: "java", label: "Java", icon: "☕" },
    { value: "cpp", label: "C++", icon: "⚡" },
    { value: "c", label: "C", icon: "🔧" },
  ];

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      toast.error("Admin access required");
      navigate("/admin");
      return;
    }
    if (problemId) {
      fetchProblemData();
    }
  }, [isAuthenticated, isAdmin, navigate, problemId]);

  const fetchProblemData = async () => {
    try {
      setIsLoading(true);
      const [problemRes, editorialRes] = await Promise.all([
        axiosClient.get(`/problems/problemfetchbyid/${problemId}`),
        axiosClient.get(`/editorial/fetch/${problemId}`)
      ]);

      const problemData = problemRes.data.problem;
      setProblem(problemData);

      // Get editorial data (single document structure)
      const editorial = editorialRes.data.editorial || { videos: [], approaches: [] };
      
      // Set videos
      setExistingVideos(editorial.videos || []);
      
      // Transform approaches to match frontend structure
      const transformedApproaches = (editorial.approaches || []).map(approach => ({
        ...approach,
        _id: approach._id,
        solutions: approach.solutions.reduce((acc, sol) => {
          acc[sol.language] = sol.code;
          return acc;
        }, {}),
        editorialIds: {}, // Not needed anymore with new structure
        textEditorialId: null // Not needed anymore
      }));
      
      setApproaches(transformedApproaches);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load problem data");
    } finally {
      setIsLoading(false);
    }
  };



  const addNewApproach = () => {
    const newApproach = {
      name: "",
      description: "",
      timeComplexity: "",
      spaceComplexity: "",
      videoUrl: null,
      videoId: null,
      explanation: "",
      solutions: {},
      editorialIds: {},
      isNew: true
    };
    setApproaches([...approaches, newApproach]);
    setExpandedApproach(approaches.length);
  };

  const updateApproach = (index, field, value) => {
    const updated = [...approaches];
    updated[index][field] = value;
    setApproaches(updated);
  };

  const updateSolution = (index, language, code) => {
    const updated = [...approaches];
    updated[index].solutions[language] = code;
    setApproaches(updated);
  };

  const loadReferenceSolution = (index, language) => {
    const refSolution = problem?.referenceSolution?.find(s => s.language === language);
    if (refSolution) {
      updateSolution(index, language, refSolution.code);
      toast.success(`Loaded reference ${language} solution`);
    } else {
      toast.error(`No reference solution found for ${language}`);
    }
  };

  const saveApproach = async (index) => {
    const approach = approaches[index];
    
    if (!approach.name.trim()) {
      toast.error("Please enter an approach name");
      return;
    }

    const savingToast = toast.loading("Saving approach...");

    try {
      // Transform solutions object to array format
      const solutions = Object.entries(approach.solutions)
        .filter(([_, code]) => code && code.trim())
        .map(([language, code]) => ({ language, code }));

      const payload = {
        problemId,
        approachId: approach._id, // If updating existing
        name: approach.name,
        description: approach.description || '',
        order: index,
        complexity: {
          time: approach.timeComplexity || '',
          space: approach.spaceComplexity || ''
        },
        explanation: approach.explanation || '',
        solutions
      };

      await axiosClient.post("/editorial/approach/save", payload);

      toast.dismiss(savingToast);
      toast.success("Approach saved successfully! 🎉", {
        duration: 3000,
        icon: "✅"
      });
      fetchProblemData();
    } catch (error) {
      console.error("Error saving approach:", error);
      toast.dismiss(savingToast);
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to save approach";
      toast.error(`Save failed: ${errorMsg}`, {
        duration: 5000
      });
    }
  };

  const deleteApproach = async (index) => {
    const approach = approaches[index];
    
    if (!window.confirm(`Delete "${approach.name}" approach and all its solutions?`)) {
      return;
    }

    try {
      if (approach._id) {
        // Delete from backend if it exists
        await axiosClient.delete(`/editorial/approach/${problemId}/${approach._id}`);
      }
      
      // Remove from local state
      const updated = approaches.filter((_, i) => i !== index);
      setApproaches(updated);
      toast.success("Approach deleted successfully");
    } catch (error) {
      console.error("Error deleting approach:", error);
      toast.error("Failed to delete approach");
    }
  };

  const handleVideoUpload = async (file) => {
      console.log("file too");
    if (!file) return;
    console.log("file");

    // Validate file
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error("Video size must be less than 100MB");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Get Cloudinary signature
      const { data: signatureData } = await axiosClient.get(`/editorial/create/${problemId}`);

      console.log("Signature data received:", signatureData);

      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", signatureData.timestamp);
      formData.append("signature", signatureData.signature);
      formData.append("api_key", signatureData.apiKey);
      formData.append("public_id", signatureData.publicId);

      // Use axios for upload to support progress and better error handling
      const { data: cloudinaryData } = await axios.post(signatureData.cloudinaryUrl, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      // Save video metadata to database using API
      const videoPayload = {
        problemId,
        title: `Video Solution - ${problem.title}`,
        description: "Video editorial",
        publicId: cloudinaryData.public_id,
        secureUrl: cloudinaryData.secure_url,
        duration: cloudinaryData.duration,
        thumbnailUrl: cloudinaryData.thumbnail_url || cloudinaryData.secure_url,
      };

      await axiosClient.post("/editorial/video/add", videoPayload);
      toast.success("Video uploaded successfully!");
      fetchProblemData();
      setVideoFile(null);
    } catch (error) {
      console.error("Error uploading video:", error);
      console.error("Error details:", error.response?.data);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || "Failed to upload video";
      toast.error(`Upload failed: ${errorMessage}`, {
        duration: 5000
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm("Delete this video? It will be permanently removed from Cloudinary.")) return;

    try {
      await axiosClient.delete(`/editorial/video/${problemId}/${videoId}`);
      toast.success("Video deleted successfully from both database and Cloudinary!");
      fetchProblemData();
    } catch (error) {
      console.error("Error deleting video:", error);
      toast.error("Failed to delete video");
    }
  };

  if (!isAuthenticated || !isAdmin) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading editorial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/admin/questions")}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                Editorial Management
              </h1>
              <p className="text-slate-400 mt-1">{problem?.title || "Loading..."}</p>
            </div>
            <button
              onClick={addNewApproach}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Approach
            </button>
          </div>
        </div>

        {/* Video Solution Section */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Video Solution
          </h2>

          {/* Existing Videos */}
          {existingVideos.length > 0 && (
            <div className="space-y-4 mb-6">
              {existingVideos.map((video) => (
                <div key={video._id} className="bg-slate-700/30 rounded-xl p-4 flex items-center gap-4">
                  <div className="w-32 h-20 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    <video
                      src={video.secureUrl}
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{video.title}</h3>
                    <p className="text-sm text-slate-400">
                      {video.duration ? `${Math.floor(video.duration / 60)}:${String(Math.floor(video.duration % 60)).padStart(2, '0')}` : 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={video.secureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-amber-400 hover:bg-slate-700 rounded-lg transition-colors"
                      title="Open video"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete video"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload New Video */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setVideoFile(file);
                }
                e.target.value = null;
              }}
            />
            
            {isUploading ? (
              <div className="bg-slate-700/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-500 border-t-transparent"></div>
                  <span className="text-white font-medium">Uploading video...</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-400 mt-2">{uploadProgress}% complete</p>
              </div>
            ) : videoFile ? (
              <div className="bg-slate-700/30 rounded-xl p-6 flex items-center justify-between border border-slate-600">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800 rounded-lg">
                    <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">{videoFile.name}</p>
                    <p className="text-sm text-slate-400">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setVideoFile(null)}
                    className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleVideoUpload(videoFile)}
                    className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Video
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-slate-600 hover:border-amber-500 rounded-xl text-slate-400 hover:text-amber-400 transition-all duration-200 flex flex-col items-center gap-3 group bg-slate-800/20 hover:bg-slate-800/40"
              >
                <div className="p-4 bg-slate-800 rounded-full group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-8 h-8 text-slate-500 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-medium mb-1 text-lg">Click to upload video</p>
                  <p className="text-sm text-slate-500">MP4, MOV, AVI (max 100MB)</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Solution Articles Section */}
        <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Solution Articles
          </h2>

        {/* Approaches List */}
        {approaches.length === 0 ? (
          <div className="bg-slate-800/30 rounded-2xl border border-slate-700/50 p-12 text-center">
            <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Approaches Yet</h3>
            <p className="text-slate-400 mb-6">Add your first approach (Brute Force, Better, Optimal, etc.)</p>
            <button
              onClick={addNewApproach}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Approach
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {approaches.map((approach, index) => (
              <div
                key={index}
                className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden"
              >
                {/* Approach Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => setExpandedApproach(expandedApproach === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {approach.name || "New Approach"}
                      </h3>
                      {approach.description && (
                        <p className="text-slate-400 text-sm">{approach.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                        {approach.timeComplexity && (
                          <span>Time: {approach.timeComplexity}</span>
                        )}
                        {approach.spaceComplexity && (
                          <span>Space: {approach.spaceComplexity}</span>
                        )}
                        {Object.keys(approach.solutions).length > 0 && (
                          <span>{Object.keys(approach.solutions).length} solution(s)</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteApproach(index);
                        }}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <svg
                        className={`w-6 h-6 text-slate-400 transition-transform duration-200 ${
                          expandedApproach === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedApproach === index && (
                  <div className="border-t border-slate-700/50 p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Approach Name *
                        </label>
                        <input
                          type="text"
                          value={approach.name}
                          onChange={(e) => updateApproach(index, "name", e.target.value)}
                          placeholder="e.g., Brute Force, Optimal, Two Pointers..."
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={approach.description}
                          onChange={(e) => updateApproach(index, "description", e.target.value)}
                          placeholder="Brief description..."
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Time Complexity
                        </label>
                        <input
                          type="text"
                          value={approach.timeComplexity}
                          onChange={(e) => updateApproach(index, "timeComplexity", e.target.value)}
                          placeholder="e.g., O(n log n)"
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                          Space Complexity
                        </label>
                        <input
                          type="text"
                          value={approach.spaceComplexity}
                          onChange={(e) => updateApproach(index, "spaceComplexity", e.target.value)}
                          placeholder="e.g., O(1)"
                          className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                    </div>

                    {/* Explanation */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Explanation
                      </label>
                      <textarea
                        value={approach.explanation}
                        onChange={(e) => updateApproach(index, "explanation", e.target.value)}
                        placeholder="Explain the approach, intuition, and algorithm..."
                        rows={6}
                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 text-white rounded-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none"
                      />
                    </div>

                    {/* Solutions for Each Language */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-3">
                        Code Solutions
                      </label>
                      <div className="space-y-4">
                        {languages.map((lang) => (
                          <div key={lang.value} className="bg-slate-700/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{lang.icon}</span>
                                <span className="text-white font-semibold">{lang.label}</span>
                              </div>
                              <button
                                onClick={() => loadReferenceSolution(index, lang.value)}
                                className="px-3 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                              >
                                Load Reference
                              </button>
                            </div>
                            <div className="border-2 border-slate-600 rounded-lg overflow-hidden">
                              <Editor
                                height="250px"
                                language={lang.value === "cpp" ? "cpp" : lang.value}
                                value={approach.solutions[lang.value] || ""}
                                onChange={(value) => updateSolution(index, lang.value, value || "")}
                                theme="vs-dark"
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 13,
                                  lineNumbers: "on",
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t border-slate-700/50">
                      <button
                        onClick={() => saveApproach(index)}
                        className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Approach
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
        {/* End of Solution Articles Section */}
      </div>
    </div>
  );
};

export default EditorialManagement;
