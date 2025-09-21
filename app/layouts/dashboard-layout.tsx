import { redirect } from "react-router";
import { destroySession, getSession } from "~/.server/sessions";
import type { Route } from "../+types/root";

export function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}

async function authMiddleware(
    { request }: { request: Request },
    next: () => Promise<Response>,
): Promise<Response> {
    console.log("START<-----Dashboard middleware----->START")

    const session = await getSession(
        request.headers.get("Cookie"),
    );

    const token = session.get("token")

    if (!token) {
        return redirect("/login", {
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