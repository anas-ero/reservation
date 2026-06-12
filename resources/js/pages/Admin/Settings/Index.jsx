import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Settings, 
    ShieldAlert, 
    Percent, 
    Server, 
    RefreshCw, 
    CheckCircle2 
} from "lucide-react";
import { useState } from "react";

export default function Index({ auth }) {
    const [maintenance, setMaintenance] = useState(false);
    const [commission, setCommission] = useState("10");
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveSettings = (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simulating immediate setting registration tracking
        setTimeout(() => {
            setIsSaving(false);
            alert("System configuration parameters saved locally.");
        }, 800);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-zinc-800 dark:text-zinc-200 leading-tight">
                    Platform Master Configurations
                </h2>
            }
        >
            <Head title="System Settings" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <form onSubmit={handleSaveSettings} className="space-y-6">
                        {/* 1. PLATFORM COMMISSIONS PROFILE */}
                        <Card className="border border-zinc-100 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-md font-semibold flex items-center gap-2">
                                    <Percent className="w-4 h-4 text-indigo-500" />
                                    Marketplace Fees Strategy
                                </CardTitle>
                                <CardDescription>Configure global booking service charges collected from platform listing owners.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="max-w-xs space-y-2">
                                    <label className="text-xs font-medium text-zinc-500">Platform Commission Split Rate (%)</label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="number" 
                                            value={commission} 
                                            onChange={(e) => setCommission(e.target.value)} 
                                            min="0" 
                                            max="100"
                                        />
                                        <span className="text-sm font-bold text-zinc-400">%</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-400 italic">This rate is calculated during global billing confirmations automatically.</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 2. LIVE APP SECURITY SWITCHES */}
                        <Card className="border border-zinc-100 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-md font-semibold flex items-center gap-2">
                                    <ShieldAlert className="w-4 h-4 text-orange-500" />
                                    Platform Operation Gates
                                </CardTitle>
                                <CardDescription>Instantly toggle public availability filters or execute runtime system locks.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                                    <div className="space-y-0.5">
                                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Global Maintenance Lockout</span>
                                        <p className="text-xs text-zinc-400">Force public search routers to show an offline maintenance warning layout.</p>
                                    </div>
                                    <Button 
                                        type="button"
                                        variant={maintenance ? "destructive" : "outline"}
                                        size="sm"
                                        onClick={() => setMaintenance(!maintenance)}
                                    >
                                        {maintenance ? "System Suspended" : "Activate Lock"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* 3. HARDWARE ENVIRONMENT FEEDBACK */}
                        <Card className="border border-zinc-100 dark:border-zinc-800">
                            <CardHeader>
                                <CardTitle className="text-md font-semibold flex items-center gap-2">
                                    <Server className="w-4 h-4 text-emerald-500" />
                                    Infrastructure Health Metrics
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                                <div className="flex justify-between border-b pb-2 dark:border-zinc-800">
                                    <span>Framework Iteration</span>
                                    <Badge variant="outline">Laravel v11.x</Badge>
                                </div>
                                <div className="flex justify-between border-b pb-2 dark:border-zinc-800">
                                    <span>Primary Relational Datastore</span>
                                    <span className="font-mono text-xs">MySQL v8.0</span>
                                </div>
                                <div className="flex justify-between pt-1">
                                    <span>System Operations Matrix</span>
                                    <span className="text-emerald-500 flex items-center gap-1 font-medium text-xs">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Optimal Performance
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* SUBMIT TRIGGERS */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSaving} className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium">
                                {isSaving ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Commiting Parameters...
                                    </>
                                ) : (
                                    "Save Settings Profiles"
                                )}
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}