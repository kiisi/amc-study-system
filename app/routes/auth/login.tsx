import { CheckCircle2, CircleAlert, GraduationCap } from "lucide-react";
import { data, Link, useFetcher } from "react-router";
import { loginAccount } from "./action";
import { Button } from "../../components/ui/button";
import TextInput from "../../components/ui/text-input";
import PasswordInput from "../../components/ui/password-input";

export async function action({
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();

    console.log(formData.get("mode"))

    return await loginAccount(formData, request)
}

// export async function loader({
//   request,
// }: Route.LoaderArgs) {
//   const session = await getSession(
//     request.headers.get("Cookie"),
//   );
//   console.log("User ID >" ,session.has("userId"));
//   if (session.has("userId")) {
//     // Redirect to the home page if they are already signed in.
//     return redirect("/dashboard");
//   }

//   return data(
//     { error: session.get("error") },
//     {
//       headers: {
//         "Set-Cookie": await commitSession(session),
//       },
//     },
//   );
// }


export default function Login() {

    let fetcher = useFetcher()

    const actionData = fetcher.data

    console.log(actionData)

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
                    <fetcher.Form
                        method="post"
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
                                Login
                            </Button>
                        </div>
                        <div className="text-center text-[14px] lg:text-[16px]">Don't have an account? <span className="text-primary hover:underline"><Link to="/register">Register</Link></span></div>
                    </fetcher.Form>
                </div>
            </div>
        </main>
    )
}