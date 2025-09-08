import { GraduationCap } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import PasswordInput from "~/components/ui/password-input";
import TextInput from "~/components/ui/text-input";

export default function Login() {
    return (
        <main className="min-h-screen bg-[#f4f5f6] grid place-items-center px-4 py-10">
            <div className="w-full max-w-[526px]">
                <header className="grid place-items-center mb-[32px]">
                    <Link to="/" className="flex items-center">
                        <GraduationCap className="text-primary text-2xl mr-2" />
                        <h1 className="text-[24px] font-bold text-foreground">AMC</h1>
                    </Link>
                </header>
                <div className="bg-white rounded-[12px] px-4 lg:px-[32px] py-[32px] md:p-[40px]">
                    <div className="mb-[40px] text-center">
                        <h1 className="font-bold text-[24px] md:text-[32px] mb-[8px] font-secondary">Login</h1>
                        <p className="text-gray-alt">
                            Welcome back! Log in to continue studying
                        </p>
                    </div>
                    <form
                        className="flex flex-col gap-[24px]"
                    >
                        <TextInput
                            label="Email address"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email address"
                        />
                        <div>
                            <PasswordInput
                                label="Password"
                                id="password"
                                name="password"
                                placeholder="Create a password"
                            />
                        </div>
                        <div className="mt-[12px]">
                            <Button
                                type="submit"
                                className="w-full"
                            >
                                Create account
                            </Button>
                        </div>
                        <div className="text-center text-[14px] lg:text-[16px]">Don't have an account? <span className="text-primary hover:underline"><Link to="/register">Register</Link></span></div>
                    </form>
                </div>
            </div>
        </main>
    )
}