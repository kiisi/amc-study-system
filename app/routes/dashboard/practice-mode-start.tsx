import { AlertTriangle, ArrowLeft, ArrowRight, Loader2, X } from "lucide-react";
import { useActionData, useFetcher, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { createQuizSession } from "./action";
import { useEffect, useState } from "react";
import { error } from "~/components/ui/toast";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { getSession } from "~/.server/sessions";
import { redirect } from "react-router";

export async function action({
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();

    formData.append("mode", "practice");

    const session = await getSession(
        request.headers.get("Cookie"),
    );

    if (!session.has("userId")) {
        // Redirect to the home page if they are already signed in.
        return redirect("/login");
    }

    return await createQuizSession(session.get("userId")!, formData, request);
}

export default function PracticeModeStart() {

    const navigate = useNavigate();

    let fetcher = useFetcher();

    const [showConfirm, setShowConfirm] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

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
        <>
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
        </>
    );
}

const SimpleConfirmDialog = ({
    isOpen = false,
    onClose = () => { },
    onConfirm = () => { },
    isLoading = false,
    title = "Submit Quiz?",
    message = "Are you sure you want to submit your quiz? This action cannot be undone.",
    confirmText = "Submit Quiz",
    cancelText = "Cancel",
    type = "warning" // warning, danger, info
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'danger':
                return {
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    confirmBg: 'bg-red-600 hover:bg-red-700',
                    confirmFocus: 'focus:ring-red-500'
                };
            case 'info':
                return {
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    confirmBg: 'bg-blue-600 hover:bg-blue-700',
                    confirmFocus: 'focus:ring-blue-500'
                };
            default: // warning
                return {
                    iconBg: 'bg-amber-100',
                    iconColor: 'text-amber-600',
                    confirmBg: 'bg-blue-600 hover:bg-blue-700',
                    confirmFocus: 'focus:ring-blue-500'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    {/* Content */}
                    <div className="px-4 pt-5 pb-4 sm:p-6">
                        <div className="sm:flex sm:items-start">
                            {/* Icon */}
                            <div className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${styles.iconBg} sm:mx-0 sm:h-10 sm:w-10`}>
                                <AlertTriangle className={`h-6 w-6 ${styles.iconColor}`} />
                            </div>

                            {/* Text */}
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`inline-flex w-full justify-center items-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm ${styles.confirmBg} ${styles.confirmFocus} focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:ml-3 sm:w-auto`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                confirmText
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 sm:mt-0 sm:w-auto"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
