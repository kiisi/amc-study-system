import type { Session } from "react-router";
import { redirect } from "react-router";
import { data } from "react-router";
import dbConnect from "~/.server/db";
import { destroySession } from "~/.server/sessions";
import { SessionModel } from "~/lib/models/session";
import { UserModel } from "~/lib/models/user";
import { serializeMongoIds } from "~/utils/serialize";

export async function loadDashboardInfo(userId: string, activeSession: Session): Promise<any> {

    try {
        const conn = await dbConnect();
    }
    catch (error) {
        console.log(error)
        return data({
            success: false,
            message: 'An error occured while connecting to the server',
        }, {
            status: 200,
        })
    }

    try {
        const sessions = await SessionModel.find({ userId }).lean();

        let numberOfQuestionsAttempted = 0;
        let numberOfBookmarkedQuestions = 0;
        let totalNumberOfQuestions = 0;
        let totalNumberOfCorrectAnswers = 0;

        sessions.forEach((session) => {
            totalNumberOfQuestions += session.numberOfQuestions as number;

            totalNumberOfCorrectAnswers += session.questionAttempts.filter(data => data.isCorrect).length;

            session.questionAttempts.forEach((question) => {
                if (question.userAnswer) {
                    numberOfQuestionsAttempted += 1;
                }

                if (question.isBookmarked) {
                    numberOfBookmarkedQuestions += 1;
                }
            })
        });

        const percentage = totalNumberOfQuestions == 0 ? 0 : (totalNumberOfCorrectAnswers / totalNumberOfQuestions) * 100;
        
        const dbUser = serializeMongoIds(await UserModel.findById(userId).lean());

        if (!dbUser) {
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(activeSession),
                },
            });
        }

        const { password, ...user } = dbUser;

        return data({
            success: true,
            messsage: "Dashboard data loaded",
            data: {
                firstName: user.firstName,
                sessions: sessions.length,
                questionsAttempted: numberOfQuestionsAttempted,
                overallAccuracy: Math.round(percentage),
                bookmarked: numberOfBookmarkedQuestions,
            }
        }, {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            }
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

// PRACTICE MODE
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
                ...questionAttemptPage[0],
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

        const questionWithoutAnswer = questionAttemptPage[0];

        const payload = {
            mode: sessionQuestions.mode,
            numberOfQuestions: sessionQuestions.numberOfQuestions,
            ...questionWithoutAnswer,
            question: {
                ...questionWithoutAnswer.question,
                correctAnswer: undefined,
                explanation: undefined,

            },
        }

        return Response.json({
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

// EXAM MODE
export async function loadExamQuizQuestion(sessionId: string, page: string | null) {
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

        const questionWithoutAnswer = questionAttemptPage[0];

        const payload = {
            mode: sessionQuestions.mode,
            numberOfQuestions: sessionQuestions.numberOfQuestions,
            ...questionWithoutAnswer,
            isCorrect: undefined,
            question: {
                ...questionWithoutAnswer.question,
                correctAnswer: undefined,
                explanation: undefined,

            },
        }

        return Response.json({
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