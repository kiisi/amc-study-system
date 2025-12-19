import { Bookmark, Flag, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "~/utils";
import { Form, useFetcher, useNavigate, useNavigation, useSearchParams } from "react-router";

interface QuestionCardProps {
  questionId: string;
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  questionImages: string[];
  subject: string;
  options: { option: string }[];
  correctAnswer?: string;
  selectedAnswer?: number;
  explanation?: string;
  userAnswer?: string;
  showFeedback?: boolean;
  isBookmarked?: boolean;
  onAnswerSelect?: (index: number) => void;
  onBookmark?: () => void;
  onFlag?: () => void;
}

export default function QuestionCard({
  questionId,
  questionNumber,
  totalQuestions,
  questionText,
  questionImages = [],
  subject,
  options,
  correctAnswer,
  explanation,
  userAnswer,
}: QuestionCardProps) {

  const navigation = useNavigation();

  const navigate = useNavigate();

  const fetcher = useFetcher();

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

  const handleSubmit = () => {
    fetcher.submit(
      { intent: "submit" },
      { method: "post" }
    );
  };

  const isCorrect = selectedAnswer != null ? (showFeedback && selectedAnswer !== null && selectedAnswer === correctAnswer) : (Boolean(userAnswer) && userAnswer === correctAnswer); 

  console.log("Is Correct", isCorrect)
  // const isWrong = showFeedback && selectedAnswer !== null && selectedAnswer !== correctAnswer;

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
                onClick={() => { }}
                data-testid="button-bookmark"
              >
                <Bookmark className={`w-5 h-5 ${false ? 'fill-primary text-primary' : ''}`} />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => { }}
                data-testid="button-flag"
              >
                <Flag className="w-5 h-5" />
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
                const isThisCorrect = (Boolean(userAnswer) || showFeedback) && option.option === correctAnswer;
                const isThisSelected = (selectedAnswer ?? userAnswer) === option.option;
                const isThisWrong = (fetcher.state == "idle") && (Boolean(userAnswer) || showFeedback) && isThisSelected && option.option !== correctAnswer;
                console.log("Fetcher State", fetcher.state, isThisWrong);

                return (
                  <div
                    key={index}
                    className={cn("flex items-start space-x-3 p-4 rounded-md border-2 transition-colors", isThisSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover-elevate', 
                      isThisCorrect && 'border-success bg-success/5', 
                      isThisWrong && "border-error bg-error/5"
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
                    {(Boolean(userAnswer) || showFeedback) && isThisCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    )}
                    {(Boolean(userAnswer) || showFeedback) && isThisWrong && (
                      <XCircle className="w-6 h-6 text-error flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </RadioGroup>

          {(Boolean(userAnswer) || showFeedback) && explanation && (
            <Card className="bg-muted/50" data-testid="card-explanation">
              <CardContent className="p-4 md:p-6 space-y-2">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-error" />
                  )}
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h4>
                <h2 className="text-[24px] my-5 font-semibold">Option is {alphabets[correctOptionAlphabet]} correct</h2>
                <div
                  className="text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: explanation }}
                />
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={Number(questionNumber) == 1}
          data-testid="button-previous"
          type="button"
          onClick={ () => setSearchParams({ page: String(questionNumber - 1) })}
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
