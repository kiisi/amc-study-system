import { Bookmark, Flag, CheckCircle2, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "~/utils";
import { useSearchParams } from "react-router";

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  questionImages: string[];
  subject: string;
  options: { option: string }[];
  correctAnswer?: string;
  selectedAnswer?: number;
  explanation?: string;
  showFeedback?: boolean;
  isBookmarked?: boolean;
  onAnswerSelect?: (index: number) => void;
  onBookmark?: () => void;
  onFlag?: () => void;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  questionImages = [],
  subject,
  options,
  correctAnswer,
  explanation,
}: QuestionCardProps) {

  const alphabets = ['A', 'B', 'C', 'D', 'E'];

  const [selectedAnswer, setSelectedAnswer] = useState<null | string>(null);

  const [_, setSearchParams] = useSearchParams();

  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (value: string) => {
    console.log(value)
    setShowFeedback(true)

    setSelectedAnswer(value)
  };

  console.log("Selected answer", selectedAnswer)

  const isCorrect = showFeedback && selectedAnswer !== null && selectedAnswer === correctAnswer;
  const isWrong = showFeedback && selectedAnswer !== null && selectedAnswer !== correctAnswer;

  console.log("isCorrect", isCorrect)
  console.log("isWrong", isWrong)

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
                Question {questionNumber}/{totalQuestions}
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

          <RadioGroup value={selectedAnswer} onValueChange={(val) => handleSelect(val)}>
            <div className="space-y-3">
              {options.map((option, index) => {
                const isThisCorrect = showFeedback && option.option === correctAnswer;
                const isThisSelected = selectedAnswer === option.option;
                const isThisWrong = showFeedback && isThisSelected && option.option !== correctAnswer;

                console.log(isThisWrong)

                return (
                  <div
                    key={index}
                    className={cn("flex items-start space-x-3 p-4 rounded-md border-2 transition-colors", isThisSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover-elevate', isThisCorrect && 'border-success bg-success/5', isThisWrong && "border-error bg-error/5",)}
                    data-testid={`option-${index}`}
                  >

                    <div className="flex gap-[6px] items-center">
                      <RadioGroupItem
                        value={option.option}
                        id={`option-${index}`}
                        disabled={showFeedback}
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
                    {showFeedback && isThisCorrect && (
                      <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                    )}
                    {showFeedback && isThisWrong && (
                      <XCircle className="w-6 h-6 text-error flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </RadioGroup>

          {showFeedback && explanation && (
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
          // disabled={}
          data-testid="button-previous"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {showFeedback && (
          <Button
            // disabled={currentIndex === mockQuestions.length - 1}
            data-testid="button-next"
            onClick={() => setSearchParams({ page: String(questionNumber + 1) })}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </>
  );
}
