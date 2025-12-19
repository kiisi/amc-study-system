import { GraduationCap } from "lucide-react";
import { Link } from "react-router";

export default function BrandLogo({ to }: { to?: string }) {
    return (
        <Link to={to ?? "/"} className="flex items-center">
            <GraduationCap className="text-primary text-2xl mr-3" />
            <h1 className="text-xl font-semibold text-foreground">AMC <span className="hidden lg:inline">Study System</span></h1>
        </Link>
    )
}