'use server';

/**
 * @fileOverview Generates a complete resume from a single user prompt.
 *
 * - generateResumeFromPrompt - A function that generates a resume from a prompt.
 * - GenerateResumeFromPromptInput - The input type for the generateResumeFromPrompt function.
 * - GenerateResumeFromPromptOutput - The return type for the generateResumeFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeFromPromptInputSchema = z.object({
  prompt: z.string().describe('A detailed prompt describing the user, their skills, experience, and desired job.'),
});
export type GenerateResumeFromPromptInput = z.infer<typeof GenerateResumeFromPromptInputSchema>;

const GenerateResumeFromPromptOutputSchema = z.object({
  resume: z.string().describe('The complete resume generated from the prompt.'),
});
export type GenerateResumeFromPromptOutput = z.infer<typeof GenerateResumeFromPromptOutputSchema>;

export async function generateResumeFromPrompt(input: GenerateResumeFromPromptInput): Promise<GenerateResumeFromPromptOutput> {
  return generateResumeFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeFromPromptPrompt',
  input: {schema: GenerateResumeFromPromptInputSchema},
  output: {schema: GenerateResumeFromPromptOutputSchema},
  prompt: `You are an expert resume writer. You will generate a complete resume based on the user's prompt. The resume should include the following sections: Summary, Skills, Experience, Education, and Projects. The resume should be ATS optimized with action verbs and keywords.

Prompt: {{{prompt}}}

Resume:`,
});

const generateResumeFromPromptFlow = ai.defineFlow(
  {
    name: 'generateResumeFromPromptFlow',
    inputSchema: GenerateResumeFromPromptInputSchema,
    outputSchema: GenerateResumeFromPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
