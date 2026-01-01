import { data, redirect } from "react-router";
import dbConnect from "~/.server/db";
import { QuestionModel } from "~/lib/models/question";
import { SESSION_STATUS, SessionModel, type IQuestionAttempt, type ISession } from "~/lib/models/session";
import { formatTime } from "~/utils";
import { serializeMongoIds } from "~/utils/serialize";

export async function createQuizSession(userId: string, formData: FormData, request: Request) {

    let mode = formData.get("mode") as string;

    try {
        const conn = await dbConnect();
    }
    catch (error) {
        console.log(error)

        return data({
            error: true,
            message: "An error occured while connecting to the server",
        }, {
            status: 500,
        });
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
            userId,
            mode,
            numberOfQuestions,
            questionAttempts,
        });

        return redirect(`/practice-mode/${session._id}?page=1`);
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
            message: 'An error occured',
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
        const question = await QuestionModel.findById(questionId);

        await SessionModel.updateOne(
            {
                _id: sessionId,
                "questionAttempts.question": questionId,
            },
            {
                $set: {
                    "questionAttempts.$.userAnswer": userAnswer,
                    "questionAttempts.$.isCorrect": userAnswer == question.correctAnswer,
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
}

export async function submitPracticeModeQuiz(sessionId: string) {

    console.log("sessionId", sessionId);
    if (!sessionId) {
        return data({
            success: true,
            message: "Session ID not found",
        }, {
            status: 404,
        });
    }

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
        const session = await SessionModel.findById(sessionId);

        if (!session) {
            return data({
                success: false,
                message: "Session not found"
            }, {
                status: 400,
            });
        }

        // 2️⃣ Check if it has already ended
        if (session.completedAt) {
            return data({
                success: true,
                message: "Quiz has already ended ✅"
            }, {
                status: 200,
            })
        }
        await SessionModel.findByIdAndUpdate(
            sessionId,
            {
                status: SESSION_STATUS.COMPLETED,
                completedAt: new Date(),
            },
            { new: true }
        );

        return redirect(`/practice-mode/${sessionId}/result`)
    }
    catch (error) {
        console.log(error)
        return data({
            status: "error",
            message: 'An error occured',
        }, {
            status: 400
        })
    }
}

export async function practiceModeQuizResult(sessionId: string) {

    if (!sessionId) {
        return data({
            success: true,
            message: "Session ID not found",
        }, {
            status: 404,
        });
    }

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
        const session = await SessionModel.findById(sessionId);

        if (!session) {
            return data({
                success: false,
                message: "Session not found"
            }, {
                status: 400,
            });
        }

        const correctAnswers = session.questionAttempts.filter(data => data.isCorrect).length;

        const wrongAnswers = session.questionAttempts.filter(data => !data.isCorrect).length;

        const unAttemptedQuestions = session.questionAttempts.filter(data => data?.userAnswer === undefined || data.userAnswer === null || data.userAnswer === "").length;

        const totalQuestions = session.numberOfQuestions as number;

        const percentage = Math.round((correctAnswers / totalQuestions) * 100);

        const start = new Date(session.createdAt).getTime();

        const end = new Date(session.completedAt).getTime();

        const timeUsedMs = end - start;

        const attemptedQuestions = totalQuestions - unAttemptedQuestions

        const averageTimeUsed = attemptedQuestions > 0 ? (timeUsedMs / 1000) / attemptedQuestions : 0; 

        return data({
            success: true,
            messsage: "Quiz result fetched.",
            data: {
                unAttemptedQuestions,
                wrongAnswers,
                correctAnswers,
                totalQuestions,
                percentage,
                timeUsed: formatTime(timeUsedMs),
                date: session.completedAt,
                averageTimeUsed: Math.round(averageTimeUsed),
            }
        }, {
            status: 200,
        })
    }
    catch (error) {
        console.log(error)
        return data({
            status: "error",
            message: 'An error occured',
        }, {
            status: 400
        })
    }
}
