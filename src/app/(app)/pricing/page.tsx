import PlanCard from "@/components/pricing/plan-card";
import { pricingPlans } from "@/lib/mock-data";

export default function PricingPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Find the perfect plan</h1>
                <p className="mt-3 text-lg text-muted-foreground">
                    Choose the plan that fits your mining ambitions. Upgrade anytime.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {pricingPlans.map(plan => (
                    <PlanCard key={plan.name} {...plan} />
                ))}
            </div>
        </div>
    )
}
