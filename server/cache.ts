import memoize from "memoizee";

// Cache expensive queries for 5 minutes with automatic cleanup
export const createCacheWithTTL = (fn: (...args: any[]) => Promise<any>, ttl = 300000) => {
  return memoize(fn, { 
    async: true,
    maxAge: ttl,
    length: 2, // Cache based on first 2 arguments
    preFetch: 0.5, // Refresh cache at 50% TTL
  });
};

// Cache functions - invalidate on data changes
export const cacheManager = {
  arenas: new Map<string, any>(),
  quests: new Map<string, any>(),
  courses: new Map<string, any>(),
  leaderboard: new Map<string, any>(),
  
  clear(key: string) {
    this.arenas.clear();
    this.quests.clear();
    this.courses.clear();
    this.leaderboard.clear();
  },

  setArenas(data: any) {
    this.arenas.set("all", data);
  },

  getArenas() {
    return this.arenas.get("all");
  },

  setQuests(data: any) {
    this.quests.set("all", data);
  },

  getQuests() {
    return this.quests.get("all");
  },

  setCourses(data: any) {
    this.courses.set("all", data);
  },

  getCourses() {
    return this.courses.get("all");
  },
};
