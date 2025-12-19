import { LogOutIcon, LucideLogOut } from "lucide-react";
import BrandLogo from "./core/brand-logo";
import { Button } from "./ui/button";

export default function NavBar() {
    return (
        <header className="bg-card shadow-sm border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <BrandLogo to="/dashboard" />
                    <div className="flex items-center space-x-4">
                        <Button
                            data-testid="button-logout-header"
                        >
                            <LucideLogOut />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}