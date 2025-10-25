"use client";

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateResumeFromPrompt } from '@/ai/flows/generate-resume-from-prompt';
import { parseResumeText } from '@/lib/resume-parser';
import type { Resume } from '@/lib/types';
import Editor from './Editor';
import Preview from './Preview';

const resumeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  summary: z.string().min(10, 'Summary is too short'),
  skills: z.string().min(1, 'Skills are required'),
  experience: z.array(z.object({
    id: z.string(),
    role: z.string().min(1, 'Role is required'),
    company: z.string().min(1, 'Company is required'),
    date: z.string().min(1, 'Date is required'),
    description: z.string().min(1, 'Description is required'),
  })),
  education: z.array(z.object({
    id: z.string(),
    degree: z.string().min(1, 'Degree is required'),
    university: z.string().min(1, 'University is required'),
    date: z.string().min(1, 'Date is required'),
  })),
  projects: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, 'Project name is required'),
    description: z.string().min(1, 'Description is required'),
  })),
});


const defaultResume: Resume = {
  name: "Your Name",
  email: "youremail@example.com",
  phone: "123-456-7890",
  linkedin: "linkedin.com/in/yourprofile",
  summary: "A brief professional summary about yourself.",
  skills: "JavaScript, React, Node.js",
  experience: [],
  education: [],
  projects: [],
};


export function ResumeBuilder() {
  const [step, setStep] = useState<'prompt' | 'generating' | 'editing'>('prompt');
  const [prompt, setPrompt] = useState('');
  const { toast } = useToast();

  const methods = useForm<Resume>({
    resolver: zodResolver(resumeSchema),
    defaultValues: defaultResume,
  });

  const handleGenerate = async () => {
    if (!prompt) {
      toast({ title: 'Prompt is empty', description: 'Please provide some details about yourself.', variant: 'destructive' });
      return;
    }
    setStep('generating');
    try {
      const { resume } = await generateResumeFromPrompt({ prompt });
      const parsedResume = parseResumeText(resume);
      
      const fullResumeData = {
        ...defaultResume,
        ...parsedResume,
      };

      methods.reset(fullResumeData);
      setStep('editing');
      toast({ title: 'Resume Generated!', description: 'Your new resume is ready for editing.' });

    } catch (error) {
      console.error(error);
      toast({ title: 'Generation Failed', description: 'Could not generate resume. Please try again.', variant: 'destructive' });
      setStep('prompt');
    }
  };

  if (step === 'prompt' || step === 'generating') {
    return (
      <div className="flex h-full items-center justify-center bg-secondary/50">
        <Card className="w-full max-w-2xl shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Create Your Resume with AI</CardTitle>
            <CardDescription>
              Describe your professional background, skills, experience, and the job you're targeting. The more details you provide, the better the result.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-4">
              <Textarea
                placeholder="e.g., I'm a software engineer with 5 years of experience in React and Node.js. I worked at Google on the Search team and built a personal project that tracks crypto prices..."
                className="min-h-[200px] text-base"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={step === 'generating'}
              />
              <Button onClick={handleGenerate} disabled={step === 'generating'} size="lg">
                {step === 'generating' ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Resume'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="grid h-full grid-cols-1 md:grid-cols-2">
        <div className="h-full overflow-y-auto bg-card p-4 sm:p-6 lg:p-8">
          <Editor />
        </div>
        <div className="hidden h-full overflow-y-auto bg-secondary/30 p-8 md:block">
          <Preview />
        </div>
      </div>
    </FormProvider>
  );
}
