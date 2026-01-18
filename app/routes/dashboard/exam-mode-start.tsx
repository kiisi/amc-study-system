import { AlertTriangle, ArrowLeft, ArrowRight, CircleAlert, Loader2, X } from "lucide-react";
import { useFetcher, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { createExamQuizSession } from "./action";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getSession } from "~/.server/sessions";
import { redirect } from "react-router";

export async function action({
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();

    formData.append("mode", "exam");

    const session = await getSession(
        request.headers.get("Cookie"),
    );

    if (!session.has("userId")) {
        // Redirect to the home page if they are already signed in.
        return redirect("/login");
    }

    return await createExamQuizSession(session.get("userId")!, formData, request);
}

export default function ExamModeStart() {

    const navigate = useNavigate();

    let fetcher = useFetcher();

    const fetcherData = fetcher.data

    const [showConfirm, setShowConfirm] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleExit = () => {
        navigate('/dashboard')
    }

    return (
        <>
            <div className="min-h-screen bg-background grid place-items-center">
                <fetcher.Form method="post" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold mb-2">Start Exam Mode</h1>
                        <p className="text-muted-foreground my-6 text-[14.5px]">You’re about to begin an exam session. Once started, the session will run continuously without pauses, and your final score will be recorded. Are you ready to proceed?</p>
                    </div>

                    <div className="mb-6">
                        <Label className="mb-4">No. of questions</Label>
                        <Input
                            name="numberOfQuestions"
                            min={75}
                            max={150}
                            placeholder="Min of 75 and Max of 150"
                        />
                    </div>
                    {
                        fetcherData?.error && (
                            <div className="flex gap-2 min-h-[60px] w-full rounded-[8px] border-red border-1 p-2">
                                <div className="pt-[2px]">
                                    <CircleAlert className="h-5 w-5 text-red" />
                                </div>
                                <div>
                                    <h2 className="text-red font-medium text-[14.5px]">Error!</h2>
                                    <p className="text-red text-[13.5px]">{fetcherData.message}</p>
                                </div>
                            </div>
                        )
                    }
                    <div className="flex sm:items-center gap-2 sm:gap-4 justify-between flex-row-reverse">
                        <Button
                            type="submit"
                            data-testid="button-next"
                            className="flex-1"
                            isLoading={fetcher.state === "submitting"}
                        >
                            Proceed
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleExit}
                            data-testid="button-previous"
                            className="flex-1"
                            type="button"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Exit
                        </Button>
                    </div>
                </fetcher.Form>
            </div>
        </>
    );
}