import AuthForm from "@/components/auth/auth-form";
import { Pickaxe } from "lucide-react";

export default function AuthPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="flex items-center gap-3 mb-8">
                 <Pickaxe className="h-10 w-10 text-primary" />
                 <h1 className="text-4xl font-bold text-primary">MineR</h1>
            </div>
            <AuthForm />
        </div>
    )
}
