import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { CirclePostCard } from "./CirclePostCard";
import { PostComposer } from "./PostComposer";
import { WeeklyQuestionCard } from "./WeeklyQuestionCard";

const weeklyPrompts = [
  "What pattern are you interrupting this week?",
  "What does choosing yourself look like today?",
  "What are you no longer available for?",
  "What would the version of you who has it all figured out do differently this week?",
  "What truth have you been avoiding?",
  "What are you most proud of from last month?",
  "Where did you abandon yourself last week — and what would repair look like?",
  "What does your nervous system need most right now?",
  "What permission do you need to give yourself this week?",
  "Who are you becoming — and what does she/he need from you today?",
  "What would you do this week if you knew you couldn't fail?",
  "What has this month shown you about yourself?",
];

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.floor((now.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

export interface CirclePost {
  id: string;
  user_id: string;
  post_type: string;
  content: string;
  image_url: string | null;
  is_pinned: boolean;
  is_admin_post: boolean;
  is_anonymous: boolean;
  created_at: string;
  display_name?: string;
  reactions: Record<string, { count: number; userReacted: boolean }>;
  comment_count: number;
}

export function CircleFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CirclePost[]>([]);
  const [showComposer, setShowComposer] = useState(false);
  const [composerPreset, setComposerPreset] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const weekNum = getWeekNumber();
  const currentPrompt = weeklyPrompts[weekNum % weeklyPrompts.length];

  const fetchPosts = useCallback(async (pageNum = 0) => {
    if (!user) return;
    const limit = 20;
    const from = pageNum * limit;

    const { data: postsData } = await supabase
      .from("circle_posts")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1);

    if (!postsData) return;
    if (postsData.length < limit) setHasMore(false);

    const postIds = postsData.map((p: any) => p.id);

    // Fetch reactions and comments count in parallel
    const [reactionsRes, commentsRes, membersRes] = await Promise.all([
      supabase.from("circle_reactions").select("post_id, user_id, reaction_type").in("post_id", postIds),
      supabase.from("circle_comments").select("post_id").in("post_id", postIds),
      supabase.from("circle_members").select("user_id, display_name"),
    ]);

    const memberNames: Record<string, string> = {};
    (membersRes.data || []).forEach((m: any) => { memberNames[m.user_id] = m.display_name; });

    const reactionMap: Record<string, Record<string, { count: number; userReacted: boolean }>> = {};
    (reactionsRes.data || []).forEach((r: any) => {
      if (!reactionMap[r.post_id]) reactionMap[r.post_id] = {};
      if (!reactionMap[r.post_id][r.reaction_type]) reactionMap[r.post_id][r.reaction_type] = { count: 0, userReacted: false };
      reactionMap[r.post_id][r.reaction_type].count++;
      if (r.user_id === user.id) reactionMap[r.post_id][r.reaction_type].userReacted = true;
    });

    const commentMap: Record<string, number> = {};
    (commentsRes.data || []).forEach((c: any) => {
      commentMap[c.post_id] = (commentMap[c.post_id] || 0) + 1;
    });

    const mapped: CirclePost[] = postsData.map((p: any) => ({
      ...p,
      display_name: p.is_admin_post ? "Reset Your Mind 1111™" : p.is_anonymous ? "A Circle Member" : (memberNames[p.user_id] || "Member"),
      reactions: reactionMap[p.id] || {},
      comment_count: commentMap[p.id] || 0,
    }));

    if (pageNum === 0) {
      setPosts(mapped);
    } else {
      setPosts(prev => [...prev, ...mapped]);
    }
  }, [user]);

  useEffect(() => {
    fetchPosts(0);
    const channel = supabase
      .channel("circle-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "circle_posts" }, () => fetchPosts(0))
      .on("postgres_changes", { event: "*", schema: "public", table: "circle_reactions" }, () => fetchPosts(0))
      .on("postgres_changes", { event: "*", schema: "public", table: "circle_comments" }, () => fetchPosts(0))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const openComposerWithPrompt = () => {
    setComposerPreset(currentPrompt + "\n\n");
    setShowComposer(true);
  };

  return (
    <div className="max-w-2xl mx-auto pb-16 relative">
      <WeeklyQuestionCard prompt={currentPrompt} onAnswer={openComposerWithPrompt} />

      <div className="space-y-4 mt-6">
        <AnimatePresence>
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.02 }}
            >
              <CirclePostCard post={post} onRefresh={() => fetchPosts(0)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">The Circle is waiting for you.</p>
          </div>
        )}

        {hasMore && posts.length > 0 && (
          <div className="text-center pt-4">
            <Button variant="ghost" onClick={() => { setPage(p => p + 1); fetchPosts(page + 1); }}>
              Load more
            </Button>
          </div>
        )}
      </div>

      {/* Floating compose button */}
      <button
        onClick={() => { setComposerPreset(null); setShowComposer(true); }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40"
      >
        <Plus className="w-6 h-6" />
      </button>

      {showComposer && (
        <PostComposer
          presetContent={composerPreset}
          onClose={() => { setShowComposer(false); setComposerPreset(null); }}
          onPosted={() => { setShowComposer(false); setComposerPreset(null); fetchPosts(0); }}
        />
      )}
    </div>
  );
}
