'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, LineChart, PieChart, Download, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ChartRendererProps {
    type?: 'line' | 'bar' | 'pie';
    symbol?: string;
    timeframe?: string;
    onChartUpdate?: (data: any) => void;
}

function ChartRenderer({ 
    type = 'line', 
    symbol = 'BTC', 
    timeframe = '24h',
    onChartUpdate 
}: ChartRendererProps) {
    const [chartData, setChartData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState<'line' | 'bar' | 'pie'>(type);
    const [selectedTimeframe, setSelectedTimeframe] = useState<string>(timeframe);
    const { toast } = useToast();

    useEffect(() => {
        fetchChartData();
    }, [selectedType, selectedTimeframe, symbol]);

    const fetchChartData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/studio/charts?type=${selectedType}&timeframe=${selectedTimeframe}&symbol=${symbol}`
            );
            const data = await response.json();
            setChartData(data);
            onChartUpdate?.(data);
        } catch (error) {
            console.error('Failed to fetch chart data:', error);
            toast({
                title: "Error",
                description: "Failed to load chart data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch('/api/studio/charts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'export',
                    type: selectedType,
                    timeframe: selectedTimeframe,
                    symbol
                })
            });

            if (response.ok) {
                const result = await response.json();
                // In a real app, this would trigger a download
                toast({
                    title: "Export Ready",
                    description: "Chart data has been exported successfully.",
                });
            }
        } catch (error) {
            toast({
                title: "Export Failed",
                description: "Failed to export chart data",
                variant: "destructive",
            });
        }
    };

    const renderChart = () => {
        if (isLoading) {
            return (
                <div className="h-80 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">
                        Loading chart data...
                    </div>
                </div>
            );
        }

        if (!chartData?.data) {
            return (
                <div className="h-80 flex items-center justify-center text-muted-foreground">
                    No chart data available
                </div>
            );
        }

        // Mock chart rendering - in a real app, you'd use a charting library like Chart.js or Recharts
        return (
            <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center">
                <div className="text-center space-y-2">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        {selectedType.toUpperCase()} Chart for {symbol}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {chartData.data.length} data points
                    </p>
                </div>
            </div>
        );
    };

    return (
        <Card className="bg-card/50 backdrop-blur-lg border-border/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-6 w-6" />
                            Chart Analysis
                        </CardTitle>
                        <CardDescription>Real-time market data visualization</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchChartData}
                            disabled={isLoading}
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                        >
                            <Download className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-4">
                    <Select
                        value={selectedType}
                        onValueChange={(value: 'line' | 'bar' | 'pie') => setSelectedType(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select chart type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="line">
                                <div className="flex items-center gap-2">
                                    <LineChart className="h-4 w-4" />
                                    Line
                                </div>
                            </SelectItem>
                            <SelectItem value="bar">
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    Bar
                                </div>
                            </SelectItem>
                            <SelectItem value="pie">
                                <div className="flex items-center gap-2">
                                    <PieChart className="h-4 w-4" />
                                    Pie
                                </div>
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedTimeframe}
                        onValueChange={(value: string) => setSelectedTimeframe(value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1h">1H</SelectItem>
                            <SelectItem value="24h">24H</SelectItem>
                            <SelectItem value="7d">7D</SelectItem>
                            <SelectItem value="30d">30D</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Tabs 
                    value={selectedType} 
                    onValueChange={(value: string) => {
                        if (value === 'line' || value === 'bar' || value === 'pie') {
                            setSelectedType(value);
                        }
                    }}
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="line" className="flex items-center gap-2">
                            <LineChart className="h-4 w-4" />
                            Line Chart
                        </TabsTrigger>
                        <TabsTrigger value="bar" className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Bar Chart
                        </TabsTrigger>
                        <TabsTrigger value="pie" className="flex items-center gap-2">
                            <PieChart className="h-4 w-4" />
                            Pie Chart
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value={selectedType} className="mt-4">
                        {renderChart()}
                    </TabsContent>
                </Tabs>

                {chartData?.metadata && (
                    <div className="text-xs text-muted-foreground space-y-1">
                        <p>Source: {chartData.metadata.source}</p>
                        <p>Last Updated: {new Date(chartData.metadata.lastUpdated).toLocaleString()}</p>
                        <p>Resolution: {chartData.metadata.resolution}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export { ChartRenderer };
export default ChartRenderer;
