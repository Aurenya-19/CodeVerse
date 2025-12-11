import type { Express } from "express";
import { storage } from "./storage";
import { formatErrorResponse } from "./errorHandler";
import { db } from "./db";
import { users, userProfiles } from "@shared/schema";
import { eq } from "drizzle-orm";

export function registerOnboardingRoutes(app: Express) {
  // Complete onboarding - set pen name and interests
  app.post("/api/complete-onboarding", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { userId, penName, interests } = req.body;

      // Validate inputs
      if (!penName || penName.trim().length < 3) {
        return res.status(400).json({
          error: "Pen name must be at least 3 characters long",
        });
      }

      if (!interests || !Array.isArray(interests) || interests.length === 0) {
        return res.status(400).json({
          error: "Please select at least one interest",
        });
      }

      // Check if pen name is already taken
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.penName, penName.trim()))
        .limit(1);

      if (existingUser.length > 0 && existingUser[0].id !== req.user.id) {
        return res.status(409).json({
          error: "This pen name is already taken. Please choose another one.",
        });
      }

      // Update user with pen name and mark profile setup as completed
      await db
        .update(users)
        .set({
          penName: penName.trim(),
          profileSetupCompleted: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, req.user.id));

      // Get or create user profile
      let profile = await storage.getUserProfile(req.user.id);

      if (!profile) {
        // Create new profile
        profile = await storage.upsertUserProfile({
          userId: req.user.id,
          interests,
          onboardingCompleted: true,
          techTier: "Beginner",
          xp: 0,
          level: 1,
        });
      } else {
        // Update existing profile
        profile = await storage.upsertUserProfile({
          userId: req.user.id,
          interests,
          onboardingCompleted: true,
        });
      }

      res.json({
        success: true,
        message: "Onboarding completed successfully",
        user: {
          id: req.user.id,
          penName: penName.trim(),
          profileSetupCompleted: true,
        },
        profile,
      });
    } catch (error: any) {
      console.error("[Onboarding] Error:", error);
      res.status(500).json(formatErrorResponse(error));
    }
  });

  // Check onboarding status
  app.get("/api/onboarding-status", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, req.user.id))
        .limit(1);

      const profile = await storage.getUserProfile(req.user.id);

      res.json({
        needsOnboarding: !user?.profileSetupCompleted,
        user: {
          id: user?.id,
          email: user?.email,
          penName: user?.penName,
          profileSetupCompleted: user?.profileSetupCompleted,
        },
        profile,
      });
    } catch (error: any) {
      console.error("[Onboarding] Status check error:", error);
      res.status(500).json(formatErrorResponse(error));
    }
  });
}
