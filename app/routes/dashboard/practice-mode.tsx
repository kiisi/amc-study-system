import QuestionCard from "~/components/cards/question-card";
import { loadQuizQuestion, validateUserAnswer } from "./action";
import { useSearchParams } from "react-router";


export async function loader({ params, request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");

  const data = await loadQuizQuestion(params.session, page);

  return data;
}

export async function action({
  params,
  request,
}: Route.ActionArgs) {
  let formData = await request.formData();

  console.log("Form Data action trigger", formData)
  console.log("Name: ", formData.get("name"))
  console.log("Age: ", formData.get("message"))

  return await validateUserAnswer(params.session, formData);
}


export default function PracticeMode({ loaderData }) {

  const sessionQuestions = loaderData.data;

  const question = sessionQuestions.question;

  console.log("Question ==>", sessionQuestions)

  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page"));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Practice Mode</h1>
          <p className="text-muted-foreground">Learn with immediate feedback and explanations</p>
        </div>

        <QuestionCard
          questionId={question._id}
          questionNumber={page}
          totalQuestions={sessionQuestions.numberOfQuestions}
          questionText={question.questionText}
          questionImages={question.questionImages}
          subject={question.subject.name}
          options={question.options}
          correctAnswer={question.correctAnswer}
          explanation={question.explanation}
          userAnswer={sessionQuestions.userAnswer}
        />
      </div>
    </div>
  );
}
