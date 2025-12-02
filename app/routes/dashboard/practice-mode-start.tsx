import { ArrowLeft, ArrowRight } from "lucide-react";
import { useActionData, useFetcher, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { createQuizSession } from "./action";
import { useEffect } from "react";
import { error } from "~/components/ui/toast";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export async function action({
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();

    formData.append("mode", "practice");

    return await createQuizSession(formData, request);
}


export default function PracticeModeStart() {

    const navigate = useNavigate();

    let fetcher = useFetcher();

    console.log(fetcher)

    const handleExit = () => {
        navigate('/dashboard')
    }

    // useEffect(() => {
    //     console.log(fetcher)
    //     if(fetcher?.data?.status === "error"){
    //         error(fetcher.data.message);
    //     }
    // }, [fetcher?.data?.status])

    // if(fetcher?.data?.status === "error"){
    //         error(fetcher.data.message);
    // }

    // useEffect(() => {
    //     if (!actionData) return;

    //     if (actionData.error) {
    //         toast.error(actionData.message);
    //     }

    //     if (actionData.success) {
    //         toast.success(actionData.message);
    //     }
    // }, [actionData]);

    return (
        <div className="min-h-screen bg-background grid place-items-center">
            <fetcher.Form method="post" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold mb-2">Start Practice Mode</h1>
                    <p className="text-muted-foreground text-[14px]">Learn with immediate feedback and explanations</p>

                    <p className="text-muted-foreground my-6">Let’s go! Once you start, the practice session will begin immediately and can’t be paused. Are you sure you’re ready to dive in?</p>
                </div>

                <div className="mb-6">
                    <Label className="mb-4">No. of questions</Label>
                    <Input
                        name="numberOfQuestions"
                        min={25}
                        max={150}
                        placeholder="Min of 25 and Max of 150"
                    />
                </div>

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
    );
}
