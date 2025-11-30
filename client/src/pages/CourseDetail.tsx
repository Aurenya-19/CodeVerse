import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Clock, Users, Zap, CheckCircle2, BookOpen, Code } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Course, UserCourse } from "@shared/schema";

export default function CourseDetail() {
  const [location] = useLocation();
  const courseId = location.split("/").pop();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: course, isLoading: courseLoading, isError: courseError } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
  });

  const { data: userCourse } = useQuery<UserCourse>({
    queryKey: [`/api/user/courses/${courseId}`],
  });

  const { data: generatedLessons, isLoading: lessonsLoading } = useQuery<Array<{ title: string; description: string }>>({
    queryKey: [`/api/courses/${courseId}/lessons`],
    enabled: !!courseId,
  });

  const startCourse = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", `/api/courses/${courseId}/start`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/courses/${courseId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
      toast({
        title: "Course started!",
        description: `You're now enrolled in this course!`,
      });
    },
  });

  if (courseLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <h2 className="font-display text-2xl font-bold">Course not found</h2>
        <Button asChild>
          <Link href="/courses">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
      </div>
    );
  }

  const isEnrolled = !!userCourse;
  const progress = userCourse?.progress || 0;
  const isCompleted = userCourse?.isCompleted || false;

  const lessons = generatedLessons || [];
  const completedLessons = lessons.filter((_, i) => i < (progress / 100) * lessons.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto p-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/courses">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold mb-2">{course.title}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">{course.difficulty}</Badge>
                <Badge variant="outline">{course.category}</Badge>
                {course.tags?.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{(course.enrollments || 0).toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-chart-4" />
                  <span>+{course.xpReward} XP</span>
                </div>
              </div>
            </div>

            {!isEnrolled ? (
              <Button
                onClick={() => startCourse.mutate()}
                disabled={startCourse.isPending}
                size="lg"
                data-testid="button-enroll-course"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {startCourse.isPending ? "Enrolling..." : "Enroll Now"}
              </Button>
            ) : isCompleted ? (
              <Badge variant="outline" className="text-chart-5 h-fit text-base">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Completed
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {isEnrolled && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="text-sm text-muted-foreground">
                  {completedLessons.length} of {lessons.length} lessons completed
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lessons */}
        <Card>
          <CardHeader>
            <CardTitle>Course Content</CardTitle>
            <CardDescription>{lessons.length} lessons in this course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lessonsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : lessons.length > 0 ? (
                lessons.map((lesson, index) => {
                  const isCompleted = index < completedLessons.length;
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                      data-testid={`lesson-item-${index}`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-chart-5">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <Code className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{lesson.title || `Lesson ${index + 1}`}</h4>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>
                      {isCompleted && <Badge className="bg-chart-5">Complete</Badge>}
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center py-8">No lessons available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
