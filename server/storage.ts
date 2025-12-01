import {
  users,
  userProfiles,
  arenas,
  challenges,
  userChallenges,
  projects,
  projectCollaborators,
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
  leaderboardEntries,
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
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type Arena,
  type Challenge,
  type UserChallenge,
  type Project,
  type InsertProject,
  type Clan,
  type InsertClan,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, like, sql, inArray } from "drizzle-orm";
import { queryCache, queryBatcher } from "./queryOptimization";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  upsertUserProfile(profile: InsertUserProfile & { userId: string }): Promise<UserProfile>;
  getArenas(limit?: number): Promise<Arena[]>;
  getArenaBySlug(slug: string): Promise<Arena | undefined>;
  getChallengesByArena(arenaId: string, limit?: number): Promise<Challenge[]>;
  getChallengeById(id: string): Promise<Challenge | undefined>;
  getQuests(limit?: number): Promise<Quest[]>;
  getQuestsByArena(arenaId: string): Promise<Quest[]>;
  getCourses(limit?: number): Promise<Course[]>;
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

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
    return profile;
  }

  async upsertUserProfile(profile: InsertUserProfile & { userId: string }): Promise<UserProfile> {
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

  // Community operations
  async createGroup(group: any): Promise<PrivateGroup> {
    const [created] = await db.insert(privateGroups).values(group).returning();
    return created;
  }

  async getGroupById(id: string): Promise<PrivateGroup | undefined> {
    const [group] = await db.select().from(privateGroups).where(eq(privateGroups.id, id));
    return group;
  }

  async joinGroup(groupId: string, userId: string): Promise<GroupMember> {
    const [member] = await db.insert(groupMembers).values({ groupId, userId, role: "member" }).returning();
    return member;
  }

  async getGroupMessages(groupId: string, limit = 50): Promise<GroupMessage[]> {
    return db.select().from(groupMessages).where(eq(groupMessages.groupId, groupId)).limit(limit).orderBy(desc(groupMessages.createdAt));
  }

  async createGroupMessage(groupId: string, userId: string, content: string): Promise<GroupMessage> {
    const [msg] = await db.insert(groupMessages).values({ groupId, userId, content }).returning();
    return msg;
  }

  async getAdvancedChallenges(arenaId?: string, limit = 20): Promise<AdvancedChallenge[]> {
    if (arenaId) return db.select().from(advancedChallenges).where(eq(advancedChallenges.arenaId, arenaId)).limit(limit);
    return db.select().from(advancedChallenges).limit(limit);
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    return db.select().from(userBadges).where(eq(userBadges.userId, userId));
  }

  async awardBadge(userId: string, badgeId: string): Promise<UserBadge | undefined> {
    const [badge] = await db.insert(userBadges).values({ userId, badgeId }).onConflictDoNothing().returning();
    return badge;
  }

  async getSolutionSubmissions(userId: string, limit = 50): Promise<SolutionSubmission[]> {
    return db.select().from(solutionSubmissions).where(eq(solutionSubmissions.userId, userId)).limit(limit);
  }

  async submitSolution(submission: any): Promise<SolutionSubmission> {
    const [created] = await db.insert(solutionSubmissions).values(submission).returning();
    return created;
  }

  async getMonthlyReport(userId: string, month: string): Promise<LearningReport | undefined> {
    const [report] = await db.select().from(learningReports)
      .where(and(eq(learningReports.userId, userId), eq(learningReports.month, month)));
    return report;
  }

  async createMonthlyReport(report: any): Promise<LearningReport> {
    const [created] = await db.insert(learningReports).values(report).returning();
    return created;
  }

  async getGroupRecommendations(userId: string, limit = 5): Promise<AiRecommendation[]> {
    return db.select().from(aiCommunityRecommendations)
      .where(eq(aiCommunityRecommendations.userId, userId))
      .limit(limit)
      .orderBy(desc(aiCommunityRecommendations.matchScore));
  }

  // MISSING METHODS - Adding stubs for all routes that call them
  async addXp(userId: string, xp: number): Promise<UserProfile | undefined> {
    const profile = await this.getUserProfile(userId);
    if (!profile) return undefined;
    const newXp = (profile.xp || 0) + xp;
    return this.upsertUserProfile({ 
      userId, 
      xp: newXp,
      level: Math.floor(newXp / 1000) + 1
    } as any);
  }

  async assignQuest(userId: string, questId: string, target: number = 1): Promise<UserQuest> {
    const [quest] = await db.insert(userQuests).values({ userId, questId, progress: 0, isCompleted: false, target }).returning();
    return quest;
  }

  async createAvatar(avatar: any): Promise<UserAvatar> {
    const [created] = await db.insert(userAvatars).values(avatar).returning();
    return created;
  }

  async createClan(clan: any): Promise<Clan> {
    const [created] = await db.insert(clans).values(clan).returning();
    return created;
  }

  async createCodeFusion(fusion: any): Promise<CodeFusion> {
    const [created] = await db.insert(codeFusions).values(fusion).returning();
    return created;
  }

  async createProject(project: any): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async deleteCodeFusion(id: string): Promise<boolean> {
    await db.delete(codeFusions).where(eq(codeFusions.id, id));
    return true;
  }

  async getChallenges(limit = 50): Promise<Challenge[]> {
    return db.select().from(challenges).limit(limit);
  }

  async getClans(limit = 20): Promise<Clan[]> {
    return db.select().from(clans).limit(limit).orderBy(desc(clans.memberCount));
  }

  async getConversations(userId: string, limit = 50): Promise<Message[]> {
    const msgs = await db.select().from(messages).where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId))).limit(limit).orderBy(desc(messages.createdAt));
    return msgs as Message[];
  }

  async getDailyChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges).where(eq(challenges.isDaily, true)).limit(5);
  }

  async getFeedItems(limit = 50): Promise<FeedItem[]> {
    return db.select().from(feedItems).limit(limit).orderBy(desc(feedItems.createdAt));
  }

  async getLeaderboard(limit = 100): Promise<any[]> {
    return db.select().from(userProfiles).orderBy(desc(userProfiles.xp)).limit(limit);
  }

  async getMessages(userId: string, limit = 50): Promise<Message[]> {
    const msgs = await db.select().from(messages).where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId))).limit(limit).orderBy(desc(messages.createdAt));
    return msgs as Message[];
  }

  async getMetaverseLeaderboard(limit = 100): Promise<any[]> {
    return db.select().from(userAvatars).innerJoin(userProfiles, eq(userAvatars.userId, userProfiles.userId)).orderBy(desc(userProfiles.level)).limit(limit);
  }

  async getProjects(userId?: string, limit = 50): Promise<Project[]> {
    if (userId) return db.select().from(projects).where(eq(projects.userId, userId)).limit(limit);
    return db.select().from(projects).limit(limit).orderBy(desc(projects.createdAt));
  }

  async getPublicCodeFusions(limit = 50): Promise<CodeFusion[]> {
    return db.select().from(codeFusions).where(eq(codeFusions.isPublic, true)).limit(limit).orderBy(desc(codeFusions.createdAt));
  }

  async getRoadmaps(limit = 20): Promise<Roadmap[]> {
    return db.select().from(roadmaps).limit(limit);
  }

  async getUserAvatar(userId: string): Promise<UserAvatar | undefined> {
    const [avatar] = await db.select().from(userAvatars).where(eq(userAvatars.userId, userId));
    return avatar;
  }

  async getUserChallenges(userId: string, limit = 50): Promise<UserChallenge[]> {
    return db.select().from(userChallenges).where(eq(userChallenges.userId, userId)).limit(limit);
  }

  async getUserClans(userId: string): Promise<Clan[]> {
    const clans_list = await db.select().from(clans).innerJoin(clanMembers, eq(clans.id, clanMembers.clanId)).where(eq(clanMembers.userId, userId));
    return clans_list.map(c => c.clans);
  }

  async getUserCodeFusions(userId: string, limit = 50): Promise<CodeFusion[]> {
    return db.select().from(codeFusions).where(eq(codeFusions.userId, userId)).limit(limit);
  }

  async getUserCourses(userId: string, limit = 50): Promise<UserCourse[]> {
    return db.select().from(userCourses).where(eq(userCourses.userId, userId)).limit(limit);
  }

  async getUserProjects(userId: string, limit = 50): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.userId, userId)).limit(limit);
  }

  async getUserQuests(userId: string, limit = 50): Promise<UserQuest[]> {
    return db.select().from(userQuests).where(eq(userQuests.userId, userId)).limit(limit);
  }

  async getUserRoadmaps(userId: string, limit = 20): Promise<UserRoadmap[]> {
    return db.select().from(userRoadmaps).where(eq(userRoadmaps.userId, userId)).limit(limit);
  }

  async joinClan(clanId: string, userId: string): Promise<ClanMember> {
    const [member] = await db.insert(clanMembers).values({ clanId, userId, role: "member" }).returning();
    return member;
  }

  async markMessagesRead(userId: string, messageIds: string[]): Promise<boolean> {
    await db.update(messages).set({ isRead: true }).where(and(eq(messages.recipientId, userId), inArray(messages.id, messageIds)));
    return true;
  }

  async sendMessage(from: string, to: string, content: string): Promise<Message> {
    const [msg] = await db.insert(messages).values({ senderId: from, receiverId: to, content, isRead: false } as any).returning();
    return msg as Message;
  }

  async startChallenge(userId: string, challengeId: string): Promise<UserChallenge> {
    const [uc] = await db.insert(userChallenges).values({ userId, challengeId, status: "in_progress" }).returning();
    return uc;
  }

  async startCourse(userId: string, courseId: string): Promise<UserCourse> {
    const [uc] = await db.insert(userCourses).values({ userId, courseId, progress: 0, isCompleted: false }).returning();
    return uc;
  }

  async startRoadmap(userId: string, roadmapId: string): Promise<UserRoadmap> {
    const [ur] = await db.insert(userRoadmaps).values({ userId, roadmapId, currentMilestone: 0 } as any).returning();
    return ur as UserRoadmap;
  }

  async submitChallenge(userId: string, challengeId: string, code: string, score: number): Promise<UserChallenge> {
    const [uc] = await db.update(userChallenges).set({ status: score >= 70 ? "completed" : "in_progress", submittedCode: code, score }).where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId))).returning();
    return uc;
  }

  async updateAvatar(userId: string, avatar: any): Promise<UserAvatar> {
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

  async updateUserProfile(userId: string, profile: any): Promise<UserProfile> {
    const [updated] = await db.update(userProfiles).set(profile).where(eq(userProfiles.userId, userId)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
