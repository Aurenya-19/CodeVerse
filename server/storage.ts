import type { Express, Request } from "express";
import {
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Arena,
  type Challenge,
  type UserChallenge,
  type Project,
  type Clan,
  type ClanMember,
  type Quest,
  type UserQuest,
  type Course,
  type UserCourse,
  type Message,
  type InsertMessage,
  type FeedItem,
  type Roadmap,
  type UserRoadmap,
  type AiChat,
  type UserAvatar,
  type InsertAvatar,
  type CodeFusion,
  type InsertCodeFusion,
  type SolutionSubmission,
  type LearningReport,
  type PrivateGroup,
  type GroupMember,
  type GroupMessage,
  type AdvancedChallenge,
  type CommunityBadge,
  type UserBadge,
  type AiRecommendation,
  users,
  userProfiles,
  arenas,
  challenges,
  userChallenges,
  projects,
  clans,
  clanMembers,
  quests,
  userQuests,
  courses,
  userCourses,
  messages,
  feedItems,
  roadmaps,
  userRoadmaps,
  aiChats,
  userAvatars,
  codeFusions,
  solutionSubmissions,
  learningReports,
  privateGroups,
  groupMembers,
  groupMessages,
  advancedChallenges,
  communityBadges,
  userBadges,
  aiCommunityRecommendations,
  competitions,
  competitionParticipants,
  competitionLeaderboard,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, like, sql, inArray } from "drizzle-orm";
