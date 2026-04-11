import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const POST_TYPES = [
  { key: "win", emoji: "🏆", label: "Win", placeholder: "What are you celebrating today?" },
  { key: "intention", emoji: "🌱", label: "Intention", placeholder: "What are you calling in?" },
  { key: "oracle_share", emoji: "🃏", label: "Oracle Share", placeholder: "What card came up and what did it mean for you?" },
  { key: "breakthrough", emoji: "💡", label: "Breakthrough", placeholder: "What shifted — even something small?" },
  { key: "question", emoji: "❓", label: "Question", placeholder: "What are you working through?" },
  { key: "gratitude", emoji: "🙏", label: "Gratitude", placeholder: "What are you grateful for right now?" },
];

interface PostComposerProps {
  presetContent: string | null;
  onClose: () => void;
  onPosted: () => void;
}

export function PostComposer({ presetContent, onClose, onPosted }: PostComposerProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [postType, setPostType] = useState(presetContent ? "question" : "win");
  const [content, setContent] = useState(presetContent || "");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);

  const selected = POST_TYPES.find(t => t.key === postType)!;

  const handlePost = async () => {
    if (!user || !content.trim()) return;
    setPosting(true);

    await supabase.from("circle_posts").insert({
      user_id: user.id,
      post_type: postType,
      content: content.trim(),
      is_anonymous: isAnonymous,
    });

    // Ensure circle_members entry exists
    const { data: existing } = await supabase.from("circle_members").select("id").eq("user_id", user.id).maybeSingle();
    if (!existing) {
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("user_id", user.id).single();
      await supabase.from("circle_members").insert({
        user_id: user.id,
        display_name: (profile as any)?.full_name?.split(" ")[0] || "Member",
      });
    }

    setPosting(false);
    toast({ title: "Shared with the Circle ✦" });
    onPosted();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">Share with the Circle</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        {/* Post type selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {POST_TYPES.map(t => (
            <button
              key={t.key}
              onClick={() => setPostType(t.key)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                postType === t.key
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border text-muted-foreground hover:border-accent/40"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>

        <Textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder={selected.placeholder}
          className="min-h-[120px] bg-muted/30 border-border/30 mb-4"
          autoFocus
        />

        <div className="flex items-center gap-2 mb-4">
          <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          <span className="text-xs text-muted-foreground">Post as Anonymous</span>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            onClick={handlePost}
            disabled={posting || !content.trim()}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold"
          >
            {posting ? "Posting..." : "Share with the Circle"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
