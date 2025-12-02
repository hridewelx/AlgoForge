import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import crypto from "crypto";

const FRONTEND_URL = process.env.FRONTEND_URL;

// Generate a random username for OAuth users
const generateUsername = (name, email) => {
  const baseName = name?.split(" ")[0]?.toLowerCase() || email.split("@")[0];
  const randomSuffix = crypto.randomBytes(3).toString("hex");
  return `${baseName}_${randomSuffix}`.slice(0, 20);
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role, emailId: user.emailId },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1hr" }
  );
};

// GOOGLE OAuth
export const googleAuth = async (req, res) => {
  try {
    const state = crypto.randomBytes(16).toString("hex");
    
    // Store state in cookie for CSRF protection
    res.cookie("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
    });

    const params = new URLSearchParams({
      client_id: process.env.Google_Auth_Client_Id,
      redirect_uri: process.env.Google_CALLBACK_URL,
      response_type: "code",
      scope: "openid email profile",
      state: state,
      access_type: "offline",
      prompt: "consent",
    });

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.redirect(authUrl);
  } catch (error) {
    console.error("Google auth initialization error:", error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_init_error`);
  }
};

export const googleCallback = async (req, res) => {
  const { code, state, error: oauthError } = req.query;
  const storedState = req.cookies.google_oauth_state;

  // Clear state cookie
  res.clearCookie("google_oauth_state");

  try {
    // Handle user cancellation or denial
    if (oauthError) {
      console.log("Google OAuth error/cancel:", oauthError);
      return res.redirect(`${FRONTEND_URL}/login`);
    }

    // Validate state for CSRF protection
    if (!state || !storedState || state !== storedState) {
      console.error("State mismatch:", { state, storedState });
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_code`);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.Google_Auth_Client_Id,
        client_secret: process.env.Google_Auth_Client_Secret,
        redirect_uri: process.env.Google_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      console.error("Google token error:", tokens);
      return res.redirect(`${FRONTEND_URL}/login?error=token_error`);
    }

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    );

    const googleUser = await userInfoResponse.json();

    if (!googleUser.email) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_email`);
    }

    // Find or create user
    let user = await User.findOne({
      $or: [
        { emailId: googleUser.email.toLowerCase() },
        { secondaryEmails: googleUser.email.toLowerCase() },
        { "providers.providerId": googleUser.id, "providers.name": "google" },
      ],
    });

    if (user) {
      const hasGoogleProvider = user.providers?.some((p) => p.name === "google");
      if (!hasGoogleProvider) {
        user.providers = user.providers || [];
        user.providers.push({ name: "google", providerId: googleUser.id });
        if (!user.avatar && googleUser.picture) {
          user.avatar = googleUser.picture;
        }
        await user.save();
      }
    } else {
      const username = generateUsername(googleUser.name, googleUser.email);
      user = await User.create({
        firstName: googleUser.given_name || googleUser.name?.split(" ")[0] || "User",
        lastName: googleUser.family_name || googleUser.name?.split(" ").slice(1).join(" ") || "",
        emailId: googleUser.email.toLowerCase(),
        username,
        password: crypto.randomBytes(32).toString("hex"),
        role: "user",
        avatar: googleUser.picture || "",
        providers: [{ name: "google", providerId: googleUser.id }],
      });
    }

    // Generate JWT and set cookie
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.redirect(`${FRONTEND_URL}/oauth/callback?success=true`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_error`);
  }
};

// GITHUB OAuth
export const githubAuth = async (req, res) => {
  try {
    const state = crypto.randomBytes(16).toString("hex");

    // Store state in cookie for CSRF protection
    res.cookie("github_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "lax",
    });

    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: "user:email read:user",
      state: state,
    });

    const authUrl = `https://github.com/login/oauth/authorize?${params.toString()}`;
    res.redirect(authUrl);
  } catch (error) {
    console.error("GitHub auth initialization error:", error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_init_error`);
  }
};

export const githubCallback = async (req, res) => {
  const { code, state, error: oauthError } = req.query;
  const storedState = req.cookies.github_oauth_state;

  // Clear state cookie
  res.clearCookie("github_oauth_state");

  try {
    // Handle user cancellation or denial
    if (oauthError) {
      console.log("GitHub OAuth error/cancel:", oauthError);
      return res.redirect(`${FRONTEND_URL}/login`);
    }

    // Validate state for CSRF protection
    if (!state || !storedState || state !== storedState) {
      console.error("State mismatch:", { state, storedState });
      return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_code`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) {
      console.error("GitHub token error:", tokens);
      return res.redirect(`${FRONTEND_URL}/login?error=token_error`);
    }

    // Get user info from GitHub
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const githubUser = await userResponse.json();

    // Get user's email (might be private)
    let email = githubUser.email;

    if (!email) {
      const emailsResponse = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      const emails = await emailsResponse.json();
      const primaryEmail = emails.find((e) => e.primary && e.verified);
      email = primaryEmail?.email || emails[0]?.email;
    }

    if (!email) {
      return res.redirect(`${FRONTEND_URL}/login?error=no_email`);
    }

    // Find or create user
    let user = await User.findOne({
      $or: [
        { emailId: email.toLowerCase() },
        { secondaryEmails: email.toLowerCase() },
        { "providers.providerId": String(githubUser.id), "providers.name": "github" },
      ],
    });

    if (user) {
      const hasGithubProvider = user.providers?.some((p) => p.name === "github");
      if (!hasGithubProvider) {
        user.providers = user.providers || [];
        user.providers.push({ name: "github", providerId: String(githubUser.id) });
        if (!user.github && githubUser.html_url) {
          user.github = githubUser.html_url;
        }
        if (!user.avatar && githubUser.avatar_url) {
          user.avatar = githubUser.avatar_url;
        }
        await user.save();
      }
    } else {
      const nameParts = (githubUser.name || githubUser.login).split(" ");
      const username = generateUsername(githubUser.login || githubUser.name, email);

      user = await User.create({
        firstName: nameParts[0] || "User",
        lastName: nameParts.slice(1).join(" ") || "",
        emailId: email.toLowerCase(),
        username,
        password: crypto.randomBytes(32).toString("hex"),
        role: "user",
        avatar: githubUser.avatar_url || "",
        github: githubUser.html_url || "",
        providers: [{ name: "github", providerId: String(githubUser.id) }],
      });
    }

    // Generate JWT and set cookie
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.redirect(`${FRONTEND_URL}/oauth/callback?success=true`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.redirect(`${FRONTEND_URL}/login?error=oauth_error`);
  }
};