import { queryCache, queryBatcher } from "./queryOptimization";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserProfile(user_id: string): Promise<UserProfile | undefined>;
  upsertUserProfile(profile: InsertUserProfile & { user_id: string }): Promise<UserProfile>;
  getArenas(limit?: number): Promise<Arena[]>;
  getArenaBySlug(slug: string): Promise<Arena | undefined>;
  getChallengesByArena(arenaId: string, limit?: number): Promise<Challenge[]>;
  getChallengeById(id: string): Promise<Challenge | undefined>;
  getQuests(limit?: number): Promise<Quest[]>;
  getQuestsByArena(arenaId: string): Promise<Quest[]>;
  getCourses(limit?: number): Promise<Course[]>;
  getCompetitions(limit?: number): Promise<any[]>;
  getCompetition(id: string): Promise<any>;
  joinCompetition(competitionId: string, user_id: string): Promise<any>;
  submitCompetitionSolution(data: any): Promise<any>;
  getCompetitionLeaderboard(competitionId: string): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existing = await this.getUserByEmail(user.email!);
    if (existing) return existing;
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getUserProfile(user_id: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(profile: InsertUserProfile & { user_id: string }): Promise<UserProfile> {
    const existing = await this.getUserProfile(profile.userId);
    if (existing) {
      const [updated] = await db
        .update(userProfiles)
        .set(profile)
        .where(eq(userProfiles.userId, profile.userId))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userProfiles).values(profile).returning();
    return created;
  }

  async getArenas(limit = 20): Promise<Arena[]> {
    return db.select().from(arenas).limit(limit).orderBy(desc(arenas.activeUsers));
  }

  async getArenaBySlug(slug: string): Promise<Arena | undefined> {
    const [arena] = await db.select().from(arenas).where(eq(arenas.slug, slug));
    return arena;
  }

  async getChallengesByArena(arenaId: string, limit = 20): Promise<Challenge[]> {
    return db.select().from(challenges).where(eq(challenges.arenaId, arenaId)).limit(limit);
  }

  async getChallengeById(id: string): Promise<Challenge | undefined> {
    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, id));
    return challenge;
  }

  async getQuests(limit = 20): Promise<Quest[]> {
    return db.select().from(quests).limit(limit).orderBy(desc(quests.createdAt));
  }

  async getQuestsByArena(arenaId: string): Promise<Quest[]> {
    return db.select().from(quests).where(eq(quests.type, arenaId)).limit(20);
  }

  async getCourses(limit = 20): Promise<Course[]> {
    return db.select().from(courses).limit(limit);
  }

  async getCompetitions(limit = 20): Promise<any[]> {
    return db.select().from(competitions).limit(limit).orderBy(desc(competitions.createdAt));
  }

  async getCompetition(id: string): Promise<any> {
    const [comp] = await db.select().from(competitions).where(eq(competitions.id, id));
    return comp;
  }

  async joinCompetition(competitionId: string, user_id: string): Promise<any> {
    const [participant] = await db.insert(competitionParticipants).values({ competitionId, userId }).returning();
    return participant;
  }

  async submitCompetitionSolution(data: any): Promise<any> {
    const [submission] = await db.insert(competitionLeaderboard).values({
      competitionId: data.competitionId,
      user_id: data.userId,
      score: 0
    }).returning();
    return submission;
  }

  async getCompetitionLeaderboard(competitionId: string): Promise<any[]> {
    return db.select().from(competitionLeaderboard).where(eq(competitionLeaderboard.competitionId, competitionId)).orderBy(asc(competitionLeaderboard.rank)).limit(100);
  }

  // STUB IMPLEMENTATIONS - kept from original for API compatibility
  async createClan(clan: any): Promise<Clan> {
    const [created] = await db.insert(clans).values(clan).returning();
    return created;
  }

  async createChallenge(challenge: any): Promise<Challenge> {
    const [created] = await db.insert(challenges).values(challenge).returning();
    return created;
  }

  async createProject(project: any): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async createQuest(quest: any): Promise<Quest> {
    const [created] = await db.insert(quests).values(quest).returning();
    return created;
  }

  async createCourse(course: any): Promise<Course> {
    const [created] = await db.insert(courses).values(course).returning();
    return created;
  }

  async createMessage(msg: InsertMessage): Promise<Message> {
    const [created] = await db.insert(messages).values(msg).returning();
    return created;
  }

  async createRoadmap(roadmap: any): Promise<Roadmap> {
    const [created] = await db.insert(roadmaps).values(roadmap).returning();
    return created;
  }

  async deleteClan(id: string): Promise<boolean> {
    await db.delete(clans).where(eq(clans.id, id));
    return true;
  }

  async getChallenges(limit = 20): Promise<Challenge[]> {
    return db.select().from(challenges).limit(limit);
  }

  async getClanById(id: string): Promise<Clan | undefined> {
    const [clan] = await db.select().from(clans).where(eq(clans.id, id));
    return clan;
  }

  async getClanMembers(clanId: string): Promise<ClanMember[]> {
    return db.select().from(clanMembers).where(eq(clanMembers.clanId, clanId));
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getFeedItems(limit = 50): Promise<FeedItem[]> {
    return db.select().from(feedItems).limit(limit).orderBy(desc(feedItems.createdAt));
  }

  async getFeedItemsByUserId(user_id: string, limit = 20): Promise<FeedItem[]> {
    return db.select().from(feedItems).where(eq(feedItems.userId, userId)).limit(limit).orderBy(desc(feedItems.createdAt));
  }

  async getMessages(user_id: string, limit = 50): Promise<Message[]> {
    return db.select().from(messages).where(or(eq(messages.recipientId, userId), eq(messages.senderId, userId))).limit(limit).orderBy(desc(messages.createdAt));
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getQuestById(id: string): Promise<Quest | undefined> {
    const [quest] = await db.select().from(quests).where(eq(quests.id, id));
    return quest;
  }

  async getPublicCodeFusions(limit = 50): Promise<CodeFusion[]> {
    return db.select().from(codeFusions).where(eq(codeFusions.isPublic, true)).limit(limit).orderBy(desc(codeFusions.createdAt));
  }

  async getRoadmaps(limit = 20): Promise<Roadmap[]> {
    return db.select().from(roadmaps).limit(limit);
  }

  async getUserAvatar(user_id: string): Promise<UserAvatar | undefined> {
    const [avatar] = await db.select().from(userAvatars).where(eq(userAvatars.userId, userId));
    return avatar;
  }

  async getUserChallenges(user_id: string, limit = 50): Promise<UserChallenge[]> {
    return db.select().from(userChallenges).where(eq(userChallenges.userId, userId)).limit(limit);
  }

  async getUserClans(user_id: string): Promise<Clan[]> {
    const clans_list = await db.select().from(clans).innerJoin(clanMembers, eq(clans.id, clanMembers.clanId)).where(eq(clanMembers.userId, userId));
    return clans_list.map(c => c.clans);
  }

  async getUserCodeFusions(user_id: string, limit = 50): Promise<CodeFusion[]> {
    return db.select().from(codeFusions).where(eq(codeFusions.userId, userId)).limit(limit);
  }

  async getUserCourses(user_id: string, limit = 50): Promise<UserCourse[]> {
    return db.select().from(userCourses).where(eq(userCourses.userId, userId)).limit(limit);
  }

  async getUserProjects(user_id: string, limit = 50): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.userId, userId)).limit(limit);
  }

  async getUserQuests(user_id: string, limit = 50): Promise<UserQuest[]> {
    return db.select().from(userQuests).where(eq(userQuests.userId, userId)).limit(limit);
  }

  async getUserRoadmaps(user_id: string, limit = 20): Promise<UserRoadmap[]> {
    return db.select().from(userRoadmaps).where(eq(userRoadmaps.userId, userId)).limit(limit);
  }

  async joinClan(clanId: string, user_id: string): Promise<ClanMember> {
    const [member] = await db.insert(clanMembers).values({ clanId, userId, role: "member" }).returning();
    return member;
  }

  async markMessagesRead(user_id: string, messageIds: string[]): Promise<boolean> {
    await db.update(messages).set({ isRead: true }).where(and(eq(messages.recipientId, userId), inArray(messages.id, messageIds)));
    return true;
  }

  async publishCodeFusion(id: string): Promise<CodeFusion> {
    const [updated] = await db.update(codeFusions).set({ isPublic: true }).where(eq(codeFusions.id, id)).returning();
    return updated;
  }

  async startChallenge(user_id: string, challengeId: string): Promise<UserChallenge> {
    const [uc] = await db.insert(userChallenges).values({ userId, challengeId, status: "in_progress" } as any).returning();
    return uc;
  }

  async startCourse(user_id: string, courseId: string): Promise<UserCourse> {
    const [uc] = await db.insert(userCourses).values({ userId, courseId, status: "in_progress" } as any).returning();
    return uc;
  }

  async startQuest(user_id: string, questId: string): Promise<UserQuest> {
    const [uq] = await db.insert(userQuests).values({ userId, questId, status: "assigned" } as any).returning();
    return uq;
  }

  async startRoadmap(user_id: string, roadmapId: string): Promise<UserRoadmap> {
    const [ur] = await db.insert(userRoadmaps).values({ userId, roadmapId, currentMilestone: 0 } as any).returning();
    return ur;
  }

  async submitChallenge(user_id: string, challengeId: string, code: string, score: number): Promise<UserChallenge> {
    const [uc] = await db.update(userChallenges).set({ status: score >= 70 ? "completed" : "in_progress", submittedCode: code, score }).where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId))).returning();
    return uc;
  }

  async updateAvatar(user_id: string, avatar: any): Promise<UserAvatar> {
    const existing = await this.getUserAvatar(userId);
    if (existing) {
      const [updated] = await db.update(userAvatars).set(avatar).where(eq(userAvatars.userId, userId)).returning();
      return updated;
    }
    const [created] = await db.insert(userAvatars).values({ ...avatar, userId }).returning();
    return created;
  }

  async updateCodeFusion(id: string, fusion: any): Promise<CodeFusion> {
    const [updated] = await db.update(codeFusions).set(fusion).where(eq(codeFusions.id, id)).returning();
    return updated;
  }

  async updateUserProfile(user_id: string, profile: any): Promise<UserProfile> {
    const [updated] = await db.update(userProfiles).set(profile).where(eq(userProfiles.userId, userId)).returning();
    return updated;
  }

  async createCodeFusion(fusion: any): Promise<CodeFusion> {
    const [created] = await db.insert(codeFusions).values(fusion).returning();
    return created;
  }

  async getCodeFusionById(id: string): Promise<CodeFusion | undefined> {
    const [fusion] = await db.select().from(codeFusions).where(eq(codeFusions.id, id));
    return fusion;
  }

  async submitSolution(data: any): Promise<SolutionSubmission> {
    const [sub] = await db.insert(solutionSubmissions).values(data).returning();
    return sub;
  }

  async getLearningReport(user_id: string): Promise<LearningReport | undefined> {
    const [report] = await db.select().from(learningReports).where(eq(learningReports.userId, userId));
    return report;
  }

  async createGroup(group: any): Promise<PrivateGroup> {
    const [created] = await db.insert(privateGroups).values(group).returning();
    return created;
  }

  async getGroupById(id: string): Promise<PrivateGroup | undefined> {
    const [group] = await db.select().from(privateGroups).where(eq(privateGroups.id, id));
    return group;
  }

  async joinGroup(groupId: string, user_id: string): Promise<GroupMember> {
    const [member] = await db.insert(groupMembers).values({ groupId, userId, role: "member" }).returning();
    return member;
  }

  async getGroupMessages(groupId: string, limit = 50): Promise<GroupMessage[]> {
    return db.select().from(groupMessages).where(eq(groupMessages.groupId, groupId)).limit(limit).orderBy(desc(groupMessages.createdAt));
  }

  async createGroupMessage(groupId: string, user_id: string, content: string): Promise<GroupMessage> {
    const [msg] = await db.insert(groupMessages).values({ groupId, userId, content }).returning();
    return msg;
  }

  async getAdvancedChallenges(arenaId?: string, limit = 20): Promise<AdvancedChallenge[]> {
    if (arenaId) return db.select().from(advancedChallenges).where(eq(advancedChallenges.arenaId, arenaId)).limit(limit);
    return db.select().from(advancedChallenges).limit(limit);
  }

  async getUserBadges(user_id: string): Promise<UserBadge[]> {
    return db.select().from(userBadges).where(eq(userBadges.userId, userId));
  }

  async awardBadge(user_id: string, badgeId: string): Promise<UserBadge | undefined> {
    const [badge] = await db.insert(userBadges).values({ userId, badgeId }).onConflictDoNothing().returning();
    return badge;
  }

  async getSolutionSubmissions(user_id: string, limit = 50): Promise<SolutionSubmission[]> {
    return db.select().from(solutionSubmissions).where(eq(solutionSubmissions.userId, userId)).limit(limit);
  }

  async getDailyChallenges(limit = 10): Promise<Challenge[]> {
    return db.select().from(challenges).limit(limit).orderBy(desc(challenges.createdAt));
  }
}

