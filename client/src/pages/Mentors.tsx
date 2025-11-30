import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  Search,
  Star,
  MessageSquare,
  Brain,
  Code,
  Shield,
  Cpu,
  Sparkles,
  ChevronRight,
  Award,
  Clock,
} from "lucide-react";
import type { User, UserProfile } from "@shared/schema";
import { useState } from "react";
import { Link } from "wouter";

interface Mentor {
  user: User;
  profile: UserProfile;
  matchScore: number;
}

const interestIcons: Record<string, typeof Brain> = {
  AI: Brain,
  "Web Dev": Code,
  Cybersecurity: Shield,
  Robotics: Cpu,
  ML: Sparkles,
};

function MentorCard({ mentor }: { mentor: Mentor }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const requestMentor = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/mentors/${mentor.user.id}/request`, {});
    },
    onSuccess: () => {
      toast({
        title: "Request sent!",
        description: `Your mentorship request has been sent to ${mentor.user.firstName || "the mentor"}.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send request.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="hover-elevate">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={mentor.user.profileImageUrl ? `${mentor.user.profileImageUrl}?w=64&h=64&fit=crop` : undefined}
                srcSet={mentor.user.profileImageUrl ? `${mentor.user.profileImageUrl}?w=64&h=64&fit=crop 1x, ${mentor.user.profileImageUrl}?w=128&h=128&fit=crop 2x` : undefined}
                className="object-cover"
                loading="lazy"
                decoding="async"
              />
              <AvatarFallback className="text-lg font-bold">
                {mentor.user.firstName?.[0] || "M"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {mentor.profile.level}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">
                {mentor.user.firstName || "Anonymous"} {mentor.user.lastName || ""}
              </h3>
              <Badge variant="secondary" className="text-chart-4">
                {mentor.matchScore}% Match
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{mentor.profile.techTier}</p>
            
            {mentor.profile.bio && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {mentor.profile.bio}
              </p>
            )}

            {mentor.profile.interests && mentor.profile.interests.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {mentor.profile.interests.slice(0, 4).map((interest, i) => {
                  const Icon = interestIcons[interest] || Sparkles;
                  return (
                    <Badge key={i} variant="outline" className="text-xs">
                      <Icon className="mr-1 h-3 w-3" />
                      {interest}
                    </Badge>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Award className="h-4 w-4" />
                  {mentor.profile.badges?.length || 0} badges
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {mentor.profile.dailyStreak || 0} day streak
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/messages?user=${mentor.user.id}`}>
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  onClick={() => requestMentor.mutate()}
                  disabled={requestMentor.isPending}
                  data-testid={`button-request-mentor-${mentor.user.id}`}
                >
                  {requestMentor.isPending ? "Requesting..." : "Request Mentor"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Mentors() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: mentors, isLoading } = useQuery<Mentor[]>({
    queryKey: ["/api/mentors"],
  });

  const filteredMentors = mentors?.filter((mentor) =>
    mentor.user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.profile.interests?.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-10 w-full" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-display text-3xl font-bold">MentorVerse</h1>
        <p className="mt-1 text-muted-foreground">
          Connect with experienced developers matched to your interests and goals
        </p>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-chart-2/10">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold">AI Mentor Matching</h3>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes your interests, skill level, and goals to find the perfect mentors for you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search mentors by name or skill..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
          data-testid="input-search-mentors"
        />
      </div>

      <div className="space-y-4">
        {filteredMentors && filteredMentors.length > 0 ? (
          filteredMentors.map((mentor) => (
            <MentorCard key={mentor.user.id} mentor={mentor} />
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">No mentors found</p>
              <p className="text-sm text-muted-foreground">
                Check back soon for mentor matches!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
