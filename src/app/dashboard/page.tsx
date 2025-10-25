import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { FileText, Download, Trash2, Pencil } from 'lucide-react';

const mockResumes = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    createdAt: '2023-10-27T10:00:00Z',
  },
  {
    id: '2',
    title: 'Product Manager Application',
    createdAt: '2023-10-26T15:30:00Z',
  },
  {
    id: '3',
    title: 'UX Designer Portfolio CV',
    createdAt: '2023-10-25T09:15:00Z',
  },
  {
    id: '4',
    title: 'Data Scientist (Draft)',
    createdAt: '2023-10-24T18:45:00Z',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-secondary/50">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-headline text-3xl font-bold">Your Resumes</h1>
            <Link href="/build">
              <Button>Create New Resume</Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockResumes.map((resume) => (
              <Card key={resume.id} className="flex flex-col">
                <CardHeader className="flex-row items-start gap-4 space-y-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="font-headline">{resume.title}</CardTitle>
                    <CardDescription>
                      Created on {new Date(resume.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1"></CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                   <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </CardFooter>
              </Card>
            ))}
             <Card className="flex flex-col items-center justify-center border-2 border-dashed">
                <Link href="/build">
                    <Button variant="outline">Create a New Resume</Button>
                </Link>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