export const storage = new DatabaseStorage();

  // ===== MISSING METHODS - STUB IMPLEMENTATIONS =====
  async addXp(user_id: string, amount: number): Promise<void> {
    const profile = await this.getUserProfile(userId);
    if (profile) {
      const currentXp = (profile.xp || 0) + amount;
      const currentLevel = Math.floor(currentXp / 500) + 1;
      await db.update(userProfiles)
        .set({ xp: currentXp, level: currentLevel })
        .where(eq(userProfiles.userId, userId));
    }
  }

  async getProjects(limit?: number): Promise<any[]> {
    return db.select().from(projects).limit(limit || 10);
  }

  async getClans(limit?: number): Promise<any[]> {
    return db.select().from(clans).limit(limit || 10);
  }

  async assignQuest(user_id: string, questId: string): Promise<any> {
    return db.insert(userQuests).values({ userId, questId }).returning();
  }

  async getConversations(user_id: string): Promise<any[]> {
    return db.select().from(aiChats).where(eq(aiChats.userId, userId));
  }

  async sendMessage(senderId: string, receiver_id: string, content: string): Promise<any> {
    return db.insert(messages).values({ senderId, receiverId, content }).returning();
  }

  async getLeaderboard(limit?: number): Promise<any[]> {
    return db.select()
      .from(userProfiles)
      .orderBy(desc(userProfiles.xp))
      .limit(limit || 100);
  }

  async getMetaverseLeaderboard(limit?: number): Promise<any[]> {
    return db.select()
      .from(userProfiles)
      .orderBy(desc(userProfiles.xp))
      .limit(limit || 50);
  }

  async deleteCodeFusion(id: string): Promise<void> {
    await db.delete(codeFusions).where(eq(codeFusions.id, id));
  }

  async getGroupRecommendations(user_id: string): Promise<any[]> {
    return db.select().from(privateGroups).limit(5);
  }

  async updateUser(id: string, data: any): Promise<any> {
    const [updated] = await db.update(users).set(data).where(eq(users.id, id)).returning();
    return updated;
  }

  async updateUserProfile(user_id: string, data: any): Promise<any> {
    const existing = await this.getUserProfile(userId);
    if (existing) {
      const [updated] = await db.update(userProfiles).set(data).where(eq(userProfiles.userId, userId)).returning();
      return updated;
    }
    const [created] = await db.insert(userProfiles).values({ ...data, userId }).returning();
    return created;
  }

