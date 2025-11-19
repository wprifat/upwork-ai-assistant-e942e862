import { useEffect, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Loader2, Calendar, ArrowLeft, Share2, Twitter, Linkedin, Facebook, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  body: string;
  feature_image: string | null;
  seo_title: string | null;
  meta_description: string | null;
  created_at: string;
  published_at: string;
  author_id: string | null;
}

interface AdjacentPost {
  title: string;
  slug: string;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [previousPost, setPreviousPost] = useState<AdjacentPost | null>(null);
  const [nextPost, setNextPost] = useState<AdjacentPost | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, body, feature_image, seo_title, meta_description, created_at, published_at, author_id")
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
      
      // Fetch adjacent posts
      if (data) {
        await fetchAdjacentPosts(data.published_at);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdjacentPosts = async (currentPublishedAt: string) => {
    try {
      // Get previous post (older)
      const { data: prevData } = await supabase
        .from("blog_posts")
        .select("title, slug")
        .eq("published", true)
        .lt("published_at", currentPublishedAt)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      setPreviousPost(prevData);

      // Get next post (newer)
      const { data: nextData } = await supabase
        .from("blog_posts")
        .select("title, slug")
        .eq("published", true)
        .gt("published_at", currentPublishedAt)
        .order("published_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      setNextPost(nextData);
    } catch (error) {
      console.error("Error fetching adjacent posts:", error);
    }
  };

  const calculateReadingTime = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "");
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const title = post?.title || "";

    if (platform === "twitter") {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else if (navigator.share) {
      navigator.share({ title, url });
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

  const readingTime = calculateReadingTime(post.body);

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
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150"
            style={{ width: `${readingProgress}%` }}
          />
        </div>

        <Header />

        {/* Hero Section */}
        <section className="pt-8 pb-0 border-b border-border">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <Link to="/blog">
                <Button variant="ghost" size="sm" className="-ml-4 mb-8 hover:bg-muted text-muted-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Button>
              </Link>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <time>{format(new Date(post.created_at), "MMM dd, yyyy")}</time>
                </div>
                <span className="text-border">•</span>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="font-heading font-bold mb-12 text-foreground leading-tight">
                {post.title}
              </h1>
            </div>

            {/* Feature Image */}
            {post.feature_image && (
              <div className="max-w-5xl mx-auto mb-0">
                <div className="rounded-t-2xl overflow-hidden shadow-card-hover">
                  <img
                    src={post.feature_image}
                    alt={post.title}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Article Content */}
        <main className="flex-1 bg-gradient-to-b from-card to-background">
          <div className="container-custom py-16 md:py-20">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Social Share Sidebar - Desktop */}
                <aside className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-24 space-y-3">
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-10 h-10 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center text-muted-foreground"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare("linkedin")}
                      className="w-10 h-10 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center text-muted-foreground"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-10 h-10 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center text-muted-foreground"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                    </button>
                  </div>
                </aside>

                {/* Main Content */}
                <article className="lg:col-span-11">
                  <div
                    className="prose prose-lg max-w-none
                      prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
                      prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
                      prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-5
                      prose-h4:text-xl prose-h4:mt-8 prose-h4:mb-4
                      prose-p:text-foreground/90 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-[1.0625rem]
                      prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-a:transition-all
                      prose-strong:text-foreground prose-strong:font-semibold
                      prose-ul:my-8 prose-ul:space-y-3
                      prose-ol:my-8 prose-ol:space-y-3
                      prose-li:text-foreground/90 prose-li:leading-relaxed prose-li:pl-2
                      prose-li::marker:text-primary
                      prose-code:text-primary prose-code:bg-primary/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-[''] prose-code:after:content-['']
                      prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg
                      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:my-8 prose-blockquote:not-italic
                      prose-hr:border-border prose-hr:my-12
                      prose-img:rounded-xl prose-img:shadow-card
                    "
                    dangerouslySetInnerHTML={{ __html: post.body }}
                  />

                  {/* Mobile Share Buttons */}
                  <div className="lg:hidden mt-12 pt-8 border-t border-border">
                    <p className="text-sm font-medium text-foreground mb-4">Share this article</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleShare("twitter")}
                        className="flex-1 h-10 rounded-lg border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </button>
                      <button
                        onClick={() => handleShare("linkedin")}
                        className="flex-1 h-10 rounded-lg border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </button>
                      <button
                        onClick={() => handleShare("facebook")}
                        className="flex-1 h-10 rounded-lg border border-border bg-card hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </button>
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="mt-16 p-8 md:p-10 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-2xl border border-primary/20 shadow-card">
                    <div className="max-w-xl">
                      <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-foreground">
                        Ready to land more Upwork clients?
                      </h3>
                      <p className="text-foreground/80 mb-6 leading-relaxed">
                        Join thousands of successful freelancers using UpAssistify to automate proposals, optimize profiles, and win more projects.
                      </p>
                      <Link to="/#pricing">
                        <Button size="lg" className="font-semibold shadow-md hover:shadow-lg transition-all">
                          Get Started Free
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Post Navigation */}
                  {(previousPost || nextPost) && (
                    <nav className="mt-16 pt-12 border-t border-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Previous Post */}
                        <div className={previousPost ? "" : "md:col-start-2"}>
                          {previousPost && (
                            <Link 
                              to={`/blog/${previousPost.slug}`}
                              className="group block p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-card transition-all"
                            >
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                                <ChevronLeft className="h-4 w-4" />
                                <span className="font-medium">Previous Article</span>
                              </div>
                              <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {previousPost.title}
                              </h4>
                            </Link>
                          )}
                        </div>

                        {/* Next Post */}
                        <div>
                          {nextPost && (
                            <Link 
                              to={`/blog/${nextPost.slug}`}
                              className="group block p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-card transition-all text-right"
                            >
                              <div className="flex items-center justify-end gap-3 text-sm text-muted-foreground mb-2">
                                <span className="font-medium">Next Article</span>
                                <ChevronRight className="h-4 w-4" />
                              </div>
                              <h4 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {nextPost.title}
                              </h4>
                            </Link>
                          )}
                        </div>
                      </div>
                    </nav>
                  )}
                </article>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
