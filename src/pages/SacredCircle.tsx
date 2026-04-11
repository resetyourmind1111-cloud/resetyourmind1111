import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Send, MessageCircle, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { LockedContent } from "@/components/LockedContent";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

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
  const diff = now.getTime() - start.getTime();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek);
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  milestone_type: string | null;
  display_name: string | null;
  created_at: string;
  reaction_count: number;
  user_reacted: boolean;
}

export default function SacredCircle() {
  const { user } = useAuth();
  const { effectiveTier, hasAccess } = useSubscription();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [showComposer, setShowComposer] = useState(false);

  const weekNum = getWeekNumber();
  const currentPrompt = weeklyPrompts[weekNum % weeklyPrompts.length];

  const isLocked = !hasAccess("embody");

  const fetchPosts = useCallback(async () => {
    if (!user) return;

    const { data: postsData } = await (supabase.from("sacred_circle_posts" as any) as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!postsData) return;

    // Fetch reaction counts
    const postIds = postsData.map((p: any) => p.id);
    const { data: reactions } = await (supabase.from("sacred_circle_reactions" as any) as any)
      .select("post_id, user_id")
      .in("post_id", postIds);

    const reactionMap: Record<string, { count: number; userReacted: boolean }> = {};
    (reactions || []).forEach((r: any) => {
      if (!reactionMap[r.post_id]) reactionMap[r.post_id] = { count: 0, userReacted: false };
      reactionMap[r.post_id].count++;
      if (r.user_id === user.id) reactionMap[r.post_id].userReacted = true;
    });

    setPosts(postsData.map((p: any) => ({
      ...p,
      reaction_count: reactionMap[p.id]?.count || 0,
      user_reacted: reactionMap[p.id]?.userReacted || false,
    })));
  }, [user]);

  useEffect(() => {
    fetchPosts();

    // Realtime subscription
    const channel = supabase
      .channel("sacred-circle-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "sacred_circle_posts" }, () => fetchPosts())
      .on("postgres_changes", { event: "*", schema: "public", table: "sacred_circle_reactions" }, () => fetchPosts())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchPosts]);

  const handlePost = async () => {
    if (!user || !newPost.trim()) return;
    setPosting(true);

    const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
    const displayName = (profile as any)?.full_name?.split(" ")[0] || "Member";

    await (supabase.from("sacred_circle_posts" as any) as any).insert({
      user_id: user.id,
      content: newPost.trim(),
      post_type: "user_post",
      display_name: displayName,
    });

    setNewPost("");
    setShowComposer(false);
    setPosting(false);
    toast({ title: "Posted to Sacred Circle ✦" });
  };

  const handleReact = async (postId: string, userReacted: boolean) => {
    if (!user) return;
    if (userReacted) {
      await (supabase.from("sacred_circle_reactions" as any) as any)
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await (supabase.from("sacred_circle_reactions" as any) as any)
        .insert({ user_id: user.id, post_id: postId });
    }
  };

  const handleDelete = async (postId: string) => {
    await (supabase.from("sacred_circle_posts" as any) as any).delete().eq("id", postId);
  };

  const openComposerWithPrompt = () => {
    setNewPost(currentPrompt + "\n\n");
    setShowComposer(true);
  };

  if (isLocked) {
    return (
      <AuthenticatedLayout title="Sacred Circle" subtitle="Your reset community">
        <LockedContent requiredTier="embody" currentTier={effectiveTier}>
          <div className="text-center py-12">
            <Sparkles className="w-8 h-8 text-[#C9A84C]/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Sacred Circle is available on the Embody tier.</p>
          </div>
        </LockedContent>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout title="Sacred Circle" subtitle="Your reset community">
      <div className="max-w-2xl mx-auto pb-16">

        {/* Weekly Reset Question — Pinned */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card className="p-5 border-2 border-[#C9A84C]/40 bg-[#C9A84C]/5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] font-semibold mb-2">
              THIS WEEK'S RESET QUESTION
            </p>
            <p className="font-serif text-lg text-foreground italic leading-relaxed mb-4">
              "{currentPrompt}"
            </p>
            <Button
              onClick={openComposerWithPrompt}
              size="sm"
              className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold text-xs"
            >
              <MessageCircle className="w-3 h-3 mr-1.5" />
              Share your answer
            </Button>
          </Card>
        </motion.div>

        {/* New Post Composer */}
        <div className="mb-6">
          {!showComposer ? (
            <Button
              onClick={() => setShowComposer(true)}
              variant="outline"
              className="w-full border-border/50 text-muted-foreground hover:text-foreground hover:border-[#C9A84C]/40"
            >
              <Send className="w-4 h-4 mr-2" />
              Share something with the Circle...
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="p-4 bg-card/80 border-border/50">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your heart today?"
                  className="min-h-[100px] bg-muted/30 border-border/30 mb-3"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => { setShowComposer(false); setNewPost(""); }}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePost}
                    disabled={posting || !newPost.trim()}
                    className="bg-[#C9A84C] text-[#06060e] hover:bg-[#C9A84C]/90 font-semibold"
                  >
                    {posting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Feed */}
        <div className="space-y-4">
          <AnimatePresence>
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card className={`p-4 border-border/50 ${
                  post.post_type === "milestone" ? "border-l-2 border-l-[#C9A84C] bg-[#C9A84C]/5" :
                  post.post_type === "weekly_prompt" ? "border-l-2 border-l-primary/50 bg-primary/5" :
                  "bg-card/80"
                }`}>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {post.post_type === "milestone" && (
                        <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                      )}
                      <span className="text-sm font-semibold text-foreground">
                        {post.display_name || "Member"}
                      </span>
                      {post.post_type === "milestone" && (
                        <span className="text-[10px] uppercase tracking-wider text-[#C9A84C] bg-[#C9A84C]/10 px-1.5 py-0.5 rounded-full font-semibold">
                          Milestone
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                      {post.user_id === user?.id && (
                        <button onClick={() => handleDelete(post.id)} className="text-muted-foreground/50 hover:text-destructive transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line mb-3">
                    {post.content}
                  </p>

                  {/* Love reaction */}
                  <button
                    onClick={() => handleReact(post.id, post.user_reacted)}
                    className={`flex items-center gap-1.5 text-xs transition-colors ${
                      post.user_reacted
                        ? "text-pink-400"
                        : "text-muted-foreground hover:text-pink-400"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.user_reacted ? "fill-pink-400" : ""}`} />
                    {post.reaction_count > 0 && <span>{post.reaction_count}</span>}
                  </button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-8 h-8 text-[#C9A84C]/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">The Circle is waiting for you.</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Be the first to share something today.</p>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
