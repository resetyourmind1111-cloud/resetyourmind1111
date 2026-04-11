import { useState } from "react";
import { Heart, Eye, ArrowUp, MessageSquare, Trash2, Flag, MoreHorizontal, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { CirclePost } from "./CircleFeed";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const POST_TYPE_STYLES: Record<string, string> = {
  win: "bg-accent/20 text-accent-foreground",
  intention: "bg-secondary/30 text-secondary-foreground",
  oracle_share: "bg-[hsl(330,60%,50%)]/20 text-foreground",
  breakthrough: "bg-[hsl(135,20%,50%)]/20 text-foreground",
  question: "bg-muted text-foreground",
  gratitude: "bg-accent/10 text-foreground",
};

const POST_TYPE_LABELS: Record<string, string> = {
  win: "Win",
  intention: "Intention",
  oracle_share: "Oracle Share",
  breakthrough: "Breakthrough",
  question: "Question",
  gratitude: "Gratitude",
};

const REACTION_CONFIG = [
  { key: "love", icon: Heart, label: "Love", fillClass: "fill-accent text-accent" },
  { key: "witnessed", icon: Eye, label: "Witnessed", fillClass: "fill-accent text-accent" },
  { key: "you_got_this", icon: ArrowUp, label: "You Got This", fillClass: "fill-accent text-accent" },
];

interface CirclePostCardProps {
  post: CirclePost;
  onRefresh: () => void;
}

export function CirclePostCard({ post, onRefresh }: CirclePostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    const { data } = await supabase
      .from("circle_comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });

    if (data) {
      // Get display names
      const userIds = [...new Set(data.map((c: any) => c.user_id))];
      const { data: members } = await supabase.from("circle_members").select("user_id, display_name").in("user_id", userIds);
      const nameMap: Record<string, string> = {};
      (members || []).forEach((m: any) => { nameMap[m.user_id] = m.display_name; });
      setComments(data.map((c: any) => ({ ...c, display_name: nameMap[c.user_id] || "Member" })));
    }
  };

  const toggleComments = () => {
    if (!showComments) loadComments();
    setShowComments(!showComments);
  };

  const handleReaction = async (reactionType: string) => {
    if (!user) return;
    const existing = post.reactions[reactionType]?.userReacted;
    if (existing) {
      await supabase.from("circle_reactions").delete()
        .eq("post_id", post.id).eq("user_id", user.id).eq("reaction_type", reactionType);
    } else {
      await supabase.from("circle_reactions").insert({
        post_id: post.id, user_id: user.id, reaction_type: reactionType,
      });
    }
  };

  const handleComment = async () => {
    if (!user || !newComment.trim()) return;
    setSubmitting(true);
    await supabase.from("circle_comments").insert({
      post_id: post.id, user_id: user.id, content: newComment.trim(),
    });
    setNewComment("");
    setSubmitting(false);
    loadComments();
  };

  const handleDelete = async () => {
    await supabase.from("circle_posts").delete().eq("id", post.id);
    onRefresh();
  };

  const handleReport = async () => {
    if (!user) return;
    await supabase.from("circle_reports").insert({
      reporter_id: user.id, post_id: post.id, reason: "Reported by user",
    });
    toast({ title: "Thank you. This has been reported." });
  };

  return (
    <Card className={`p-4 border-border/50 ${post.is_pinned ? "border-l-2 border-l-accent bg-accent/5" : "bg-card/80"}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {post.is_admin_post && <Sparkles className="w-3.5 h-3.5 text-accent" />}
          <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
            {post.display_name?.[0]?.toUpperCase() || "M"}
          </div>
          <span className="text-sm font-semibold text-foreground">{post.display_name}</span>
          <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-semibold ${POST_TYPE_STYLES[post.post_type] || "bg-muted text-foreground"}`}>
            {POST_TYPE_LABELS[post.post_type] || post.post_type}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground/50 hover:text-foreground p-1"><MoreHorizontal className="w-3.5 h-3.5" /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {post.user_id === user?.id ? (
                <DropdownMenuItem onClick={handleDelete} className="text-destructive"><Trash2 className="w-3.5 h-3.5 mr-2" />Delete</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={handleReport}><Flag className="w-3.5 h-3.5 mr-2" />Report</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line mb-3">{post.content}</p>

      {/* Reactions */}
      <div className="flex items-center gap-4 mb-2">
        {REACTION_CONFIG.map(r => {
          const data = post.reactions[r.key];
          const active = data?.userReacted;
          const Icon = r.icon;
          return (
            <button
              key={r.key}
              onClick={() => handleReaction(r.key)}
              className={`flex items-center gap-1 text-xs transition-colors ${active ? r.fillClass : "text-muted-foreground hover:text-accent"}`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? "fill-current" : ""}`} />
              {(data?.count || 0) > 0 && <span>{data.count}</span>}
            </button>
          );
        })}
        <button onClick={toggleComments} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent ml-auto">
          <MessageSquare className="w-3.5 h-3.5" />
          {post.comment_count > 0 ? `${post.comment_count} responses` : "Respond"}
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mt-3 pt-3 border-t border-border/30 space-y-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0">
                {c.display_name?.[0]?.toUpperCase() || "M"}
              </div>
              <div>
                <span className="text-xs font-semibold text-foreground">{c.display_name}</span>
                <span className="text-[10px] text-muted-foreground ml-2">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</span>
                <p className="text-xs text-foreground/80 mt-0.5">{c.content}</p>
              </div>
            </div>
          ))}
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a response..."
              className="min-h-[48px] text-xs bg-muted/30 border-border/30"
            />
            <Button size="sm" onClick={handleComment} disabled={submitting || !newComment.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90 self-end">
              Send
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
