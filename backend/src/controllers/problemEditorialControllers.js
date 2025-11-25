import { v2 as cloudinary } from "cloudinary";
import Problem from "../models/problemSchema.js";
import Editorial from "../models/problemEditorialSchema.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Generate Cloudinary upload signature (unchanged)
const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user._id;

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `algoforge-solutions/${problemId}/${userId}_${timestamp}`;

    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.API_SECRET
    );

    res.json({
      signature,
      timestamp,
      publicId: publicId,
      apiKey: process.env.API_KEY,
      cloudName: process.env.CLOUD_NAME,
      cloudinaryUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/video/upload`,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default'
    });
  } catch (error) {
    console.error("Error generating upload signature:", error);
    res.status(500).json({ error: "Failed to generate upload signature" });
  }
};

// Get editorial for a problem
const getEditorial = async (req, res) => {
  try {
    const { problemId } = req.params;

    let editorial = await Editorial.findOne({ problemId })
      .populate('authorId', 'name email')
      .lean();

    if (!editorial) {
      // Return empty structure if no editorial exists
      return res.json({
        success: true,
        editorial: {
          problemId,
          videos: [],
          approaches: []
        }
      });
    }

    res.json({
      success: true,
      editorial
    });

  } catch (error) {
    console.error('Error fetching editorial:', error);
    res.status(500).json({ error: 'Failed to fetch editorial' });
  }
};

// Save or update entire editorial (video + approaches)
const saveEditorial = async (req, res) => {
  try {
    const { problemId, videos, approaches } = req.body;
    const userId = req.user._id;

    if (!problemId) {
      return res.status(400).json({ error: "Problem ID is required" });
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    // Find existing editorial or create new
    let editorial = await Editorial.findOne({ problemId });

    if (editorial) {
      // Update existing
      if (videos !== undefined) editorial.videos = videos;
      if (approaches !== undefined) editorial.approaches = approaches;
      await editorial.save();
    } else {
      // Create new
      editorial = new Editorial({
        problemId,
        authorId: userId,
        videos: videos || [],
        approaches: approaches || []
      });
      await editorial.save();
    }

    res.status(200).json({
      message: "Editorial saved successfully",
      editorial
    });

  } catch (error) {
    console.error("Error saving editorial:", error);
    res.status(500).json({ error: `Failed to save editorial: ${error.message}` });
  }
};

// Add a video to editorial
const addVideo = async (req, res) => {
  try {
    const { problemId, publicId, secureUrl, duration, thumbnailUrl, title, description } = req.body;
    const userId = req.user._id;

    if (!problemId || !publicId || !secureUrl) {
      return res.status(400).json({ error: "Problem ID, publicId, and secureUrl are required" });
    }

    let editorial = await Editorial.findOne({ problemId });

    if (!editorial) {
      editorial = new Editorial({
        problemId,
        authorId: userId,
        videos: [],
        approaches: []
      });
    }

    editorial.videos.push({
      publicId,
      secureUrl,
      duration: duration || 0,
      thumbnailUrl: thumbnailUrl || secureUrl,
      title: title || 'Video Solution',
      description: description || ''
    });

    await editorial.save();

    res.status(200).json({
      message: "Video added successfully",
      editorial
    });

  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ error: `Failed to add video: ${error.message}` });
  }
};

// Delete a video from editorial
const deleteVideo = async (req, res) => {
  try {
    const { problemId, videoId } = req.params;

    const editorial = await Editorial.findOne({ problemId });

    if (!editorial) {
      return res.status(404).json({ error: 'Editorial not found' });
    }

    const video = editorial.videos.id(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Delete from Cloudinary
    if (video.publicId) {
      try {
        const result = await cloudinary.uploader.destroy(video.publicId, {
          resource_type: 'video',
          invalidate: true
        });
        console.log('Cloudinary deletion result:', result);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion failed:', cloudinaryError);
      }
    }

    // Remove from editorial
    editorial.videos.pull(videoId);
    await editorial.save();

    res.json({ 
      message: 'Video deleted successfully',
      editorial 
    });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

// Add or update an approach
const saveApproach = async (req, res) => {
  try {
    const { problemId, approachId, name, description, order, complexity, explanation, solutions } = req.body;
    const userId = req.user._id;

    if (!problemId || !name) {
      return res.status(400).json({ error: "Problem ID and approach name are required" });
    }

    let editorial = await Editorial.findOne({ problemId });

    if (!editorial) {
      editorial = new Editorial({
        problemId,
        authorId: userId,
        videos: [],
        approaches: []
      });
    }

    if (approachId) {
      // Update existing approach
      const approach = editorial.approaches.id(approachId);
      if (approach) {
        approach.name = name;
        approach.description = description || '';
        approach.order = order !== undefined ? order : approach.order;
        approach.complexity = complexity || approach.complexity;
        approach.explanation = explanation || '';
        approach.solutions = solutions || approach.solutions;
      } else {
        return res.status(404).json({ error: 'Approach not found' });
      }
    } else {
      // Add new approach
      editorial.approaches.push({
        name,
        description: description || '',
        order: order !== undefined ? order : editorial.approaches.length,
        complexity: complexity || { time: '', space: '' },
        explanation: explanation || '',
        solutions: solutions || []
      });
    }

    await editorial.save();

    res.status(200).json({
      message: "Approach saved successfully",
      editorial
    });

  } catch (error) {
    console.error("Error saving approach:", error);
    res.status(500).json({ error: `Failed to save approach: ${error.message}` });
  }
};

// Delete an approach
const deleteApproach = async (req, res) => {
  try {
    const { problemId, approachId } = req.params;

    const editorial = await Editorial.findOne({ problemId });

    if (!editorial) {
      return res.status(404).json({ error: 'Editorial not found' });
    }

    const approach = editorial.approaches.id(approachId);
    if (!approach) {
      return res.status(404).json({ error: 'Approach not found' });
    }

    editorial.approaches.pull(approachId);
    await editorial.save();

    res.json({
      message: 'Approach deleted successfully',
      editorial
    });

  } catch (error) {
    console.error('Error deleting approach:', error);
    res.status(500).json({ error: 'Failed to delete approach' });
  }
};

// Delete entire editorial
const deleteEditorial = async (req, res) => {
  try {
    const { problemId } = req.params;

    const editorial = await Editorial.findOne({ problemId });

    if (!editorial) {
      return res.status(404).json({ error: 'Editorial not found' });
    }

    // Delete all videos from Cloudinary
    for (const video of editorial.videos) {
      if (video.publicId) {
        try {
          await cloudinary.uploader.destroy(video.publicId, {
            resource_type: 'video',
            invalidate: true
          });
        } catch (cloudinaryError) {
          console.error(`Failed to delete video ${video.publicId}:`, cloudinaryError);
        }
      }
    }

    await Editorial.findOneAndDelete({ problemId });

    res.json({ message: 'Editorial deleted successfully' });

  } catch (error) {
    console.error('Error deleting editorial:', error);
    res.status(500).json({ error: 'Failed to delete editorial' });
  }
};

export {
  generateUploadSignature,
  getEditorial,
  saveEditorial,
  addVideo,
  deleteVideo,
  saveApproach,
  deleteApproach,
  deleteEditorial
};
