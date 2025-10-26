import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Bot } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1');
const featureImage1 = PlaceHolderImages.find(img => img.id === 'feature-1');
const featureImage2 = PlaceHolderImages.find(img => img.id === 'feature-2');
const featureImage3 = PlaceHolderImages.find(img => img.id === 'feature-3');
const featureImage4 = PlaceHolderImages.find(img => img.id === 'feature-4');


export default function Home() {
  const features = [
    {
      icon: <Bot className="h-10 w-10 text-primary" />,
      title: 'AI-Powered Generation',
      description: 'Go from a simple prompt to a full, professional resume in seconds. Our AI crafts every section for you.',
    },
    {
      icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
      title: 'ATS Optimization',
      description: 'Beat the bots. Get an ATS score and keyword analysis to ensure your resume gets seen by recruiters.',
    },
    {
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10 text-primary"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="m10.5 10.5-2 2L10 14l-2 2"></path><path d="m13.5 10.5 2 2L14 14l2 2"></path></svg>,
      title: 'Real-time Editing',
      description: 'Tweak and refine your resume with a live preview. Your changes are reflected instantly.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
              <div className="flex flex-col items-start justify-center space-y-6">
                <h1 className="font-headline text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  The Future of Resume Building is Here
                </h1>
                <p className="max-w-xl text-lg text-muted-foreground">
                  With ResumeAI, transform your career story into a compelling, professional resume that lands interviews. Our AI-powered platform does the heavy lifting for you.
                </p>
                <Link href="/build">
                  <Button size="lg">
                    Create Your Resume Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                {heroImage && (
                  <Image
                    src={heroImage.imageUrl}
                    alt={heroImage.description}
                    width={600}
                    height={400}
                    data-ai-hint={heroImage.imageHint}
                    className="mx-auto aspect-[3/2] overflow-hidden rounded-xl object-cover object-center shadow-2xl"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-card py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                In three simple steps, you can have a job-winning resume ready to go.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</span>
                    <span className="font-headline text-2xl">Describe Yourself</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Provide a simple prompt about your experience, skills, and the job you want. The more detail, the better!
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</span>
                    <span className="font-headline text-2xl">Generate with AI</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI analyzes your prompt and generates a complete, structured, and ATS-friendly resume in seconds.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</span>
                    <span className="font-headline text-2xl">Edit & Download</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Fine-tune your new resume with our real-time editor, select a template, and download it as a PDF.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need to Succeed</h2>
                <p className="text-muted-foreground">
                  ResumeAI is packed with features designed to give you a competitive edge in your job search.
                </p>
                <ul className="mt-8 space-y-8">
                  {features.map((feature, index) => (
                    <li key={index} className="flex gap-4">
                      {feature.icon}
                      <div>
                        <h3 className="font-headline text-xl font-semibold">{feature.title}</h3>
                        <p className="mt-1 text-muted-foreground">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-4">
                    {featureImage1 && (
                      <Image
                        src={featureImage1.imageUrl}
                        alt={featureImage1.description}
                        width={300}
                        height={200}
                        data-ai-hint={featureImage1.imageHint}
                        className="rounded-xl object-cover shadow-lg aspect-[3/2]"
                      />
                    )}
                    {featureImage3 && (
                      <Image
                        src={featureImage3.imageUrl}
                        alt={featureImage3.description}
                        width={300}
                        height={200}
                        data-ai-hint={featureImage3.imageHint}
                        className="rounded-xl object-cover shadow-lg aspect-[3/2]"
                      />
                    )}
                 </div>
                 <div className="space-y-4">
                     {featureImage2 && (
                      <Image
                        src={featureImage2.imageUrl}
                        alt={featureImage2.description}
                        width={300}
                        height={200}
                        data-ai-hint={featureImage2.imageHint}
                        className="rounded-xl object-cover shadow-lg aspect-[3/2]"
                      />
                    )}
                    {featureImage4 && (
                        <Image
                            src={featureImage4.imageUrl}
                            alt={featureImage4.description}
                            width={300}
                            height={200}
                            data-ai-hint={featureImage4.imageHint}
                            className="rounded-xl object-cover shadow-lg aspect-[3/2]"
                        />
                    )}
                 </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-card py-20 md:py-32">
          <div className="container mx-auto flex flex-col items-center justify-center space-y-6 px-4 text-center md:px-6">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">Ready to Build Your Future?</h2>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Stop stressing over your resume. Let ResumeAI create a masterpiece for you.
            </p>
            <Link href="/build">
              <Button size="lg" variant="default">
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
