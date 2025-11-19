import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Loader2, Calendar, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        {/* Article Header */}
        <section className="border-b border-border bg-card">
          <div className="container-custom py-12">
            <Link to="/blog">
              <Button variant="ghost" className="mb-8 -ml-4 hover:bg-muted">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <article className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time>{format(new Date(post.created_at), "MMMM dd, yyyy")}</time>
                </div>
              </div>

              <h1 className="font-heading font-bold mb-6 text-foreground">
                {post.title}
              </h1>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleShare}
                  className="gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </article>
          </div>
        </section>

        {/* Feature Image */}
        {post.feature_image && (
          <section className="border-b border-border bg-muted/30">
            <div className="container-custom py-8">
              <div className="max-w-5xl mx-auto rounded-xl overflow-hidden shadow-card">
                <img
                  src={post.feature_image}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </section>
        )}

        {/* Article Content */}
        <main className="flex-1 py-16 md:py-24">
          <div className="container-custom">
            <article className="max-w-3xl mx-auto">
              <div
                className="prose prose-lg max-w-none
                  prose-headings:font-heading prose-headings:font-semibold prose-headings:text-foreground
                  prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                  prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                  prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                  prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-ul:space-y-2
                  prose-li:text-foreground
                  prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                  prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic
                "
                dangerouslySetInnerHTML={{ __html: post.body }}
              />

              {/* Call to Action */}
              <div className="mt-16 p-8 bg-gradient-to-br from-primary/10 to-accent/5 rounded-xl border border-border">
                <h3 className="text-2xl font-heading font-semibold mb-4 text-foreground">
                  Ready to boost your Upwork success?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands of freelancers using UpAssistify to land more clients and grow their business.
                </p>
                <Link to="/#pricing">
                  <Button size="lg" className="font-medium">
                    Get Started Today
                  </Button>
                </Link>
              </div>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
