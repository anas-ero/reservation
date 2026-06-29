import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
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
    Activity,
    Building,
    CalendarClock,
    Car,
    MapPin,
    Plus,
    Tent,
    Wallet,
    CheckCircle,
    TrendingUp,
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

export default function OwnerDashboard({ auth, stats, recentResources, chartData = [], recentBookings = [] }) {
    const chartConfig = {
        reservations: {
            label: "Reservations",
            color: "hsl(var(--indigo-500))",
        },
    };
    // Helper to pick icons
    const getIconForType = (type) => {
        switch (type) {
            case "car":
                return <Car className="w-4 h-4 text-blue-500" />;
            case "hotel":
            case "villa":
                return <Building className="w-4 h-4 text-emerald-500" />;
            case "pitch":
            case "sports_pitch":
                return <Tent className="w-4 h-4 text-orange-500" />;
            default:
                return <Building className="w-4 h-4 text-zinc-500" />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case "hotel":
            case "villa":
                return "Hotel / Stay";
            case "car":
                return "Car";
            case "pitch":
            case "sports_pitch":
                return "Pitch";
            default:
                return String(type || "").replace("_", " ");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                        Partner Overview
                    </h2>
                    <Button asChild className="gap-2">
                        <Link href={route("partner.resources.create")}>
                            <Plus className="w-4 h-4" /> Add New Listing
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="Owner Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    {/* --- 1. KPI CARDS --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Total Listings
                                </CardTitle>
                                <Activity className="w-4 h-4 text-zinc-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.total_resources}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    {stats.active_resources} currently active on
                                    platform
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Pending Bookings
                                </CardTitle>
                                <CalendarClock className="w-4 h-4 text-orange-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.pending_bookings}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Awaiting your approval
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Monthly Earnings
                                </CardTitle>
                                <Wallet className="w-4 h-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.monthly_revenue}{" "}
                                    <span className="text-lg text-zinc-400">
                                        MAD
                                    </span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    Estimated for current month
                                </p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-zinc-500">
                                    Total Bookings
                                </CardTitle>
                                <CheckCircle className="w-4 h-4 text-indigo-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {stats.total_bookings}
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">
                                    All-time confirmed
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- 2. ANALYTICS CHART --- */}
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

                    {/* --- 3. TWO COLUMN LAYOUT: RECENT RESOURCES & RECENT BOOKINGS --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Recent Properties & Vehicles</CardTitle>
                                </CardHeader>
                                <CardContent>
                            {recentResources.length === 0 ? (
                                <div className="text-center py-12 flex flex-col items-center">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                                        <Building className="w-6 h-6 text-zinc-300" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-zinc-900">
                                        No listings found
                                    </h4>
                                    <p className="text-sm text-zinc-500 mt-1 mb-4">
                                        You haven't added any resources yet.
                                    </p>
                                    <Button asChild variant="outline">
                                        <Link
                                            href={route(
                                                "partner.resources.create",
                                            )}
                                        >
                                            Create your first listing
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Listing Name</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead className="text-right">
                                                Status
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentResources.map((resource) => (
                                            <TableRow key={resource.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-zinc-50 rounded-md border border-zinc-100">
                                                            {getIconForType(
                                                                resource.type,
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span>
                                                                {resource.title}
                                                            </span>
                                                            <span className="text-xs text-zinc-500 capitalize">
                                                                {getTypeLabel(
                                                                    resource.type,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                                                        <MapPin className="w-3.5 h-3.5" />{" "}
                                                        {resource.location}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {resource.price} MAD{" "}
                                                    <span className="text-zinc-500 text-xs">
                                                        / unit
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {resource.is_active ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        >
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            Hidden
                                                        </Badge>
                                                    )}
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
                            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-zinc-100">
                                <CardTitle className="text-md font-semibold flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-indigo-500" />
                                    Live Bookings Feed
                                </CardTitle>
                                <Badge
                                    variant="outline"
                                    className="text-xs animate-pulse bg-emerald-50 text-emerald-700"
                                >
                                    Live
                                </Badge>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {recentBookings.length === 0 ? (
                                    <p className="text-sm text-zinc-500 text-center py-6">
                                        No recent bookings recorded.
                                    </p>
                                ) : (
                                    <div className="relative pl-4 border-l border-zinc-200 space-y-6">
                                        {recentBookings.map((activity) => (
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
                                                    <p className="text-sm text-zinc-800">
                                                        <span className="font-semibold">{activity.client}</span> booked{" "}
                                                        <span className="font-medium text-indigo-600">
                                                            {activity.resource_title}
                                                        </span>
                                                    </p>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{activity.time}</span>
                                                        <span>•</span>
                                                        <span className="capitalize font-medium">{activity.status}</span>
                                                    </div>
                                                    <p className="text-sm font-bold text-zinc-900 mt-1">
                                                        {activity.total_price} MAD
                                                    </p>
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
