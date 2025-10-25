'use server';
/**
 * @fileOverview Analyzes a resume for ATS optimization and provides a score.
 *
 * - analyzeResumeForATS - A function that analyzes the resume.
 * - AnalyzeResumeForATSInput - The input type for the analyzeResumeForATS function.
 * - AnalyzeResumeForATSOutput - The return type for the analyzeResumeForATS function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeForATSInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to analyze.'),
  jobDescription: z.string().describe('The job description to compare the resume against.'),
});
export type AnalyzeResumeForATSInput = z.infer<typeof AnalyzeResumeForATSInputSchema>;

const AnalyzeResumeForATSOutputSchema = z.object({
  atsScore: z.number().describe('The ATS score of the resume out of 100.'),
  keywordMatches: z.array(z.string()).describe('Keywords from the job description found in the resume.'),
  missingKeywords: z.array(z.string()).describe('Keywords from the job description missing in the resume.'),
  suggestions: z.string().describe('Suggestions for improving the resume for ATS.'),
});
export type AnalyzeResumeForATSOutput = z.infer<typeof AnalyzeResumeForATSOutputSchema>;

export async function analyzeResumeForATS(input: AnalyzeResumeForATSInput): Promise<AnalyzeResumeForATSOutput> {
  return analyzeResumeForATSFlow(input);
}

const analyzeResumeForATSPrompt = ai.definePrompt({
  name: 'analyzeResumeForATSPrompt',
  input: {schema: AnalyzeResumeForATSInputSchema},
  output: {schema: AnalyzeResumeForATSOutputSchema},
  prompt: `You are an expert resume analyst specializing in Applicant Tracking Systems (ATS) optimization.

  Analyze the following resume text against the provided job description to determine its ATS compatibility.

  Resume Text: {{{resumeText}}}

  Job Description: {{{jobDescription}}}

  1.  Calculate an ATS score (out of 100) based on the presence of keywords, use of action verbs, formatting, and overall readability.
  2.  Identify keywords from the job description that are present in the resume (keywordMatches).
  3.  Identify keywords from the job description that are missing from the resume (missingKeywords).
  4.  Provide specific suggestions for improving the resume's ATS score, including adding missing keywords, optimizing formatting, and using action verbs (suggestions).

  Ensure that the output is a valid JSON object matching the AnalyzeResumeForATSOutputSchema.
`,
});

const analyzeResumeForATSFlow = ai.defineFlow(
  {
    name: 'analyzeResumeForATSFlow',
    inputSchema: AnalyzeResumeForATSInputSchema,
    outputSchema: AnalyzeResumeForATSOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumeForATSPrompt(input);
    return output!;
  }
);
