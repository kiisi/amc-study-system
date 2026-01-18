import { Bookmark, Flag, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "~/utils";
import { useFetcher, useNavigate, useNavigation, useSearchParams } from "react-router";

interface ExamQuestionCardProps {
    questionId: string;
    questionNumber: number;
    totalQuestions: number;
    questionText: string;
    questionImages: string[];
    subject: string;
    options: { option: string }[];
    correctAnswer?: string;
    selectedAnswer?: number;
    userAnswer?: string;
    showFeedback?: boolean;
    isBookmarked?: boolean;
    isFlagged?: boolean;
    onAnswerSelect?: (index: number) => void;
}

export default function ExamQuestionCard({
    questionId,
    questionNumber,
    totalQuestions,
    questionText,
    questionImages = [],
    subject,
    options,
    correctAnswer,
    userAnswer,
    isBookmarked,
    isFlagged,
}: ExamQuestionCardProps) {

    const navigation = useNavigation();

    const navigate = useNavigate();

    const fetcher = useFetcher();

    console.log(fetcher)

    const isNavigating = Boolean(navigation.location);

    const alphabets = ['A', 'B', 'C', 'D', 'E'];

    const [selectedAnswer, setSelectedAnswer] = useState<null | string>(null);

    const [_, setSearchParams] = useSearchParams();

    const [showFeedback, setShowFeedback] = useState(false);

    const handleSelect = (value: string) => {
        console.log("Handle select", value)
        setShowFeedback(true)

        setSelectedAnswer(value)

        fetcher.submit(
            { questionId, userAnswer: value },
            { method: "post" }
        );
    };

    const bookmarkQuestionHandler = () => {
        fetcher.submit(
            { questionId, intent: "bookmark" },
            { method: "patch" }
        );
    };

    const flagQuestionHandler = () => {
        fetcher.submit(
            { questionId, intent: "flag" },
            { method: "patch" }
        );
    };

    const handleSubmit = () => {
        fetcher.submit(
            { intent: "submit" },
            { method: "post" }
        );
    };

    const correctOptionAlphabet = options?.findIndex(item => item.option === correctAnswer);

    useEffect(() => {
        setSelectedAnswer(null)
        setShowFeedback(false)
    }, [questionNumber])

    return (
        <>
            <Card className="w-full max-w-4xl mx-auto" data-testid="card-question">
                <CardHeader className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground" data-testid="text-question-counter">
                                Question {questionNumber}/{totalQuestions ?? 0}
                            </span>
                            <Badge variant="secondary" data-testid="badge-subject">{subject}</Badge>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={bookmarkQuestionHandler}
                                data-testid="button-bookmark"
                                className="hover:bg-black/10 hover:text-primary"
                            >
                                <Bookmark className={cn("w-5 h-5", isBookmarked ? 'fill-primary text-primary stroke-primary' : '')} />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={flagQuestionHandler}
                                data-testid="button-flag"
                                className="hover:bg-black/10 hover:text-red-500"
                            >
                                <Flag className={cn("w-5 h-5", isFlagged ? "fill-red-500 stroke-red-500" : "")} />
                            </Button>
                        </div>
                    </div>
                    <CardTitle className="text-[16px] md:text-[18px] font-normal leading-relaxed" data-testid="text-question">
                        {questionText}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    {
                        questionImages.length > 0 && (
                            <div>
                                {
                                    questionImages.map((questionImage, index) => (
                                        <div key={index}>
                                            <img
                                                src={questionImage}
                                                alt="Question illustration"
                                                className="rounded-lg max-h-96 object-contain"
                                                data-testid="img-question"
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        )
                    }

                    <RadioGroup value={userAnswer ?? selectedAnswer} onValueChange={(val) => handleSelect(val)}>
                        <div className="space-y-3">
                            {options.map((option, index) => {
                                const isThisSelected = (selectedAnswer ?? userAnswer) === option.option;

                                return (
                                    <div
                                        key={index}
                                        className={cn("flex items-start space-x-3 p-4 rounded-md border-2 transition-colors", isThisSelected
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover-elevate',
                                        )}
                                        data-testid={`option-${index}`}
                                    >

                                        <div className="flex gap-[6px] items-center">
                                            <RadioGroupItem
                                                value={option.option}
                                                id={`option-${index}`}
                                                disabled={showFeedback || !!userAnswer}
                                            />
                                            <div className="font-normal leading-[140%]">
                                                {alphabets[index]}
                                            </div>
                                        </div>
                                        <Label
                                            htmlFor={`option-${index}`}
                                            className="flex-1 text-[17px] cursor-pointer font-normal leading-[140%]"
                                        >
                                            {option.option}
                                        </Label>
                                    </div>
                                );
                            })}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    disabled={Number(questionNumber) == 1}
                    data-testid="button-previous"
                    type="button"
                    onClick={() => setSearchParams({ page: String(questionNumber - 1) })}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>

                {(Boolean(userAnswer) || showFeedback) && Number(questionNumber) < Number(totalQuestions) && (
                    <Button
                        // disabled={currentIndex === mockQuestions.length - 1}
                        data-testid="button-next"
                        onClick={() => setSearchParams({ page: String(questionNumber + 1) })}
                        isLoading={isNavigating}
                        disabled={isNavigating}
                        className="min-w-[125px]"
                    // type="button"
                    >
                        Continue
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}

                {Number(questionNumber) === Number(totalQuestions) && (
                    <Button
                        data-testid="button-next"
                        isLoading={isNavigating}
                        disabled={isNavigating}
                        className="min-w-[125px]"
                        type="submit"
                        onClick={handleSubmit}
                    >
                        Submit
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </>
    );
}
