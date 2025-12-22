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

        const percentage = (totalNumberOfCorrectAnswers / totalNumberOfQuestions) * 100;

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
                overallAccuracy: percentage,
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
