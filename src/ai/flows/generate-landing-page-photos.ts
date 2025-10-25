// src/ai/flows/generate-landing-page-photos.ts
'use server';
/**
 * @fileOverview Generates AI-based photos for the landing page to attract users.
 *
 * - generateLandingPagePhotos - A function that generates AI photos for the landing page.
 * - GenerateLandingPagePhotosInput - The input type for the generateLandingPagePhotos function.
 * - GenerateLandingPagePhotosOutput - The return type for the generateLandingPagePhotos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLandingPagePhotosInputSchema = z.object({
  prompt: z
    .string()
    .describe("A prompt describing the type of landing page photo to generate."),
});
export type GenerateLandingPagePhotosInput = z.infer<typeof GenerateLandingPagePhotosInputSchema>;

const GenerateLandingPagePhotosOutputSchema = z.object({
  photoDataUri: z
    .string()    
    .describe("The generated photo as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateLandingPagePhotosOutput = z.infer<typeof GenerateLandingPagePhotosOutputSchema>;

export async function generateLandingPagePhotos(input: GenerateLandingPagePhotosInput): Promise<GenerateLandingPagePhotosOutput> {
  return generateLandingPagePhotosFlow(input);
}

const generateLandingPagePhotosPrompt = ai.definePrompt({
  name: 'generateLandingPagePhotosPrompt',
  input: {schema: GenerateLandingPagePhotosInputSchema},
  output: {schema: GenerateLandingPagePhotosOutputSchema},
  prompt: `Generate a photo for the landing page based on the following prompt: {{{prompt}}}`,
});

const generateLandingPagePhotosFlow = ai.defineFlow(
  {
    name: 'generateLandingPagePhotosFlow',
    inputSchema: GenerateLandingPagePhotosInputSchema,
    outputSchema: GenerateLandingPagePhotosOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.prompt,
    });

    if (!media || !media.url) {
      throw new Error('Failed to generate landing page photo.');
    }

    return {
      photoDataUri: media.url,
    };
  }
);
