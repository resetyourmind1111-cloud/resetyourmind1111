import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Phone, Save, ArrowLeft, Camera, Loader2 } from "lucide-react";
import { z } from "zod";
import { Link } from "react-router-dom";

const profileSchema = z.object({
  full_name: z.string().trim().max(100, "Name must be less than 100 characters").optional(),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional(),
});

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  profile_photo_url: string | null;
  human_design_type: string | null;
  subscription_tier: string | null;
  current_streak: number | null;
  total_points: number | null;
}

export default function Settings() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setPhone(data.phone || "");
        setPhotoUrl(data.profile_photo_url);
      }
      setIsLoading(false);
    }

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a valid image (JPG, PNG, WebP, or GIF)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploadingPhoto(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("profile-photos")
        .getPublicUrl(fileName);

      const newPhotoUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      // Update profile with new photo URL
      if (profile) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ profile_photo_url: newPhotoUrl })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            profile_photo_url: newPhotoUrl,
          });

        if (insertError) throw insertError;
      }

      setPhotoUrl(newPhotoUrl);
      toast.success("Profile photo updated!");
    } catch (error: any) {
      console.error("Error uploading photo:", error);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse({ full_name: fullName, phone });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!user) return;

    setIsSaving(true);

    try {
      if (profile) {
        const { error } = await supabase
          .from("profiles")
          .update({
            full_name: fullName || null,
            phone: phone || null,
          })
          .eq("user_id", user.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            full_name: fullName || null,
            phone: phone || null,
          });

        if (error) throw error;
      }

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || "U";
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your account information</p>
          </div>

          {isLoading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-24 w-24 rounded-full mx-auto" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Photo */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={photoUrl || undefined} alt="Profile photo" />
                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto}
                        className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {isUploadingPhoto ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click the camera icon to upload a photo
                    </p>
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-sm text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={`pl-10 ${errors.full_name ? "border-destructive" : ""}`}
                      />
                    </div>
                    {errors.full_name && (
                      <p className="text-sm text-destructive">{errors.full_name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                  </div>

                  {/* Subscription Info */}
                  {profile?.subscription_tier && (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">Subscription</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {profile.subscription_tier} Plan
                          </p>
                        </div>
                        {profile.total_points !== null && (
                          <div className="text-right">
                            <p className="font-medium text-foreground">{profile.total_points}</p>
                            <p className="text-sm text-muted-foreground">Total Points</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
