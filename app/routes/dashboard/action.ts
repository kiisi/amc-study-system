import { data, redirect } from "react-router";
import dbConnect from "~/.server/db";
import { QuestionModel } from "~/lib/models/question";
import { SessionModel, type IQuestionAttempt, type ISession } from "~/lib/models/session";
import { serializeMongoIds } from "~/utils/serialize";

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

        const questions = await QuestionModel.aggregate([
            { $sample: { size: Number(numberOfQuestions) } }
        ]);

        const questionAttempts: IQuestionAttempt[] = []

        for (let question of questions) {
            questionAttempts.push({ question } as IQuestionAttempt);
        }

        const session = await SessionModel.create({
            mode,
            numberOfQuestions,
            questionAttempts,
        });

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
export async function loadQuizQuestion(sessionId: string, page: string | null) {
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

        const sessionQuestions = await SessionModel.findById(sessionId)
            .populate({
                path: "questionAttempts.question",
                populate: { path: "subject" }
            })
            .lean();

        if (!sessionQuestions) return data<any>({
            error: true,
            message: "This page is not available",
        }, {
            status: 400,
        });;

        // 2️⃣ Pick the questionAttempts slice for this page
        console.log(skip, skip + limit)
        const questionAttemptPage = sessionQuestions.questionAttempts.slice(skip, skip + limit);

        if (questionAttemptPage[0]?.userAnswer) {
            const payload = {
                mode: sessionQuestions.mode,
                ...(serializeMongoIds(questionAttemptPage[0])),
                numberOfQuestions: sessionQuestions.numberOfQuestions,
            }

            return data<any>({
                success: true,
                message: "Question loaded successfully",
                data: payload,
            }, {
                status: 200,
            });
        }

        const questionWithoutAnswer = serializeMongoIds(questionAttemptPage[0]);

        const payload = {
            mode: sessionQuestions.mode,
            ...questionWithoutAnswer,
            question: {
                ...questionWithoutAnswer.question,
                correctAnswer: undefined,
                explanation: undefined,

            },
            numberOfQuestions: sessionQuestions.numberOfQuestions,
        }

        return data<any>({
            success: true,
            message: "Question loaded successfully",
            data: payload,
        }, {
            status: 200,
        });
    }
    catch (error) {
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }
}

export async function validateUserAnswer(sessionId: string, formData: FormData) {

    let questionId = formData.get("questionId") as string;
    let userAnswer = formData.get("userAnswer") as string;

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
        const question = await QuestionModel.findOne().populate("subject").lean();

        const session = await SessionModel.updateOne(
            {
                _id: sessionId,
                "questionAttempts.question": questionId,
            },
            {
                $set: {
                    "questionAttempts.$.userAnswer": userAnswer,
                    // "questionAttempts.$.isCorrect": isCorrect,
                },
            }
        );

        return data({
            success: true,
            message: "Submitted",
        }, {
            status: 200,
        });
    }
    catch (error) {
        console.log(error)
        return {
            status: "error",
            message: 'An error occured while connecting to the server',
        }
    }

    // let numberOfQuestions = formData.get("numberOfQuestions") as string;

    // console.log(Number(numberOfQuestions));

    // if (Number(numberOfQuestions ?? 0) < 25) {
    //     return data({
    //         error: true,
    //         message: "Minimum number of questions is 25",
    //     }, {
    //         status: 400,
    //     });
    // }

    // if (Number(numberOfQuestions ?? 0) > 150) {
    //     return data({
    //         error: true,
    //         message: "Maximum number of questions is 150",
    //     }, {
    //         status: 400,
    //     });
    // }

    // try {
    //     const session = await SessionModel.create({ mode, numberOfQuestions })

    //     return redirect(`/practice-mode/${session._id}?page=${Number(session.currentIndex) + 1}`);
    // }
    // catch (error) {
    //     console.log(error)
    //     return {
    //         status: "error",
    //         message: 'An error occured while connecting to the server',
    //     }
    // }

    return data({
        error: true,
        message: "Data success",
    }, {
        status: 200,
    });
}