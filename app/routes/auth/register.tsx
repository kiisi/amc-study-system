import { CheckCircle2, CircleAlert, GraduationCap } from "lucide-react";
import { Link, useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import PasswordInput from "~/components/ui/password-input";
import TextInput from "~/components/ui/text-input";
import type { Route } from "./+types/login";
import { registerAccount } from "./action";

export async function action({
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();

    return await registerAccount(formData, request)
}


export default function Register() {

    let fetcher = useFetcher()

    const actionData = fetcher.data


    return (
        <main className="min-h-screen bg-[#f4f5f6] grid place-items-center px-4 py-10">
            <div className="w-full max-w-[526px]">
                <header className="grid place-items-center mb-[32px]">
                    <Link to="/" className="flex items-center">
                        <GraduationCap className="text-primary text-2xl mr-2" />
                        <h1 className="text-xl font-bold text-foreground">AMC</h1>
                    </Link>
                </header>
                <div className="bg-white rounded-[12px] px-4 lg:px-[32px] py-[32px] md:p-[40px]">
                    <div className="mb-[40px] text-center">
                        <h1 className="font-bold text-[24px] md:text-[32px] mb-[8px] font-secondary">Register</h1>
                        <p className="text-gray-alt">
                            Create your account and start your study journey.
                        </p>
                    </div>
                    <fetcher.Form
                        method="post"
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
                        {
                            actionData?.status === "error" && (
                                <div className="flex gap-2 min-h-[60px] w-full rounded-[8px] border-red border-1 p-2">
                                    <div className="pt-[2px]">
                                        <CircleAlert className="h-5 w-5 text-red" />
                                    </div>
                                    <div>
                                        <h2 className="text-red font-medium text-[14.5px]">Error!</h2>
                                        <p className="text-red text-[13.5px]">{actionData.message}</p>
                                    </div>
                                </div>
                            )
                        }
                        {
                            actionData?.status === "success" && (
                                <div className="flex gap-2 min-h-[60px] w-full rounded-[8px] border-green-500 border-1 p-2">
                                    <div className="pt-[2px]">
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-green-500 font-medium text-[14.5px]">Success!</h2>
                                        <p className="text-green-500 text-[13.5px]">{actionData.message}</p>
                                    </div>
                                </div>
                            )
                        }
                        <div className="mt-[12px]">
                            <Button
                                isLoading={fetcher.state === "submitting"}
                                type="submit"
                                className="w-full"
                            >
                                Create account
                            </Button>
                        </div>
                        <div className="text-center text-[14px] lg:text-[16px]">Already an account? <span className="text-primary hover:underline"><Link to="/login">Login</Link></span></div>
                    </fetcher.Form>
                </div>
            </div>
        </main>
    )
}