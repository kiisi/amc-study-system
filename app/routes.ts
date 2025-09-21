import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/landing.tsx"),
    route("/login", "./routes/auth/login.tsx"),
    route("/register", "./routes/auth/register.tsx"),
    layout("./layouts/dashboard-layout.tsx", [
        route("dashboard", "./routes/dashboard/index.tsx"),
        route("admin-panel", "./routes/admin-panel/index.tsx"),
        route("subjects", "./routes/admin-panel/subjects.tsx"),
    ])
] satisfies RouteConfig;
