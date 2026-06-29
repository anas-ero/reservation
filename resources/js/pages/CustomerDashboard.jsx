import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Car,
    Hotel,
    Layers,
    CreditCard,
    ArrowRight,
    CheckCircle,
    Receipt,
    Download,
    XCircle,
    Star,
    Heart,
    Filter,
    MapPin,
    Dumbbell,
    Home,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard({
    auth,
    upcomingBookings = [],
    pastBookings,
    stats,
    favorites = [],
    filters = {},
}) {
    const { url } = usePage();
    const searchIndex = url.indexOf('?');
    const searchString = searchIndex !== -1 ? url.substring(searchIndex) : '';
    const urlParams = new URLSearchParams(searchString);
    const activeTab = urlParams.get('tab') || 'overview';

    const isFavorite = (resourceId) => favorites.some(fav => fav.resource_id === resourceId);

    const getTypeIcon = (type) => {
        switch (type) {
            case 'hotel': return <Home className="w-4 h-4 text-emerald-500" />;
            case 'car': return <Car className="w-4 h-4 text-blue-500" />;
            case 'field': return <Dumbbell className="w-4 h-4 text-indigo-500" />;
            default: return <Layers className="w-4 h-4 text-zinc-500" />;
        }
    };
    
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    
    // Review Modal State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
    const { data, setData, post, processing, reset, errors } = useForm({
        rating: 5,
        comment: '',
    });

    const handleFilterChange = (e) => {
        router.get(route('dashboard'), { type: e.target.value, tab: activeTab }, { preserveState: true });
    };

    const handleCancel = (bookingId) => {
        if (confirm("Are you sure you want to cancel this reservation?")) {
            router.patch(route('reservations.cancel', bookingId));
        }
    };

    const handleToggleFavorite = (resourceId) => {
        router.post(route('favorites.toggle'), { resource_id: resourceId }, { preserveScroll: true });
    };

    const openReviewModal = (booking) => {
        setSelectedBookingForReview(booking);
        setData({ rating: 5, comment: '' });
        setReviewModalOpen(true);
    };

    const submitReview = (e) => {
        e.preventDefault();
        if (selectedBookingForReview?.resource_id) {
            post(route('ratings.store', selectedBookingForReview.resource_id), {
                onSuccess: () => {
                    setReviewModalOpen(false);
                    reset();
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                    {activeTab === 'overview' && `Welcome Back, ${auth.user.name}`}
                    {activeTab === 'favorites' && 'Your Saved Resources'}
                    {activeTab === 'history' && 'Past Activity'}
                </h2>
            }
        >
            <Head title="My Dashboard" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* --- TAB: OVERVIEW --- */}
                    {activeTab === 'overview' && (
                        <>
                            {/* --- KPI SUMMARY ROW --- */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border border-zinc-100 shadow-none">
                                    <CardContent className="pt-6 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-zinc-500">
                                                Active Schedules
                                            </p>
                                            <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                                {stats.active_count} Bookings
                                            </p>
                                        </div>
                                        <div className="p-3 bg-indigo-50 rounded-lg">
                                            <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-zinc-100 shadow-none">
                                    <CardContent className="pt-6 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-zinc-500">
                                                Total Investment
                                            </p>
                                            <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                                                {stats.total_spent}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-emerald-50 rounded-lg">
                                            <CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* --- UPCOMING ACTIVE BOOKINGS GRID --- */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                    Your Upcoming Reservations
                                </h3>

                                {upcomingBookings.length === 0 ? (
                                    <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 text-center">
                                        <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
                                            <Layers className="w-5 h-5 text-zinc-400" />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                            No active schedules right now
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-0.5 mb-4">
                                            Looking for a car, premium hotel room, or
                                            sports field?
                                        </p>
                                        <Button
                                            asChild
                                            size="sm"
                                            className="bg-zinc-900 text-white font-medium"
                                        >
                                            <Link href="/resources">
                                                Explore Listings
                                            </Link>
                                        </Button>
                                    </Card>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {upcomingBookings.map((booking) => (
                                            <Card
                                                key={booking.id}
                                                className="border border-zinc-100 flex flex-col justify-between"
                                            >
                                                <CardHeader className="pb-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="p-1.5 bg-zinc-50 border rounded-md">
                                                            {getTypeIcon(booking.type)}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                booking.status ===
                                                                "confirmed"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:border-emerald-900"
                                                                    : "bg-amber-50 text-amber-700 border-amber-200 dark:border-amber-900"
                                                            }
                                                        >
                                                            {booking.status}
                                                        </Badge>
                                                    </div>
                                                    <CardTitle className="text-md font-bold tracking-tight line-clamp-1">
                                                        {booking.title}
                                                    </CardTitle>
                                                    <CardDescription className="text-xs">
                                                        {booking.date}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="pt-0 flex items-center justify-between border-t mt-2 h-12">
                                                    <div className="flex gap-2">
                                                        {booking.resource_id && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={`p-1 h-auto ${isFavorite(booking.resource_id) ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50' : 'text-zinc-400 hover:text-rose-500 hover:bg-zinc-100'}`}
                                                                onClick={() => handleToggleFavorite(booking.resource_id)}
                                                            >
                                                                <Heart className={`w-4 h-4 ${isFavorite(booking.resource_id) ? 'fill-rose-500' : ''}`} />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="p-0 text-xs flex items-center gap-1 text-red-600 dark:text-red-400"
                                                            onClick={() => handleCancel(booking.id)}
                                                        >
                                                            <XCircle className="w-3 h-3" /> Cancel
                                                        </Button>
                                                        <Button
                                                            variant="link"
                                                            size="sm"
                                                            className="p-0 text-xs flex items-center gap-1 text-indigo-600 dark:text-indigo-400"
                                                            onClick={() =>
                                                                setSelectedReceipt(booking)
                                                            }
                                                        >
                                                            View Receipt{" "}
                                                            <ArrowRight className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* --- TAB: FAVORITES --- */}
                    {activeTab === 'favorites' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-rose-500 fill-rose-500" /> Saved Resources
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {favorites.map((fav) => (
                                    <Card key={fav.id} className="border border-zinc-100 dark:border-zinc-800">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="p-1.5 bg-zinc-50 border rounded-md">
                                                    {getTypeIcon(fav.type)}
                                                </span>
                                                <div>
                                                    <p className="font-semibold text-sm line-clamp-1">{fav.title}</p>
                                                    <p className="text-xs text-zinc-500">{fav.price} DH</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleToggleFavorite(fav.resource_id)}>
                                                    <Heart className="w-4 h-4 fill-rose-500" />
                                                </Button>
                                                <Button size="icon" variant="outline" className="h-8 w-8" asChild>
                                                    <Link href={`/resources/${fav.resource_id}`}>
                                                        <ArrowRight className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- TAB: HISTORY --- */}
                    {activeTab === 'history' && (
                        <Card className="border border-zinc-100 dark:border-zinc-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-md font-bold">
                                    Past Activity Logs
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-zinc-400" />
                                    <select 
                                        className="text-sm border-zinc-200 rounded-md bg-transparent dark:text-zinc-300"
                                        value={filters.type || 'all'}
                                        onChange={handleFilterChange}
                                    >
                                        <option value="all">All Types</option>
                                        <option value="car">Cars</option>
                                        <option value="hotel">Hotels</option>
                                        <option value="field">Fields</option>
                                    </select>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {pastBookings?.data?.length === 0 ? (
                                    <p className="text-xs text-zinc-500 text-center py-4">
                                        No historical activity logged inside this
                                        account.
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-3">
                                            {pastBookings?.data?.map((past) => (
                                                <div
                                                    key={past.id}
                                                    className="flex items-center justify-between pb-3 border-b last:border-b-0 text-sm"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className="p-1.5 bg-zinc-50 border rounded">
                                                            {getTypeIcon(past.type)}
                                                        </span>
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                                                {past.title}
                                                            </span>
                                                            <span className="text-xs text-zinc-400">
                                                                {past.date}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {past.resource_id && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className={`h-7 text-xs px-2 ${isFavorite(past.resource_id) ? 'text-rose-500 hover:text-rose-600 hover:bg-rose-50' : 'text-zinc-500 hover:text-rose-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                                                onClick={() => handleToggleFavorite(past.resource_id)}
                                                            >
                                                                <Heart className={`w-3 h-3 mr-1 ${isFavorite(past.resource_id) ? 'fill-rose-500' : ''}`} /> 
                                                                {isFavorite(past.resource_id) ? 'Saved' : 'Save'}
                                                            </Button>
                                                        )}

                                                        {past.status === 'completed' && past.resource_id && (
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm" 
                                                                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 h-7 text-xs px-2"
                                                                onClick={() => openReviewModal(past)}
                                                            >
                                                                <Star className="w-3 h-3 mr-1" /> Review
                                                            </Button>
                                                        )}
                                                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                                                            {past.price}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className="bg-zinc-100 text-zinc-600 capitalize"
                                                        >
                                                            {past.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        {/* Pagination */}
                                        {pastBookings?.links && pastBookings.links.length > 3 && (
                                            <div className="flex items-center justify-center gap-1 pt-4">
                                                {pastBookings.links.map((link, idx) => (
                                                    <Link
                                                        key={idx}
                                                        href={link.url ? `${link.url}&tab=history` : '#'}
                                                        className={`px-3 py-1 text-xs border rounded-md transition-colors ${
                                                            link.active 
                                                                ? 'bg-zinc-900 text-white border-transparent' 
                                                                : 'bg-white text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300'
                                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Receipt Modal */}
            <Dialog
                open={!!selectedReceipt}
                onOpenChange={(open) => !open && setSelectedReceipt(null)}
            >
                <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                    {/* Decorative Header */}
                    <div className="bg-zinc-950 px-6 py-8 text-center relative">
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Receipt className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-white">
                            Payment Receipt
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400 mt-1 text-xs">
                            {selectedReceipt?.reference} • Issued on{" "}
                            {selectedReceipt?.date}
                        </DialogDescription>
                    </div>

                    {/* Receipt Details */}
                    <div className="px-6 py-6 space-y-6 bg-white dark:bg-zinc-950">
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-zinc-900 border-b pb-2 dark:border-zinc-800">
                                Reservation Details
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-zinc-500 text-xs mb-0.5">
                                        Item Booked
                                    </p>
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                        {selectedReceipt?.title}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs mb-0.5">
                                        Category
                                    </p>
                                    <p className="font-medium text-zinc-900 uppercase text-[11px] tracking-wider">
                                        {selectedReceipt?.type}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs mb-0.5">
                                        Start Date
                                    </p>
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                        {selectedReceipt?.start_date}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-zinc-500 text-xs mb-0.5">
                                        End Date
                                    </p>
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                        {selectedReceipt?.end_date}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Financial Breakdown */}
                        <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100 space-y-3">
                            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                                <span>Base Rate</span>
                                <span>MAD {selectedReceipt?.price}</span>
                            </div>
                            <div className="flex justify-between text-sm text-zinc-600 dark:text-zinc-400">
                                <span>Platform Status</span>
                                <span className="capitalize font-medium text-zinc-900 dark:text-zinc-100">
                                    {selectedReceipt?.status}
                                </span>
                            </div>
                            <Separator className="dark:bg-zinc-800" />
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                    Total Paid
                                </span>
                                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    MAD {selectedReceipt?.price}
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="px-6 pb-6 bg-white sm:justify-between flex-row items-center">
                        
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => window.print()}
                        >
                            <Download className="w-3.5 h-3.5" /> Download PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Review Modal */}
            <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Leave a Review</DialogTitle>
                        <DialogDescription>
                            How was your experience with {selectedBookingForReview?.title}?
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitReview} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rating (1-5)</label>
                            <select 
                                className="w-full rounded-md border border-zinc-300 bg-transparent p-2 text-sm"
                                value={data.rating}
                                onChange={e => setData('rating', parseInt(e.target.value))}
                                required
                            >
                                <option value="5">5 - Excellent</option>
                                <option value="4">4 - Very Good</option>
                                <option value="3">3 - Average</option>
                                <option value="2">2 - Poor</option>
                                <option value="1">1 - Terrible</option>
                            </select>
                            {errors.rating && <p className="text-xs text-red-500">{errors.rating}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Comment (Optional)</label>
                            <textarea 
                                className="w-full rounded-md border border-zinc-300 bg-transparent p-2 text-sm"
                                rows="3"
                                value={data.comment}
                                onChange={e => setData('comment', e.target.value)}
                                placeholder="Share details of your own experience at this place..."
                            />
                            {errors.comment && <p className="text-xs text-red-500">{errors.comment}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setReviewModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-zinc-900 text-white">
                                {processing ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}
