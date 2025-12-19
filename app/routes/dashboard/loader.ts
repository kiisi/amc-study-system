import type { Session } from "react-router";
import { redirect } from "react-router";
import { data } from "react-router";
import dbConnect from "~/.server/db";
import { destroySession } from "~/.server/sessions";
import { SessionModel } from "~/lib/models/session";
import { UserModel } from "~/lib/models/user";
import { serializeMongoIds } from "~/utils/serialize";

export async function loadDashboardInfo(userId: string, activeSession: Session): Promise<any>{

    try {
        const conn = await dbConnect();
    }
    catch (error) {
        console.log(error)
        return data({
            success: false,
            message: 'An error occured while connecting to the server',
        },{
            status: 200,
        })
    }

    try {
        const session = await SessionModel.findById(userId);
        const dbUser = serializeMongoIds(await UserModel.findById(userId).lean());

        if (!dbUser) {
            return redirect("/login", {
                headers: {
                    "Set-Cookie": await destroySession(activeSession),
                },
            });
        }

        const { password, ...user } = dbUser;

        if (!session) {
            return data({
                success: false,
                message: "Dashboard info loaded",
                data: {
                    user,
                }
            }, {
                status: 200,
            });
        }

        return data({
            success: true,
            messsage: "Dashboard data loaded",
            data: {
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
