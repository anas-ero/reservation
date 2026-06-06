import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
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
    Activity,
    Building,
    CalendarClock,
    Car,
    MapPin,
    Plus,
    Tent,
    Wallet,
} from "lucide-react";
import { Badge } from "@/Components/ui/badge";



export default function OwnerDashboard({ auth, stats, recentResources }) {
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
                    </div>

                    {/* --- 2. RECENT RESOURCES TABLE --- */}
                    <Card>
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
                                                                {getTypeLabel(resource.type)}
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
            </div>
        </AuthenticatedLayout>
    );
}