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
        const dbUser = serializeMongoIds(await UserModel.findById(userId).lean());

        if (!dbUser) {
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(activeSession),
                },
            });
        }

        const sessions = await SessionModel.find({ userId }).lean();

        let numberOfQuestionsAttempted = 0;
        let numberOfBookmarkedQuestions = 0;
        let numberOfFlaggedQuestions = 0;
        let totalNumberOfQuestions = 0;
        let totalNumberOfCorrectAnswers = 0;
        let totalNumberOfIncorrectAnswers = 0;

        // Group attempts by ISO date for chronological sorting
        const attemptsByDate: Record<string, number> = {};

        sessions.forEach((session) => {
            totalNumberOfQuestions += session.numberOfQuestions as number;

            totalNumberOfCorrectAnswers += session.questionAttempts.filter(data => data.isCorrect).length;

            // ISO date key (YYYY-MM-DD) for reliable sorting
            const isoDate = new Date(session.createdAt).toISOString().split('T')[0];


            session.questionAttempts.forEach((question) => {
                if (question.userAnswer) {
                    numberOfQuestionsAttempted += 1;
                    attemptsByDate[isoDate] = (attemptsByDate[isoDate] || 0) + 1;
                }

                if (!question.isCorrect) {
                    totalNumberOfIncorrectAnswers += 1;
                }

                if (question.isBookmarked) {
                    numberOfBookmarkedQuestions += 1;
                }

                if (question.isFlagged) {
                    numberOfFlaggedQuestions += 1;
                }
            })
        });

        const percentage = totalNumberOfQuestions == 0 ? 0 : (totalNumberOfCorrectAnswers / totalNumberOfQuestions) * 100;

        // Area chart: sorted oldest → newest, display-formatted labels
        const quizAttemptTrend = Object.entries(attemptsByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([iso, count]) => ({
                time: new Date(iso + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: count,
                date: iso,
            }));

        // Donut chart data
        const questionBreakdown = [
            { name: "Correct Answers", value: totalNumberOfCorrectAnswers },
            { name: "Incorrect Answers", value: totalNumberOfIncorrectAnswers },
            { name: "Bookmarked", value: numberOfBookmarkedQuestions },
            { name: "Flagged", value: numberOfFlaggedQuestions },
        ];

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
                flagged: numberOfFlaggedQuestions,
                quizAttemptTrend,
                questionBreakdown,
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