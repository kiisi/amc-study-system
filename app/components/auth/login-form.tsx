import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useToast } from "~/hooks/use-toast";
import { useAuth } from "~/hooks/use-auth";
import { loginSchema, type LoginData } from "shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormProps {
    onSuccess?: () => void;
    onSwitchToRegister?: () => void;
}

export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { toast } = useToast();

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginData) => {
        setIsLoading(true);
        try {
            // await login(data.email, data.password);
            toast({
                title: "Welcome back!",
                description: "You have successfully logged in.",
            });
            onSuccess?.();
        } catch (error: any) {
            toast({
                title: "Login failed",
                description: error.message || "Please check your credentials and try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-2xl font-semibold text-foreground">Welcome Back</h3>
                <p className="text-muted-foreground mt-2">Sign in to continue your AMC preparation</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        {...field}
                                        data-testid="input-email"
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        {...field}
                                        data-testid="input-password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox id="remember" />
                            <label
                                htmlFor="remember"
                                className="text-sm text-muted-foreground cursor-pointer"
                            >
                                Remember me
                            </label>
                        </div>
                        <Button
                            type="button"
                            variant="link"
                            className="text-sm text-primary hover:underline p-0"
                        >
                            Forgot password?
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isLoading}
                        data-testid="button-login"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </Form>

            {onSwitchToRegister && (
                <div className="text-center">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Button
                        variant="link"
                        onClick={onSwitchToRegister}
                        className="text-primary hover:underline font-medium p-0"
                        data-testid="button-switch-register"
                    >
                        Sign up
                    </Button>
                </div>
            )}
        </div>
    );
}
