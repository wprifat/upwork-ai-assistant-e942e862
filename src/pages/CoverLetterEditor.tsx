import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Loader2, FileText, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CoverLetter {
  id: string;
  title: string;
  content: string;
}

const CoverLetterEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    fetchCoverLetters();
  }, [user]);

  const fetchCoverLetters = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoverLetters(data || []);
    } catch (error) {
      console.error('Error fetching cover letters:', error);
      toast.error('Failed to load cover letters');
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    if (coverLetters.length >= 2) {
      toast.error('You can only save up to 2 cover letters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('cover_letters')
        .insert({
          user_id: user.id,
          title: newTitle,
          content: newContent
        });

      if (error) throw error;

      toast.success('Cover letter saved successfully!');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (error) {
      console.error('Error saving cover letter:', error);
      toast.error('Failed to save cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Cover letter deleted');
      fetchCoverLetters();
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      toast.error('Failed to delete cover letter');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container-custom max-w-4xl">
          <div className="mb-12 animate-fade-in-up">
            <h1 className="font-heading font-bold mb-2">Draft Cover Letters</h1>
            <p className="text-xl text-muted-foreground">
              Save up to 2 cover letter templates for quick access
            </p>
          </div>

          {coverLetters.length > 0 && (
            <div className="mb-8 space-y-4 animate-fade-in-up">
              <h2 className="text-xl font-semibold">Saved Cover Letters ({coverLetters.length}/2)</h2>
              {coverLetters.map((letter) => (
                <Card key={letter.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{letter.title}</h3>
                      <p className="text-muted-foreground line-clamp-3">{letter.content}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(letter.id)}
                      disabled={loading}
                      className="ml-4"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {coverLetters.length < 2 && (
            <Card className="p-8 shadow-card border border-border animate-fade-in-up">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">New Cover Letter</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Create a new draft cover letter template
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Technical Writing Template"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Cover Letter Content</Label>
                  <Textarea
                    id="content"
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Paste your draft cover letter here..."
                    className="min-h-[300px] mt-2"
                  />
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Cover Letter'
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    disabled={loading}
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {coverLetters.length >= 2 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You've reached the maximum of 2 saved cover letters. Delete one to add a new one.
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoverLetterEditor;
