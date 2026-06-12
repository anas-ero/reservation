import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Calendar, 
    Car, 
    Hotel, 
    Layers, 
    CreditCard, 
    ArrowRight, 
    CheckCircle 
} from "lucide-react";

export default function Dashboard({ auth, upcomingBookings = [], pastBookings = [], stats }) {
    
    const getTypeIcon = (type) => {
        switch (type) {
            case "car": return <Car className="w-4 h-4 text-blue-500" />;
            case "hotel": return <Hotel className="w-4 h-4 text-emerald-500" />;
            default: return <Layers className="w-4 h-4 text-indigo-500" />;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-zinc-800 dark:text-zinc-200 leading-tight">
                    Welcome Back, {auth.user.name}
                </h2>
            }
        >
            <Head title="My Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* --- KPI SUMMARY ROW --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border border-zinc-100 dark:border-zinc-800 shadow-none">
                            <CardContent className="pt-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-zinc-500">Active Schedules</p>
                                    <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        {stats.active_count} Bookings
                                    </p>
                                </div>
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                                    <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border border-zinc-100 dark:border-zinc-800 shadow-none">
                            <CardContent className="pt-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-zinc-500">Total Investment</p>
                                    <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                        {stats.total_spent}
                                    </p>
                                </div>
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                                    <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* --- UPCOMING ACTIVE BOOKINGS GRID --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Your Upcoming Reservations</h3>
                        
                        {upcomingBookings.length === 0 ? (
                            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 text-center">
                                <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-3">
                                    <Layers className="w-5 h-5 text-zinc-400" />
                                </div>
                                <p className="text-sm font-medium text-zinc-900 dark:text-white">No active schedules right now</p>
                                <p className="text-xs text-zinc-500 mt-0.5 mb-4">Looking for a car, premium hotel room, or sports field?</p>
                                <Button asChild size="sm" className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-medium">
                                    <Link href="/resources">Explore Listings</Link>
                                </Button>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {upcomingBookings.map((booking) => (
                                    <Card key={booking.id} className="border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="p-1.5 bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-md">
                                                    {getTypeIcon(booking.type)}
                                                </span>
                                                <Badge 
                                                    variant="outline" 
                                                    className={booking.status === 'confirmed' 
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900' 
                                                        : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900'}
                                                >
                                                    {booking.status}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-md font-bold tracking-tight line-clamp-1">{booking.title}</CardTitle>
                                            <CardDescription className="text-xs">{booking.date}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="pt-0 flex items-center justify-between border-t dark:border-zinc-800 mt-2 h-12">
                                            <span className="text-sm font-bold text-zinc-900 dark:text-white">{booking.price}</span>
                                            <Button variant="link" size="sm" className="p-0 text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                                                View Receipt <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* --- RECENT COMPLETED / CANCELLED TRANSACTIONS --- */}
                    <Card className="border border-zinc-100 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-md font-bold">Past Activity Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {pastBookings.length === 0 ? (
                                <p className="text-xs text-zinc-500 text-center py-4">No historical activity logged inside this account.</p>
                            ) : (
                                <div className="space-y-3">
                                    {pastBookings.map((past) => (
                                        <div key={past.id} className="flex items-center justify-between pb-3 border-b last:border-b-0 dark:border-zinc-800 text-sm">
                                            <div className="flex items-center gap-3">
                                                <span className="p-1.5 bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded">
                                                    {getTypeIcon(past.type)}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{past.title}</span>
                                                    <span className="text-xs text-zinc-400">{past.date}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium text-zinc-900 dark:text-zinc-100">{past.price}</span>
                                                <Badge variant="secondary" className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 capitalize">
                                                    {past.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
