'use server';

/**
 * @fileOverview Generates a complete resume from a single user prompt.
 *
 * - generateResumeFromPrompt - A function that generates a resume from a prompt.
 * - GenerateResumeFromPromptInput - The input type for the generateResumeFromPrompt function.
 * - GenerateResumeFromPromptOutput - The return type for the generateResumefromprompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeFromPromptInputSchema = z.object({
  prompt: z.string().describe('A detailed prompt describing the user, their skills, experience, and desired job.'),
});
export type GenerateResumeFromPromptInput = z.infer<typeof GenerateResumeFromPromptInputSchema>;


const ExperienceSchema = z.object({
  id: z.string().describe("A unique identifier for the experience, like a UUID."),
  role: z.string(),
  company: z.string(),
  date: z.string().describe("e.g., Jan 2020 - Present"),
  description: z.string().describe("A multi-line description of responsibilities and achievements, with each point starting with a hyphen.")
});

const EducationSchema = z.object({
    id: z.string().describe("A unique identifier for the education entry, like a UUID."),
    degree: z.string(),
    university: z.string(),
    date: z.string().describe("e.g., 2018 - 2022"),
});

const ProjectSchema = z.object({
    id: z.string().describe("A unique identifier for the project, like a UUID."),
    name: z.string(),
    description: z.string(),
});


const GenerateResumeFromPromptOutputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
  summary: z.string().describe("A 2-4 sentence professional summary."),
  skills: z.string().describe("A comma-separated list of relevant skills."),
  experience: z.array(ExperienceSchema),
  education: z.array(EducationSchema),
  projects: z.array(ProjectSchema),
});
export type GenerateResumeFromPromptOutput = z.infer<typeof GenerateResumeFromPromptOutputSchema>;


export async function generateResumeFromPrompt(input: GenerateResumeFromPromptInput): Promise<GenerateResumeFromPromptOutput> {
  return generateResumeFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumeFromPromptPrompt',
  input: {schema: GenerateResumeFromPromptInputSchema},
  output: {schema: GenerateResumeFromPromptOutputSchema},
  prompt: `You are an expert resume writer. Generate a complete resume based on the user's prompt. 
  The resume must include all sections from the user's prompt: contact details, summary, skills, experience, education, and projects.
  The output must be a valid JSON object that strictly follows the provided output schema.
  For any fields that require an ID, generate a random UUID.
  For the experience description, create a multi-line string where each bullet point starts with a hyphen.

Prompt: {{{prompt}}}
`,
});

const generateResumeFromPromptFlow = ai.defineFlow(
  {
    name: 'generateResumeFromPromptFlow',
    inputSchema: GenerateResumeFromPromptInputSchema,
    outputSchema: GenerateResumeFromPromptOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        throw new Error('AI model did not return an output.');
      }
      // The output from the model is already a structured JSON object matching the schema.
      return output;
    } catch (error) {
      console.error('Error in generateResumeFromPromptFlow:', error);
      // Re-throw a more generic error to the client
      throw new Error('An error occurred while generating the resume. Please try again.');
    }
  }
);
