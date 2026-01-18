import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/landing.tsx"),
    route("/login", "./routes/auth/login.tsx"),
    route("/register", "./routes/auth/register.tsx"),
    layout("./layouts/dashboard-layout.tsx", [
        route("dashboard", "./routes/dashboard/index.tsx"),
        route("practice-mode/:session", "./routes/dashboard/practice-mode.tsx"),
        route("practice-mode/:session/result", "./routes/dashboard/practice-mode-result.tsx"),
        route("practice-mode-start", "./routes/dashboard/practice-mode-start.tsx"),
        route("exam-mode-start", "./routes/dashboard/exam-mode-start.tsx"),
        route("exam-mode/:session", "./routes/dashboard/exam-mode.tsx"),
        route("exam-mode/:session/result", "./routes/dashboard/exam-mode-result.tsx"),

        route("test", "./routes/dashboard/test.tsx"),
        route("test2", "./routes/dashboard/test2.tsx"),
        route("test3", "./routes/dashboard/test3.tsx"),
        route("admin-panel", "./routes/admin-panel/index.tsx"),
        route("subjects", "./routes/admin-panel/subjects.tsx"), 
    ])
] satisfies RouteConfig;
