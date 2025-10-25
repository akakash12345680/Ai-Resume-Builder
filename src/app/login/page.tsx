'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/firebase';
import {
  initiateEmailSignUp,
  initiateEmailSignIn,
  initiateAnonymousSignIn,
} from '@/firebase/non-blocking-login';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AuthErrorCodes } from 'firebase/auth';
import { Logo } from '@/components/icons';


const signUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string(),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    formState: { errors: signUpErrors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const handleAuthError = (error: any) => {
    setLoading(false);
    let title = 'Authentication Error';
    let description = 'An unexpected error occurred. Please try again.';

    switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        title = 'Email Already in Use';
        description = 'This email is already registered. Please sign in or use a different email.';
        break;
      case AuthErrorCodes.USER_DELETED:
        title = 'User Not Found';
        description = 'No user found with this email. Please check the email or sign up.';
        break;
      case AuthErrorCodes.INVALID_PASSWORD:
        title = 'Incorrect Password';
        description = 'The password you entered is incorrect. Please try again.';
        break;
      case AuthErrorCodes.INVALID_EMAIL:
          title = 'Invalid Email';
          description = 'The email you entered is not valid. Please try again.';
          break;
      default:
        // Keep generic message for other errors
        break;
    }

    toast({
      variant: 'destructive',
      title: title,
      description: description,
    });
  };

  const onSignUp = async (data: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    try {
      await initiateEmailSignUp(auth, data.email, data.password);
      // onAuthStateChanged will handle redirect
      router.push('/dashboard');
    } catch (error: any) {
      handleAuthError(error);
    }
  };

  const onSignIn = async (data: z.infer<typeof signInSchema>) => {
    setLoading(true);
    try {
      await initiateEmailSignIn(auth, data.email, data.password);
      // onAuthStateChanged will handle redirect
      router.push('/dashboard');
    } catch (error: any) {
      handleAuthError(error);
    }
  };
  
  const onAnonymousSignIn = async () => {
    setLoading(true);
    try {
      await initiateAnonymousSignIn(auth);
      router.push('/dashboard');
    } catch (error) {
      handleAuthError(error);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <Logo className="h-6 w-6" />
          <span className="font-bold">ResumeAI</span>
        </Link>
      </div>
      <Tabs defaultValue="signin" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignInSubmit(onSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" type="email" placeholder="m@example.com" {...registerSignIn('email')} />
                  {signInErrors.email && <p className="text-sm text-destructive">{signInErrors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" type="password" {...registerSignIn('password')} />
                   {signInErrors.password && <p className="text-sm text-destructive">{signInErrors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={onAnonymousSignIn} disabled={loading}>
                  Continue as Guest
                </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Sign Up</CardTitle>
              <CardDescription>Create a new account to get started.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUpSubmit(onSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" type="email" placeholder="m@example.com" {...registerSignUp('email')} />
                  {signUpErrors.email && <p className="text-sm text-destructive">{signUpErrors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" type="password" {...registerSignUp('password')} />
                  {signUpErrors.password && <p className="text-sm text-destructive">{signUpErrors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
             <CardFooter className="flex-col gap-4">
                <Button variant="outline" className="w-full" onClick={onAnonymousSignIn} disabled={loading}>
                  Continue as Guest
                </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
