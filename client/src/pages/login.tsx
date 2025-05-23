import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";

// Form validation schema
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function Login() {
  const { t } = useLanguage();
  const { login, loginWithGoogle, loginWithApple } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  
  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      await login(values.email, values.password);
      toast({
        title: t("auth.loginSuccess"),
        description: t("auth.welcomeBack"),
      });
      setLocation("/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: t("error.login"),
        description: error instanceof Error ? error.message : t("error.generic"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Social login handlers
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast({
        title: t("auth.loginSuccess"),
        description: t("auth.welcomeBack"),
      });
      setLocation("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: t("error.login"),
        description: error instanceof Error ? error.message : t("error.generic"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAppleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithApple();
      toast({
        title: t("auth.loginSuccess"),
        description: t("auth.welcomeBack"),
      });
      setLocation("/");
    } catch (error) {
      console.error("Apple login error:", error);
      toast({
        title: t("error.login"),
        description: error instanceof Error ? error.message : t("error.generic"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card className="mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <svg className="h-12 w-auto text-primary-600 dark:text-primary-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L2 8L12 12L22 8L12 4Z" fill="currentColor"/>
              <path d="M2 12L12 16L22 12" fill="currentColor"/>
              <path d="M2 16L12 20L22 16" fill="currentColor"/>
            </svg>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            {t("auth.login")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.loginDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("auth.email")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="example@example.com" 
                        {...field} 
                        type="email"
                        autoComplete="email"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t("auth.password")}</FormLabel>
                      <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        {t("auth.forgotPassword")}
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="********" 
                        {...field} 
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("general.loading")}
                  </>
                ) : (
                  t("auth.login")
                )}
              </Button>
            </form>
          </Form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("auth.orContinueWith")}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full flex items-center gap-2"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <FcGoogle className="h-5 w-5" />
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              className="w-full flex items-center gap-2"
              onClick={handleAppleLogin}
              disabled={isLoading}
            >
              <BsApple className="h-5 w-5" />
              Apple
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t("auth.noAccount")} </span>
            <Link href="/register" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-semibold">
              {t("auth.createAccount")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
