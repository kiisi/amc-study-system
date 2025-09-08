import { GraduationCap } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import PasswordInput from "~/components/ui/password-input";
import TextInput from "~/components/ui/text-input";

export default function Register() {
    return (
        <main className="min-h-screen bg-whitesmoke grid place-items-center py-10">
            <div className="w-full max-w-[526px]">
                <header className="grid place-items-center mb-[32px]">
                    <Link to="/" className="flex items-center">
                        <GraduationCap className="text-primary text-2xl mr-3" />
                        <h1 className="text-xl font-bold text-foreground">AMC</h1>
                    </Link>
                </header>
                <div className="bg-white rounded-[12px] p-[32px] md:p-[40px]">
                    <div className="mb-[40px] text-center">
                        <h1 className="font-bold text-[24px] md:text-[32px] mb-[8px] font-secondary">Register</h1>
                        <p className="text-gray-alt">
                            Create your account and start your study journey.
                        </p>
                    </div>
                    <form
                        className="flex flex-col gap-[24px]"
                    >
                        <TextInput
                            label="First Name"
                            id="firstName"
                            name="firstName"
                            type="text"
                            placeholder="Enter your first name"
                        />
                        <TextInput
                            label="Last Name"
                            id="lastName"
                            name="lastName"
                            type="text"
                            placeholder="Enter your last name"
                        />
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
                        <div className="text-center">Already an account? <br className="md:hidden" /> <span className="text-primary hover:underline"><Link to="/login">Login</Link></span></div>
                    </form>
                </div>
            </div>
        </main>
    )
}