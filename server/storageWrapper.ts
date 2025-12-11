import { storage } from "./storage";
import type { User, UpsertUser, UserProfile, InsertUserProfile } from "@shared/schema";

/**
 * Wrapper for storage operations with comprehensive error handling
 * Provides graceful degradation when database is unavailable
 */

export class StorageWrapper {
  private handleError(operation: string, error: any): never {
    console.error(`[StorageWrapper] Error in ${operation}:`, error.message);
    
    // Check for Neon endpoint disabled error
    if (error.message?.includes("endpoint") && error.message?.includes("disabled")) {
      throw new Error("Database endpoint is disabled. Please enable it in Neon dashboard.");
    }
    
    // Check for connection errors
    if (error.message?.includes("connect") || error.message?.includes("ECONNREFUSED")) {
      throw new Error("Unable to connect to database. Please check your connection.");
    }
    
    // Re-throw with context
    throw new Error(`Database operation failed: ${error.message}`);
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      return await storage.getUser(id);
    } catch (error: any) {
      this.handleError("getUser", error);
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      return await storage.getUserByEmail(email);
    } catch (error: any) {
      this.handleError("getUserByEmail", error);
    }
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    try {
      return await storage.upsertUser(user);
    } catch (error: any) {
      this.handleError("upsertUser", error);
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    try {
      return await storage.getUserProfile(userId);
    } catch (error: any) {
      this.handleError("getUserProfile", error);
    }
  }

  async upsertUserProfile(profile: InsertUserProfile & { userId: string }): Promise<UserProfile> {
    try {
      return await storage.upsertUserProfile(profile);
    } catch (error: any) {
      this.handleError("upsertUserProfile", error);
    }
  }
}

export const storageWrapper = new StorageWrapper();
