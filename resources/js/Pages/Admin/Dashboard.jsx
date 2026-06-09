import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import {
    Users,
    Building,
    ShieldAlert,
    CheckCircle,
    UserCircle2
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/Components/ui/chart";

export default function Dashboard({ auth, stats, pendingPartners , chartData = []  }) {

    // Handle the approval action
    const handleApprove = (userId) => {
        if (confirm("Are you sure you want to approve this partner? They will be able to post listings immediately.")) {
            router.post(route('admin.partners.approve', userId), {}, {
                preserveScroll: true,
            });
        }
    };

    const chartConfig = {
        reservations: {
            label: "Reservations",
            color: "hsl(var(--emerald-500))", // Matches your existing theme colors
        },
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                    Super Admin Overview
                </h2>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* --- 1. KPI CARDS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Total Users
                                </CardTitle>
                                <Users className="w-4 h-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.total_users}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Registered accounts on the platform
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Pending Partners
                                </CardTitle>
                                <ShieldAlert className="w-4 h-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.pending_partners}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Owners requiring verification
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Total Platform Listings
                                </CardTitle>
                                <Building className="w-4 h-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.total_resources}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Active properties and vehicles
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- NEW: ANALYTICS CHART --- */}

                    <Card>
                        <CardHeader>
                            <CardTitle>Reservation Trends (Last 30 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {chartData.length === 0 ? (
                                <div className="text-center py-12 text-zinc-500">
                                    No booking data available for the last 30 days.
                                </div>
                            ) : (
                                <div className="h-[300px] w-full">
                                    <ChartContainer config={chartConfig}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                <XAxis
                                                    dataKey="date"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickMargin={10}
                                                />
                                                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                                <Bar
                                                    dataKey="reservations"
                                                    fill="var(--color-reservations)"
                                                    radius={[4, 4, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* --- 2. PENDING PARTNERS TABLE --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Action Required: Pending Partners</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pendingPartners.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-zinc-900">
                                        All caught up!
                                    </h4>
                                    <p className="text-sm text-zinc-500 mt-1 mb-4">
                                        There are no pending partner accounts awaiting your approval.
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Partner Details</TableHead>
                                            <TableHead>Email Address</TableHead>
                                            <TableHead>Registration Date</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pendingPartners.map((partner) => (
                                            <TableRow key={partner.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-orange-50 rounded-md border border-orange-100">
                                                            <UserCircle2 className="w-4 h-4 text-orange-600" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>{partner.name}</span>
                                                            <span className="text-xs text-zinc-500">Unverified Owner</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {partner.email}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-sm text-zinc-600">
                                                        {new Date(partner.created_at).toLocaleDateString()}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                        onClick={() => handleApprove(partner.id)}
                                                    >
                                                        Approve Partner
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}