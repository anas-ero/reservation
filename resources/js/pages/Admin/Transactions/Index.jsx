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
import { Badge } from "@/components/ui/badge";
import {
    Receipt,
    DollarSign,
    FileText,
    AlertCircle,
    Car,
    Hotel,
    Layers,
} from "lucide-react";
import { useState } from "react";

export default function Index({ auth, reservations, stats, filters }) {
    const [statusFilter, setStatusFilter] = useState(filters.status || "all");

    const handleStatusFilterChange = (newStatus) => {
        setStatusFilter(newStatus);
        router.get(
            route("admin.transactions"),
            { status: newStatus },
            { preserveState: true },
        );
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "confirmed":
                return (
                    <Badge className="bg-emerald-100 text-emerald-800 border-none">
                        Confirmed
                    </Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-amber-100 text-amber-800 border-none">
                        Pending
                    </Badge>
                );
            default:
                return (
                    <Badge
                        variant="secondary"
                        className="bg-zinc-100 text-zinc-800 border-none"
                    >
                        Cancelled
                    </Badge>
                );
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "car":
                return <Car className="w-3.5 h-3.5 text-blue-500" />;
            case "hotel":
                return <Hotel className="w-3.5 h-3.5 text-emerald-500" />;
            default:
                return <Layers className="w-3.5 h-3.5 text-indigo-500" />;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                    Global Bookings & Ledger
                </h2>
            }
        >
            <Head title="Global Bookings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* --- FINANCIAL MICRO-METRICS ROW --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border border-zinc-100 shadow-none">
                            <CardContent className="pt-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-zinc-500">
                                        Gross Marketplace Volume
                                    </p>
                                    <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        {stats.gross_volume}
                                    </p>
                                </div>
                                <div className="p-2.5 bg-emerald-50 rounded-lg">
                                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-zinc-100 shadow-none">
                            <CardContent className="pt-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-zinc-500">
                                        Total System Invoices
                                    </p>
                                    <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        {stats.total_count}
                                    </p>
                                </div>
                                <div className="p-2.5 bg-zinc-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-zinc-100 shadow-none">
                            <CardContent className="pt-4 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-medium text-zinc-500">
                                        Awaiting Settlement
                                    </p>
                                    <p className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        {stats.pending_count}
                                    </p>
                                </div>
                                <div className="p-2.5 bg-amber-50 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- MAIN LEDGER DATA TABLE PANEL --- */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b dark:border-zinc-800">
                            <CardTitle className="text-md font-semibold flex items-center gap-2">
                                <Receipt className="w-4 h-4 text-zinc-500" />
                                Platform Transactions Audit
                            </CardTitle>

                            {/* Filter Select Box Inline */}
                            <select
                                className="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={statusFilter}
                                onChange={(e) =>
                                    handleStatusFilterChange(e.target.value)
                                }
                            >
                                <option value="all">All Transactions</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {reservations.length === 0 ? (
                                <p className="text-center text-zinc-500 py-12">
                                    No transaction records logged inside this
                                    segment.
                                </p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>
                                                Booking Reference ID
                                            </TableHead>
                                            <TableHead>
                                                Client Information
                                            </TableHead>
                                            <TableHead>
                                                Allocated Resource
                                            </TableHead>
                                            <TableHead>Logged Time</TableHead>
                                            <TableHead>Price Value</TableHead>
                                            <TableHead className="text-right">
                                                Settlement State
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reservations.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell className="font-mono text-xs font-semibold text-zinc-400">
                                                    #BKG-{1000 + log.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                            {log.client_name}
                                                        </span>
                                                        <span className="text-xs text-zinc-400">
                                                            {log.client_email}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <span className="p-1 rounded bg-zinc-50 border dark:border-zinc-700">
                                                            {getTypeIcon(
                                                                log.resource_type,
                                                            )}
                                                        </span>
                                                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                            {log.resource_title}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-xs text-zinc-500">
                                                    {log.date}
                                                </TableCell>
                                                <TableCell className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                                                    {number_format(
                                                        log.price_raw,
                                                    )}{" "}
                                                    DH
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {getStatusBadge(log.status)}
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

// Quick tiny helper function for inline JS calculations rendering display format
function number_format(number) {
    return new Intl.NumberFormat().format(parseFloat(number).toFixed(2));
}
