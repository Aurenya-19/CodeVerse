import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Edit,
  Zap,
  Trophy,
  Target,
  Flame,
  Star,
  Award,
  Calendar,
  Code,
  FolderGit2,
  Shield,
  Brain,
  Sparkles,
  Settings,
} from "lucide-react";
import type { UserProfile, Project, Challenge } from "@shared/schema";
import { useState } from "react";
import { TECH_INTERESTS, TECH_TIERS } from "@shared/schema";

const updateProfileSchema = z.object({
  bio: z.string().max(500).optional(),
  country: z.string().optional(),
});

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

const tierColors: Record<string, string> = {
  Beginner: "text-chart-5",
  Explorer: "text-chart-2",
  Builder: "text-chart-4",
  Expert: "text-chart-1",
  Master: "text-chart-3",
  Legend: "text-primary",
};

const interestIcons: Record<string, typeof Brain> = {
  AI: Brain,
  ML: Sparkles,
  "Web Dev": Code,
  Cybersecurity: Shield,
  Robotics: Target,
};

function StatCard({ icon: Icon, label, value, color = "text-primary" }: { icon: typeof Flame; label: string; value: string | number; color?: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-border p-4">
      <div className={`rounded-lg bg-accent p-2 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default function Profile() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/user/projects"],
  });

  const form = useForm<UpdateProfileForm>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      bio: profile?.bio || "",
      country: profile?.country || "",
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (data: UpdateProfileForm) => {
      return apiRequest("PATCH", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      setIsEditOpen(false);
      toast({
        title: "Profile updated!",
        description: "Your changes have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-64 w-full" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  const xpProgress = ((profile?.xp || 0) % 1000) / 10;
  const tierColor = tierColors[profile?.techTier || "Beginner"] || "text-primary";

  return (
    <div className="space-y-6 p-6">
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-chart-2" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col items-center sm:flex-row sm:items-end gap-6">
            <div className="relative -mt-16">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage 
                  src={user?.profileImageUrl ? `${user.profileImageUrl}?w=128&h=128&fit=crop` : undefined}
                  srcSet={user?.profileImageUrl ? `${user.profileImageUrl}?w=128&h=128&fit=crop 1x, ${user.profileImageUrl}?w=256&h=256&fit=crop 2x` : undefined}
                  className="object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <AvatarFallback className="text-4xl font-bold">
                  {user?.firstName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-lg ${tierColor}`}>
                <Star className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="font-display text-3xl font-bold">
                  {user?.firstName || "Anonymous"} {user?.lastName || ""}
                </h1>
                <Badge className={tierColor}>{profile?.techTier || "Beginner"}</Badge>
              </div>
              {profile?.bio && (
                <p className="mt-2 text-muted-foreground">{profile.bio}</p>
              )}
              {profile?.interests && profile.interests.length > 0 && (
                <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                  {profile.interests.map((interest, i) => {
                    const Icon = interestIcons[interest] || Code;
                    return (
                      <Badge key={i} variant="secondary" className="text-xs">
                        <Icon className="mr-1 h-3 w-3" />
                        {interest}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile information.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => updateProfile.mutate(data))}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself..."
                              {...field}
                              data-testid="input-profile-bio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your country"
                              {...field}
                              data-testid="input-profile-country"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={updateProfile.isPending}
                      data-testid="button-save-profile"
                    >
                      {updateProfile.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Level {profile?.level || 1}</span>
              <span className="text-muted-foreground">
                {(profile?.xp || 0) % 1000} / 1000 XP
              </span>
            </div>
            <Progress value={xpProgress} className="mt-2 h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Zap} label="Total XP" value={(profile?.xp || 0).toLocaleString()} color="text-chart-4" />
        <StatCard icon={Flame} label="Day Streak" value={profile?.dailyStreak || 0} color="text-chart-3" />
        <StatCard icon={Trophy} label="Challenges" value={profile?.totalChallengesCompleted || 0} color="text-chart-1" />
        <StatCard icon={FolderGit2} label="Projects" value={profile?.totalProjectsCreated || 0} color="text-chart-2" />
      </div>

      <Tabs defaultValue="achievements">
        <TabsList>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-chart-4" />
                Badges & Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.badges && profile.badges.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {profile.badges.map((badge, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center rounded-lg border border-border p-4 text-center"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-chart-4 to-chart-1 text-white">
                        <Award className="h-8 w-8" />
                      </div>
                      <p className="mt-3 font-medium">{badge}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Award className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No badges yet</p>
                  <p className="text-sm text-muted-foreground">
                    Complete challenges to earn badges!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-chart-2" />
                Your Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-lg border border-border p-4"
                    >
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        {project.stars}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderGit2 className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No projects yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start building to showcase your work!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">Activity timeline coming soon</p>
                <p className="text-sm text-muted-foreground">
                  Track your coding journey over time!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
