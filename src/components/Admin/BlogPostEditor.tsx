import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface BlogPostEditorProps {
  postId: string | null;
  onBack: () => void;
}

const BlogPostEditor = ({ postId, onBack }: BlogPostEditorProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    body: "",
    excerpt: "",
    feature_image: "",
    seo_title: "",
    meta_description: "",
    published: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title || "",
        slug: data.slug || "",
        body: data.body || "",
        excerpt: data.excerpt || "",
        feature_image: data.feature_image || "",
        seo_title: data.seo_title || "",
        meta_description: data.meta_description || "",
        published: data.published || false,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      seo_title: prev.seo_title || title,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("blog-images").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, feature_image: publicUrl }));

      toast({
        title: "Image uploaded",
        description: "Feature image has been uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug || !formData.body) {
      toast({
        title: "Validation Error",
        description: "Title, slug, and body are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const postData = {
        ...formData,
        author_id: userData.user?.id,
        published_at: formData.published ? new Date().toISOString() : null,
      };

      if (postId) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", postId);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert([postData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Post ${postId ? "updated" : "created"} successfully`,
      });

      onBack();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Posts
        </Button>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="published">Published</Label>
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, published: checked }))
              }
            />
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Post
              </>
            )}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{postId ? "Edit Post" : "Create New Post"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter post title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                placeholder="post-url-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Short description of the post"
                rows={3}
              />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label>Body *</Label>
            <ReactQuill
              theme="snow"
              value={formData.body}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, body: value }))
              }
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              className="bg-background"
            />
          </div>

          {/* Feature Image */}
          <div className="space-y-2">
            <Label htmlFor="feature-image">Feature Image</Label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <Input
                  id="feature-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
              {formData.feature_image && (
                <img
                  src={formData.feature_image}
                  alt="Feature"
                  className="w-32 h-32 object-cover rounded border"
                />
              )}
            </div>
            {uploading && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Upload className="h-4 w-4 animate-pulse" />
                Uploading...
              </p>
            )}
          </div>

          {/* SEO Fields */}
          <div className="space-y-4 pt-6 border-t">
            <h3 className="text-lg font-semibold">SEO Settings</h3>
            
            <div className="space-y-2">
              <Label htmlFor="seo-title">SEO Title</Label>
              <Input
                id="seo-title"
                value={formData.seo_title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, seo_title: e.target.value }))
                }
                placeholder="Optimized title for search engines (60 chars max)"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground">
                {formData.seo_title.length}/60 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    meta_description: e.target.value,
                  }))
                }
                placeholder="Brief description for search results (160 chars max)"
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground">
                {formData.meta_description.length}/160 characters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPostEditor;
