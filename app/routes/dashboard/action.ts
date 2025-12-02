import { data, redirect } from "react-router";
import dbConnect from "~/.server/db";
import { QuestionModel } from "~/lib/models/question";
import { SessionModel } from "~/lib/models/session";

export async function createQuizSession(formData: FormData, request: Request) {

    let mode = formData.get("mode") as string;

    try {
        const conn = await dbConnect();
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }

    let numberOfQuestions = formData.get("numberOfQuestions") as string;

    console.log(Number(numberOfQuestions));

    if (Number(numberOfQuestions ?? 0) < 25) {
        return data({
            error: true,
            message: "Minimum number of questions is 25",
        }, {
            status: 400,
        });
    }

    if (Number(numberOfQuestions ?? 0) > 150) {
        return data({
            error: true,
            message: "Maximum number of questions is 150",
        }, {
            status: 400,
        });
    }

    try {
        const session = await SessionModel.create({ mode, numberOfQuestions })

        return redirect(`/practice-mode/${session._id}?page=${Number(session.currentIndex) + 1}`);
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }
}

export async function loadQuizQuestion(sessionId, page: string) {
    try {
        const conn = await dbConnect();
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }

    try {
        const pageNumber = Number(page ?? 1); // e.g. ?page=2
        const limit = 1;
        const skip = (pageNumber - 1) * limit;

        const question = await QuestionModel.findOne().skip(skip).limit(1).populate("subject").lean();

        console.log(question)

        return {
            status: "success",
            data: question,
        }
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }
}