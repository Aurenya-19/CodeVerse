import { Router } from "express";
import { storage } from "./storage";
import { formatErrorResponse } from "./errorHandler";

export const profileRouter = Router();

profileRouter.post("/setup", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  
  try {
    const { penName, interests } = req.body;
    
    if (!penName || !penName.trim()) {
      return res.status(400).json({ error: "Pen name is required" });
    }
    
    if (!Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ error: "At least one interest is required" });
    }
    
    // Update user with pen name and profile setup flag
    const updated = await storage.updateUser(req.user.id, {
      penName: penName.trim(),
      profileSetupCompleted: true
    });
    
    // Update or create user profile with interests
    await storage.updateUserProfile(req.user.id, {
      interests: interests
    });
    
    res.json({ 
      success: true, 
      message: "Profile setup completed",
      user: updated 
    });
  } catch (error: any) {
    res.status(400).json(formatErrorResponse(error));
  }
});

profileRouter.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  
  try {
    const profile = await storage.getUserProfile(req.user.id);
    res.json(profile || { userId: req.user.id, interests: [] });
  } catch (error: any) {
    res.status(400).json(formatErrorResponse(error));
  }
});

profileRouter.patch("/interests", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  
  try {
    const { interests } = req.body;
    
    if (!Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({ error: "At least one interest is required" });
    }
    
    const updated = await storage.updateUserProfile(req.user.id, { interests });
    res.json({ success: true, profile: updated });
  } catch (error: any) {
    res.status(400).json(formatErrorResponse(error));
  }
});
