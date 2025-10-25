"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeResumeForATS, AnalyzeResumeForATSOutput } from "@/ai/flows/analyze-resume-for-ats";
import type { Resume } from "@/lib/types";

export default function AtsAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResumeForATSOutput | null>(null);
  const { toast } = useToast();
  const { getValues } = useFormContext<Resume>();

  const resumeToText = (resume: Resume): string => {
    let text = `${resume.name}\n${resume.email}\n${resume.phone}\n${resume.linkedin}\n\n`;
    text += `Summary\n${resume.summary}\n\n`;
    text += `Skills\n${resume.skills}\n\n`;
    text += `Experience\n${resume.experience.map(exp => `${exp.role} at ${exp.company} (${exp.date})\n${exp.description}`).join('\n\n')}\n\n`;
    text += `Education\n${resume.education.map(edu => `${edu.degree}, ${edu.university} (${edu.date})`).join('\n')}\n\n`;
    text += `Projects\n${resume.projects.map(proj => `${proj.name}\n${proj.description}`).join('\n\n')}`;
    return text;
  };

  const handleAnalyze = async () => {
    if (!jobDescription) {
      toast({ title: 'Job Description is empty', description: 'Please paste a job description to analyze.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const resumeText = resumeToText(getValues());
      const analysisResult = await analyzeResumeForATS({ resumeText, jobDescription });
      setResult(analysisResult);
    } catch (error) {
      console.error(error);
      toast({ title: 'Analysis Failed', description: 'Could not analyze the resume. Please try again.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Analyze ATS Score</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">ATS Optimization Analysis</DialogTitle>
          <DialogDescription>
            Paste a job description below to see how well your resume matches.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-[150px]"
              placeholder="Paste the full job description here..."
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Analyzing...</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div>
              <Label className="text-lg font-headline">ATS Score: {result.atsScore}/100</Label>
              <Progress value={result.atsScore} className="w-full mt-2" />
            </div>
            
            <div>
                <h4 className="font-headline text-md mb-2">Suggestions for Improvement</h4>
                <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">{result.suggestions}</p>
            </div>

            <div>
              <h4 className="font-headline text-md mb-2">Keyword Matches</h4>
              <div className="flex flex-wrap gap-2">
                {result.keywordMatches.length > 0 ? (
                  result.keywordMatches.map((kw, i) => <Badge key={i} variant="secondary">{kw}</Badge>)
                ) : (
                  <p className="text-sm text-muted-foreground">No matching keywords found.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-headline text-md mb-2">Missing Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.length > 0 ? (
                  result.missingKeywords.map((kw, i) => <Badge key={i} variant="destructive">{kw}</Badge>)
                ) : (
                  <p className="text-sm text-muted-foreground">Great job! No critical keywords are missing.</p>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
