'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Settings, Zap, Thermometer, Cpu } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface MiningControlProps {
    onConfigurationChange?: (config: any) => void;
}

export function MiningControl({ onConfigurationChange }: MiningControlProps) {
    const [config, setConfig] = useState({
        pool: 'stratum+tcp://pool.gofr.com:4444',
        algorithm: 'sha256',
        intensity: 75,
        autoStart: false,
        temperatureLimit: 80,
        powerLimit: 100
    });
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    const handleConfigChange = (field: string, value: any) => {
        const newConfig = { ...config, [field]: value };
        setConfig(newConfig);
        onConfigurationChange?.(newConfig);
    };

    const handleSaveConfiguration = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/gofr/mining', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'configure',
                    ...config
                })
            });

            if (response.ok) {
                toast({
                    title: "Configuration Saved",
                    description: "Your mining settings have been updated successfully.",
                });
            } else {
                throw new Error('Failed to save configuration');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to save mining configuration.",
                variant: "destructive",
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Pool Configuration */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-6 w-6" />
                        Pool Configuration
                    </CardTitle>
                    <CardDescription>Configure your mining pool settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="pool">Pool URL</Label>
                        <Input
                            id="pool"
                            value={config.pool}
                            onChange={(e) => handleConfigChange('pool', e.target.value)}
                            placeholder="stratum+tcp://pool.example.com:4444"
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="algorithm">Mining Algorithm</Label>
                        <Select
                            value={config.algorithm}
                            onValueChange={(value) => handleConfigChange('algorithm', value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sha256">SHA-256 (Bitcoin)</SelectItem>
                                <SelectItem value="scrypt">Scrypt (Litecoin)</SelectItem>
                                <SelectItem value="ethash">Ethash (Ethereum)</SelectItem>
                                <SelectItem value="equihash">Equihash (Zcash)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Performance Settings */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-6 w-6" />
                        Performance Settings
                    </CardTitle>
                    <CardDescription>Adjust mining performance parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Mining Intensity</Label>
                            <span className="text-sm text-muted-foreground">{config.intensity}%</span>
                        </div>
                        <Slider
                            value={[config.intensity]}
                            onValueChange={([value]) => handleConfigChange('intensity', value)}
                            max={100}
                            step={5}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Higher intensity increases hashrate but also power consumption and heat.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Temperature Limit</Label>
                            <span className="text-sm text-muted-foreground">{config.temperatureLimit}°C</span>
                        </div>
                        <Slider
                            value={[config.temperatureLimit]}
                            onValueChange={([value]) => handleConfigChange('temperatureLimit', value)}
                            max={100}
                            min={50}
                            step={5}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Mining will automatically throttle if temperature exceeds this limit.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <Label>Power Limit</Label>
                            <span className="text-sm text-muted-foreground">{config.powerLimit}%</span>
                        </div>
                        <Slider
                            value={[config.powerLimit]}
                            onValueChange={([value]) => handleConfigChange('powerLimit', value)}
                            max={100}
                            min={10}
                            step={5}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Maximum power consumption as percentage of card's TDP.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Automation Settings */}
            <Card className="bg-card/50 backdrop-blur-lg border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Cpu className="h-6 w-6" />
                        Automation
                    </CardTitle>
                    <CardDescription>Configure automatic mining behavior</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Auto-start Mining</Label>
                            <p className="text-sm text-muted-foreground">
                                Automatically start mining when the application launches
                            </p>
                        </div>
                        <Switch
                            checked={config.autoStart}
                            onCheckedChange={(checked) => handleConfigChange('autoStart', checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSaveConfiguration}
                    disabled={isSaving}
                    className="min-w-[120px]"
                >
                    {isSaving ? 'Saving...' : 'Save Configuration'}
                </Button>
            </div>
        </div>
    );
}
