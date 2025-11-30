import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import {
  MessageSquare,
  Send,
  Search,
  Circle,
  ArrowLeft,
} from "lucide-react";
import type { Message, User } from "@shared/schema";

interface Conversation {
  user: User;
  lastMessage: Message;
}

function ConversationItem({
  conversation,
  isActive,
  onClick,
}: {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}) {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors hover-elevate ${
        isActive ? "bg-accent" : ""
      }`}
      data-testid={`conversation-${conversation.user.id}`}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage 
            src={conversation.user.profileImageUrl ? `${conversation.user.profileImageUrl}?w=48&h=48&fit=crop` : undefined}
            srcSet={conversation.user.profileImageUrl ? `${conversation.user.profileImageUrl}?w=48&h=48&fit=crop 1x, ${conversation.user.profileImageUrl}?w=96&h=96&fit=crop 2x` : undefined}
            className="object-cover"
            loading="lazy"
            decoding="async"
          />
          <AvatarFallback>
            {conversation.user.firstName?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-status-online text-status-online" />
      </div>
      <div className="flex-1 text-left overflow-hidden">
        <div className="flex items-center justify-between">
          <p className="font-medium truncate">
            {conversation.user.firstName || "Anonymous"}
          </p>
          <span className="text-xs text-muted-foreground">
            {conversation.lastMessage.createdAt && timeAgo(conversation.lastMessage.createdAt)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {conversation.lastMessage.content}
        </p>
      </div>
      {!conversation.lastMessage.isRead && (
        <div className="h-2 w-2 rounded-full bg-primary" />
      )}
    </button>
  );
}

function ChatMessage({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}

export default function Messages() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: conversations, isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/messages/conversations"],
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages", selectedUser?.id],
    enabled: !!selectedUser,
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/messages", {
        receiverId: selectedUser?.id,
        content: newMessage,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedUser?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
      setNewMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    },
  });

  const filteredConversations = conversations?.filter((c) =>
    c.user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (conversationsLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] p-6 gap-6">
        <Skeleton className="w-80 h-full" />
        <Skeleton className="flex-1 h-full" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] p-6 gap-6">
      <Card className={`w-80 shrink-0 ${selectedUser ? "hidden md:flex" : "flex"} flex-col`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-messages"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full">
            <div className="space-y-1 p-3">
              {filteredConversations && filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <ConversationItem
                    key={conversation.user.id}
                    conversation={conversation}
                    isActive={selectedUser?.id === conversation.user.id}
                    onClick={() => setSelectedUser(conversation.user)}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-muted-foreground">No conversations yet</p>
                  <p className="text-sm text-muted-foreground">
                    Start chatting with other developers!
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className={`flex-1 ${!selectedUser ? "hidden md:flex" : "flex"} flex-col`}>
        {selectedUser ? (
          <>
            <CardHeader className="flex-row items-center gap-3 space-y-0 border-b">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSelectedUser(null)}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={selectedUser.profileImageUrl ? `${selectedUser.profileImageUrl}?w=40&h=40&fit=crop` : undefined}
                  srcSet={selectedUser.profileImageUrl ? `${selectedUser.profileImageUrl}?w=40&h=40&fit=crop 1x, ${selectedUser.profileImageUrl}?w=80&h=80&fit=crop 2x` : undefined}
                  className="object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <AvatarFallback>
                  {selectedUser.firstName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{selectedUser.firstName || "Anonymous"}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Circle className="h-2 w-2 fill-status-online text-status-online" />
                  Online
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full">
                <div className="flex flex-col gap-3 p-4">
                  {messagesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-48" />
                      ))}
                    </div>
                  ) : messages && messages.length > 0 ? (
                    messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isOwn={message.senderId === user?.id}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No messages yet</p>
                      <p className="text-sm text-muted-foreground">
                        Send the first message!
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newMessage.trim()) {
                    sendMessage.mutate();
                  }
                }}
                className="flex items-center gap-2"
              >
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                  data-testid="input-message"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newMessage.trim() || sendMessage.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <CardContent className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Select a conversation</p>
              <p className="text-sm text-muted-foreground">
                Choose a conversation to start chatting
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
