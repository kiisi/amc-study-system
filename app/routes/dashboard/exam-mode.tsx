import { bookmarkQuizQuestion, flagQuizQuestion, submitExamModeQuiz, validateUserExamAnswer } from "./action";
import { useSearchParams } from "react-router";
import ExamQuestionCard from "~/components/cards/exam-question-card";
import { loadExamQuizQuestion } from "./loader";
import { useCountdown } from "~/hooks/use-count-down";


export async function loader({ params, request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const page = url.searchParams.get("page");

    const data = await loadExamQuizQuestion(params.session, page);

    return data;
}

export async function action({
    params,
    request,
}: Route.ActionArgs) {
    let formData = await request.formData();

    const intent = formData.get("intent");

    if (intent == "flag") {
        return await flagQuizQuestion(params.session, formData);
    }

    if (intent == "bookmark") {
        return await bookmarkQuizQuestion(params.session, formData);
    }

    if (intent == "submit") {
        return await submitExamModeQuiz(params.session);
    }

    return await validateUserExamAnswer(params.session, formData);
}

export default function PracticeMode({ loaderData }) {

    const sessionQuestions = loaderData.data;

    const question = sessionQuestions.question;

    const timer = useCountdown(30);

    const format = (n: number) => String(n).padStart(2, "0");

    console.log("Question ==>", sessionQuestions)

    const [searchParams] = useSearchParams();

    const page = Number(searchParams.get("page"));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Exam Mode</h1>
                    <p className="text-muted-foreground">
                        Real exam simulation under standard conditions
                    </p>
                </div>
                <div className="text-right">
                    {format(timer.hours)}: {format(timer.minutes)}: {format(timer.seconds)}
                </div>
                <ExamQuestionCard
                    questionId={question._id}
                    questionNumber={page}
                    totalQuestions={sessionQuestions.numberOfQuestions}
                    questionText={question.questionText}
                    questionImages={question.questionImages}
                    subject={question.subject.name}
                    options={question.options}
                    correctAnswer={question.correctAnswer}
                    userAnswer={sessionQuestions.userAnswer}
                    isFlagged={sessionQuestions.isFlagged}
                    isBookmarked={sessionQuestions.isBookmarked}
                />
            </div>
        </div>
    );
}
