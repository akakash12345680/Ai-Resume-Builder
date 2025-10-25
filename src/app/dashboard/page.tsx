'use client';

import Link from 'next/link';
import { collection, query, where } from 'firebase/firestore';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/shared/Header';
import { FileText, Download, Trash2, Pencil, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { deleteDocumentNonBlocking } from '@/firebase';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const resumesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/resumes`));
  }, [firestore, user]);

  const { data: resumes, isLoading: isResumesLoading } = useCollection(resumesQuery);

  const handleDelete = (resumeId: string) => {
    if (!user || !firestore) return;
    const docRef = collection(firestore, `users/${user.uid}/resumes`);
    deleteDocumentNonBlocking(docRef, resumeId);
  }

  const renderSkeleton = () => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex-row items-start gap-4 space-y-0">
            <Skeleton className="h-12 w-12 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </CardHeader>
          <CardContent className="flex-1"></CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

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

          {isUserLoading || isResumesLoading ? renderSkeleton() : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resumes && resumes.map((resume) => (
                <Card key={resume.id} className="flex flex-col">
                  <CardHeader className="flex-row items-start gap-4 space-y-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="font-headline">{resume.title || 'Untitled Resume'}</CardTitle>
                      <CardDescription>
                        Created on {resume.createdAt ? new Date(resume.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1"></CardContent>
                  <CardFooter className="flex justify-end gap-2">
                     <Link href={`/build?resumeId=${resume.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                     <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(resume.id)}>
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
          )}
        </div>
      </main>
    </div>
  );
}
