"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "../context/AuthContext";
import { isConfigured } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Check } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFields = z.infer<typeof loginSchema>;
type SignUpFields = z.infer<typeof signUpSchema>;
type ForgotFields = z.infer<typeof forgotSchema>;

export const AuthCard: React.FC = () => {
  const [view, setView] = useState<"login" | "signup" | "forgot">("login");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  const {
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    loginWithGitHub,
    resetPassword,
  } = useAuth();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: loginSubmitting },
    reset: resetLogin,
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: signupRegister,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors, isSubmitting: signupSubmitting },
    reset: resetSignup,
  } = useForm<SignUpFields>({
    resolver: zodResolver(signUpSchema),
  });

  const {
    register: forgotRegister,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors, isSubmitting: forgotSubmitting },
    reset: resetForgot,
  } = useForm<ForgotFields>({
    resolver: zodResolver(forgotSchema),
  });

  const changeView = (newView: "login" | "signup" | "forgot") => {
    setView(newView);
    setSubmitError(null);
    setResetSent(false);
    resetLogin();
    resetSignup();
    resetForgot();
  };

  const onLogin = async (data: LoginFields) => {
    try {
      setSubmitError(null);
      await loginWithEmail(data.email, data.password);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Invalid email or password";
      setSubmitError(errMsg);
    }
  };

  const onSignUp = async (data: SignUpFields) => {
    try {
      setSubmitError(null);
      await signUpWithEmail(data.email, data.password, data.name);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to create account";
      setSubmitError(errMsg);
    }
  };

  const onForgot = async (data: ForgotFields) => {
    try {
      setSubmitError(null);
      await resetPassword(data.email);
      setResetSent(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to send reset link";
      setSubmitError(errMsg);
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    if (!isConfigured) return;
    try {
      setSubmitError(null);
      setSocialLoading(provider);
      if (provider === "google") {
        await loginWithGoogle();
      } else {
        await loginWithGitHub();
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : `Failed to sign in with ${provider}`;
      setSubmitError(errMsg);
    } finally {
      setSocialLoading(null);
    }
  };

  // If Firebase configuration is not set up, show interactive guidance
  if (!isConfigured) {
    return (
      <Card className="w-full max-w-md border-primary/20 bg-black/60 shadow-2xl glass-panel relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-violet-500 animate-shimmer" />
        <CardHeader className="text-center pt-8">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Firebase Required</CardTitle>
          <CardDescription className="text-sm mt-1 text-muted-foreground">
            FlowForge AI is designed as a production application. To run or preview authentication, you need to configure Firebase.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/80 bg-zinc-950/50 p-4 text-xs space-y-3 font-mono leading-relaxed">
            <p className="text-primary font-semibold text-center mb-1">STEPS TO CONNECT FIREBASE:</p>
            <p>1. Open <a href="file:///c:/Users/ayush/OneDrive/Desktop/flowforge/.env.local" className="text-violet-400 hover:underline">.env.local</a> in your IDE.</p>
            <p>2. Go to Firebase Console and grab your Web SDK configuration snippet.</p>
            <p>3. Replace placeholder keys with real values.</p>
            <p>4. Save the file and reload page.</p>
          </div>
          <div className="text-xs text-center text-muted-foreground/80">
            For local offline runs, you can also spin up the Firebase Emulator.
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 pt-6">
          <Button variant="outline" className="w-full text-xs" onClick={() => window.location.reload()}>
            Refresh Configuration
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="bezel-shell w-full max-w-md shadow-2xl">
      <div className="bezel-core p-6 md:p-8 space-y-6">
        <div className="space-y-1.5 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {view === "login" && "Welcome back"}
            {view === "signup" && "Create an account"}
            {view === "forgot" && "Reset your password"}
          </h2>
          <p className="text-xs text-zinc-400">
            {view === "login" && "Enter your email to sign in to your workspace"}
            {view === "signup" && "Get started with your flow automation workspace"}
            {view === "forgot" && "We'll send you a link to reset your credentials"}
          </p>
        </div>

      <CardContent className="space-y-4">
        {submitError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive font-medium flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        {view === "login" && (
          <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={loginErrors.email?.message}
              disabled={loginSubmitting}
              {...loginRegister("email")}
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => changeView("forgot")}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                error={loginErrors.password?.message}
                disabled={loginSubmitting}
                {...loginRegister("password")}
              />
            </div>
            <Button variant="primary" type="submit" className="w-full" isLoading={loginSubmitting}>
              Sign In
            </Button>
          </form>
        )}

        {view === "signup" && (
          <form onSubmit={handleSignupSubmit(onSignUp)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              placeholder="Ayush"
              error={signupErrors.name?.message}
              disabled={signupSubmitting}
              {...signupRegister("name")}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              error={signupErrors.email?.message}
              disabled={signupSubmitting}
              {...signupRegister("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              error={signupErrors.password?.message}
              disabled={signupSubmitting}
              {...signupRegister("password")}
            />
            <Button variant="primary" type="submit" className="w-full" isLoading={signupSubmitting}>
              Create Workspace
            </Button>
          </form>
        )}

        {view === "forgot" && (
          <div className="space-y-4">
            {resetSent ? (
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-center space-y-3">
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold">Check your inbox</h3>
                <p className="text-xs text-muted-foreground">
                  We&apos;ve sent a password recovery link to your email address.
                </p>
                <Button variant="outline" size="sm" onClick={() => changeView("login")} className="w-full">
                  Return to Sign In
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit(onForgot)} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  error={forgotErrors.email?.message}
                  disabled={forgotSubmitting}
                  {...forgotRegister("email")}
                />
                <Button variant="primary" type="submit" className="w-full" isLoading={forgotSubmitting}>
                  Send Recovery Link
                </Button>
              </form>
            )}
          </div>
        )}

        {view !== "forgot" && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/80" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                onClick={() => handleSocialLogin("google")}
                isLoading={socialLoading === "google"}
                className="w-full text-xs font-semibold gap-2.5 border-border/60 hover:bg-white/5 active:scale-[0.98]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor">
                  <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.143 1 1.25 5.925 1.25 12s4.893 11 10.99 11c6.365 0 10.596-4.477 10.596-10.79 0-.727-.078-1.282-.175-1.925H12.24z"/>
                </svg>
                Google
              </Button>
            </div>
          </>
        )}
      </CardContent>

        <div className="flex justify-center border-t border-white/10 pt-5">
          <p className="text-xs text-zinc-400">
            {view === "login" && (
              <>
                Don&apos;t have an account?{" "}
                <button onClick={() => changeView("signup")} className="text-primary hover:underline font-semibold">
                  Sign Up
                </button>
              </>
            )}
            {view === "signup" && (
              <>
                Already have an account?{" "}
                <button onClick={() => changeView("login")} className="text-primary hover:underline font-semibold">
                  Sign In
                </button>
              </>
            )}
            {view === "forgot" && !resetSent && (
              <button onClick={() => changeView("login")} className="text-primary hover:underline font-semibold">
                Return to Login
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
