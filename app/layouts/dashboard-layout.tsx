import { redirect } from "react-router";
import { destroySession, getSession } from "~/.server/sessions";
import type { Route } from "../+types/root";

async function authMiddleware(
    { request }: { request: Request },
    next: () => Promise<Response>,
): Promise<Response> {
    console.log("START<-----Dashboard middleware----->START")

    const session = await getSession(
        request.headers.get("Cookie"),
    );

    const token = session.get("token")
    console.log("Token ", token);

    console.log(session.get("userId"));

    if (!token) {
        throw redirect("/login", {
            headers: {
                "Set-Cookie": await destroySession(session),
            },
        });
    }

    console.log("END<-----Dashboard middleware----->END")

    return next();
}

export const middleware: Route.MiddlewareFunction[] = [
    authMiddleware,
];

export function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}