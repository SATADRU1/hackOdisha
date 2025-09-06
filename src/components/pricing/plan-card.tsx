import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanCardProps {
  name: string;
  price: string;
  duration: string;
  features: string[];
  recommended: boolean;
  buttonLabel: string;
}

export default function PlanCard({ name, price, duration, features, recommended, buttonLabel }: PlanCardProps) {
  return (
    <Card className={cn("flex flex-col bg-card/50 backdrop-blur-lg border-border/50", recommended && "border-primary shadow-lg shadow-primary/20")}>
      {recommended && (
        <div className="bg-primary text-primary-foreground text-center text-sm font-bold py-1 rounded-t-lg">
          Most Popular
        </div>
      )}
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription>{duration} of mining</CardDescription>
        <div className="pt-4">
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-muted-foreground">/month</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map(feature => (
            <li key={feature} className="flex items-center">
              <Check className="h-5 w-5 text-primary mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant={recommended ? "default" : "outline"}>
          {buttonLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}
