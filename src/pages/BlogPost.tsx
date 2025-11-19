import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Loader2, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

interface BlogPostData {
  title: string;
  body: string;
  feature_image: string | null;
  seo_title: string | null;
  meta_description: string | null;
  created_at: string;
  author_id: string | null;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("title, body, feature_image, seo_title, meta_description, created_at, author_id")
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setNotFound(true);
        }
        throw error;
      }

      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !post) {
    return <Navigate to="/404" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{post.seo_title || post.title} | UpAssistify Blog</title>
        {post.meta_description && (
          <meta name="description" content={post.meta_description} />
        )}
        {post.feature_image && (
          <meta property="og:image" content={post.feature_image} />
        )}
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-16">
          <article className="max-w-3xl mx-auto">
            <Link to="/blog">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time>{format(new Date(post.created_at), "MMMM dd, yyyy")}</time>
              </div>
            </header>

            {post.feature_image && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img
                  src={post.feature_image}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
