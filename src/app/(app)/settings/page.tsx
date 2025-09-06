
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSaveChanges = () => {
        toast({
            title: "Settings Saved",
            description: "Your new settings have been successfully saved.",
        });
    }

    const handleSendFeedback = () => {
        toast({
            title: "Feedback Sent",
            description: "Thank you for your feedback!",
        });
    }

    if (!mounted) {
        return null; // or a loading skeleton
    }

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold">Settings</h1>
            
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update your personal information and profile picture.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            {/* Placeholder for Avatar */}
                            <span className="text-2xl font-bold">U</span>
                        </div>
                        <Button variant="outline">Change Picture</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue="User" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue="user@simu.mine" readOnly />
                        </div>
                    </div>
                    <Button onClick={handleSaveChanges}>Save Profile</Button>
                </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>Customize the look and feel of the app.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup value={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
                        <Label htmlFor="light" className="flex flex-col items-center gap-2 -m-2 p-2 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                             <RadioGroupItem value="light" id="light" className="sr-only" />
                             <div className="w-full rounded-md border-2 border-muted bg-popover p-2 hover:border-accent">
                                <div className="space-y-2 rounded-sm bg-background p-2">
                                    <div className="space-y-2 rounded-md bg-muted p-2 shadow-sm"><div className="h-2 w-4/5 rounded-lg bg-muted-foreground"></div><div className="h-2 w-full rounded-lg bg-muted-foreground"></div></div>
                                    <div className="flex items-center space-x-2 rounded-md bg-muted p-2 shadow-sm"><div className="h-4 w-4 rounded-full bg-muted-foreground"></div><div className="h-2 w-full rounded-lg bg-muted-foreground"></div></div>
                                    <div className="flex items-center space-x-2 rounded-md bg-muted p-2 shadow-sm"><div className="h-4 w-4 rounded-full bg-muted-foreground"></div><div className="h-2 w-full rounded-lg bg-muted-foreground"></div></div>
                                </div>
                            </div>
                            <span>Light</span>
                        </Label>
                         <Label htmlFor="dark" className="flex flex-col items-center gap-2 -m-2 p-2 rounded-lg cursor-pointer hover:bg-accent/50 transition-colors">
                             <RadioGroupItem value="dark" id="dark" className="sr-only" />
                             <div className="w-full rounded-md border-2 border-muted bg-popover p-2 hover:border-accent">
                                <div className="space-y-2 rounded-sm bg-slate-950 p-2">
                                    <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm"><div className="h-2 w-4/5 rounded-lg bg-slate-400"></div><div className="h-2 w-full rounded-lg bg-slate-400"></div></div>
                                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm"><div className="h-4 w-4 rounded-full bg-slate-400"></div><div className="h-2 w-full rounded-lg bg-slate-400"></div></div>
                                    <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm"><div className="h-4 w-4 rounded-full bg-slate-400"></div><div className="h-2 w-full rounded-lg bg-slate-400"></div></div>
                                </div>
                            </div>
                             <span>Dark</span>
                        </Label>
                         <Label htmlFor="system" className="flex items-center space-x-2 cursor-pointer">
                            <RadioGroupItem value="system" id="system" />
                            <span>System</span>
                        </Label>
                    </RadioGroup>
                </CardContent>
            </Card>

             <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications from MineR.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive summaries and alerts via email.</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="mining-alerts">Mining Alerts</Label>
                            <p className="text-sm text-muted-foreground">Get notified when a mining session completes.</p>
                        </div>
                        <Switch id="mining-alerts" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label htmlFor="price-alerts">Price Alerts</Label>
                            <p className="text-sm text-muted-foreground">Notify me of significant price movements.</p>
                        </div>
                        <Switch id="price-alerts" />
                    </div>
                    <Button onClick={handleSaveChanges}>Save Notifications</Button>
                </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle>Feedback & Support</CardTitle>
                    <CardDescription>Have a question or suggestion? Let us know.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="feedback">Your Message</Label>
                        <Textarea id="feedback" placeholder="Type your feedback here..." rows={4} />
                    </div>
                    <Button onClick={handleSendFeedback}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Feedback
                    </Button>
                    <Separator className="my-6" />
                    <div className="text-sm text-muted-foreground">
                        <p>For urgent issues, please email us at <a href="mailto:support@simu.mine" className="text-primary underline">support@simu.mine</a>.</p>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
