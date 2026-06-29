import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    Users,
    Building,
    ShieldAlert,
    CheckCircle,
    UserCircle2,
    DollarSign,
    CalendarCheck,
    TrendingUp,
    Activity,
    Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Bar,
    BarChart,
    CartesianGrid,
    XAxis,
    ResponsiveContainer,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export default function Dashboard({
    auth,
    stats,
    pendingPartners,
    chartData,
    recentActivity = [],
}) {
    // Handle the approval action
    const handleApprove = (userId) => {
        if (
            confirm(
                "Are you sure you want to approve this partner? They will be able to post listings immediately.",
            )
        ) {
            router.post(
                route("admin.partners.approve", userId),
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const chartConfig = {
        reservations: {
            label: "Reservations",
            color: "hsl(var(--emerald-500))",
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
                    {/* --- 1. ANALYTICS & INSIGHTS ROW --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Dynamic Revenue Card */}
                        <Card className="border border-zinc-100 dark:border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Platform Revenue
                                </CardTitle>
                                <DollarSign className="w-4 h-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                                    {stats.formatted_revenue}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Generated from confirmed bookings
                                </p>
                            </CardContent>
                        </Card>

                        {/* Dynamic Confirmed Bookings Card */}
                        <Card className="border border-zinc-100 dark:border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Confirmed Slots
                                </CardTitle>
                                <CalendarCheck className="w-4 h-4 text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                                    {stats.active_bookings}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Currently active platform schedules
                                </p>
                            </CardContent>
                        </Card>

                        {/* Dynamic Resource Occupancy Card */}
                        <Card className="border border-zinc-100 dark:border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Resource Occupancy
                                </CardTitle>
                                <TrendingUp className="w-4 h-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                                    {stats.occupancy_rate}
                                </div>
                                {/* Modern Tailwind Progress Bar */}
                                <div className="mt-3 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                                        style={{
                                            width: `${stats.occupancy_percentage}%`,
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- 2. ORIGINAL KPI CARDS ROW --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Total Users
                                </CardTitle>
                                <Users className="w-4 h-4 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
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
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
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
                                <div className="text-3xl font-bold text-zinc-900 dark:text-white">
                                    {stats.total_resources}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Active listings across services
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- 3. ANALYTICS CHART --- */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Reservation Trends (Last 30 Days)
                            </CardTitle>
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
                                                <ChartTooltip
                                                    cursor={false}
                                                    content={<ChartTooltipContent />}
                                                />
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

                    {/* --- 4. TWO-COLUMN SPLIT: PENDING TABLE & LIVE FEED --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Side Table (Takes 2 columns of grid space) */}
                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Action Required: Pending Partners</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {pendingPartners.length === 0 ? (
                                        <div className="text-center py-12 flex flex-col items-center">
                                            <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                                                <CheckCircle className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <h4 className="text-lg font-semibold text-zinc-900 dark:text-white">
                                                All caught up!
                                            </h4>
                                            <p className="text-sm text-zinc-500 mt-1">
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
                                                                <div className="p-2 bg-orange-50 rounded-md border border-orange-100 dark:border-orange-900/50">
                                                                    <UserCircle2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span>{partner.name}</span>
                                                                    <span className="text-xs text-zinc-500">Unverified Owner</span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{partner.email}</TableCell>
                                                        <TableCell>
                                                            <span className="text-sm text-zinc-600 dark:text-zinc-400">
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

                        {/* Right Side Feed (Takes 1 column of grid space) */}
                        <div className="lg:col-span-1">
                            <Card className="h-full">
                                <CardHeader className="flex flex-row items-center justify-between pb-4 border-b dark:border-zinc-800">
                                    <CardTitle className="text-md font-semibold flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-indigo-500" />
                                        Live Platform Feed
                                    </CardTitle>
                                    <Badge
                                        variant="outline"
                                        className="text-xs animate-pulse bg-emerald-50 text-emerald-700 dark:text-emerald-400"
                                    >
                                        Live
                                    </Badge>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {recentActivity.length === 0 ? (
                                        <p className="text-sm text-zinc-500 text-center py-6">
                                            No recent actions recorded.
                                        </p>
                                    ) : (
                                        <div className="relative pl-4 border-l border-zinc-200 space-y-6">
                                            {recentActivity.map((activity) => (
                                                <div key={activity.id} className="relative group">
                                                    {/* Timeline Dot Indicator */}
                                                    <div
                                                        className={`absolute -left-[21px] mt-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white transition-colors ${
                                                            activity.status === "confirmed"
                                                                ? "border-emerald-500"
                                                                : activity.status === "pending"
                                                                  ? "border-amber-500"
                                                                  : "border-zinc-400"
                                                        }`}
                                                    />

                                                    <div className="flex flex-col space-y-1">
                                                        <p className="text-sm text-zinc-800 dark:text-zinc-200">
                                                            <span className="font-semibold">{activity.client}</span> booked{" "}
                                                            <span className="font-medium text-indigo-600 dark:text-indigo-400">
                                                                {activity.resource_title}
                                                            </span>
                                                        </p>
                                                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span>{activity.time}</span>
                                                            <span>•</span>
                                                            <span className="uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 font-semibold text-zinc-600 dark:text-zinc-400">
                                                                {activity.resource_type}
                                                            </span>
                                                            <span>•</span>
                                                           <span className="capitalize font-medium">{activity.status}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 