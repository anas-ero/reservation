import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import ResourceReviews from "@/components/Resource/ResourceReviews";
import {
    Star,
    MapPin,
    Share,
    Heart,
    Wifi,
    Car as CarIcon,
    Wind,
    Coffee,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Eye,
    Users,
    Maximize2,
    CalendarDays,
    X,
    Check,
    Award,
    ArrowRight,
    Home,
    Briefcase,
    Dumbbell,
    Zap,
    Grid3X3,
    Flame,
    Tv,
    Utensils,
    ParkingCircle,
    Bath,
    Waves,
    Bed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ─── Constants ─────────────────────────────────────────────────────────────────

const TYPE_META = {
    hotel: {
        label: "Hotel / Stay",
        icon: Home,
        color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    villa: {
        label: "Villa",
        icon: Home,
        color: "bg-amber-100 text-amber-800 border-amber-200",
    },
    car: {
        label: "Vehicle",
        icon: CarIcon,
        color: "bg-sky-100 text-sky-800 border-sky-200",
    },
    pitch: {
        label: "Pitch",
        icon: Dumbbell,
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
    workspace: {
        label: "Workspace",
        icon: Briefcase,
        color: "bg-violet-100 text-violet-800 border-violet-200",
    },
    sports_pitch: {
        label: "Sports Pitch",
        icon: Dumbbell,
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
    },
};

const PLACEHOLDER_GRADIENTS = [
    "from-zinc-200 to-zinc-300",
    "from-slate-200 to-zinc-200",
    "from-zinc-300 to-slate-300",
    "from-stone-200 to-zinc-200",
    "from-zinc-200 to-stone-300",
];

const AMENITIES = [
    { icon: Wifi, label: "High-speed Wi-Fi", available: true },
    { icon: ParkingCircle, label: "Free parking", available: true },
    { icon: Wind, label: "Air conditioning", available: true },
    { icon: Waves, label: "Infinity pool", available: true },
    { icon: Coffee, label: "Espresso machine", available: true },
    { icon: Tv, label: "Smart TV (4K)", available: true },
    { icon: Utensils, label: "Fully-equipped kitchen", available: true },
    { icon: Bath, label: "Rain shower + bathtub", available: true },
    { icon: Flame, label: "Fireplace", available: false },
    { icon: Zap, label: "EV charger", available: false },
];

const REVIEWS_BREAKDOWN = [
    { label: "Cleanliness", score: 5.0 },
    { label: "Accuracy", score: 4.8 },
    { label: "Check-in", score: 4.9 },
    { label: "Communication", score: 5.0 },
    { label: "Location", score: 4.9 },
    { label: "Value", score: 4.7 },
];

const MOCK_REVIEWS = [
    {
        id: 1,
        initials: "SR",
        name: "Sophie R.",
        date: "April 2025",
        rating: 5,
        text: "Absolutely breathtaking property. The Atlas Mountain views at sunrise were worth every dirham. Host was incredibly responsive and left a welcome basket of local treats.",
    },
    {
        id: 2,
        initials: "MT",
        name: "Marcus T.",
        date: "March 2025",
        rating: 5,
        text: "Stayed for a week and didn't want to leave. The infinity pool overlooking the valley is something else. Architecture feels like a private art museum.",
    },
    {
        id: 3,
        initials: "LK",
        name: "Lena K.",
        date: "February 2025",
        rating: 5,
        text: "Perfect retreat. Spotlessly clean, superbly furnished, and the location is serene yet accessible. We'll definitely be back next winter.",
    },
    {
        id: 4,
        initials: "JO",
        name: "James O.",
        date: "January 2025",
        rating: 5,
        text: "The photos don't do it justice — it's even more stunning in person. Staff arranged a private chef for our last evening which was unforgettable.",
    },
];

// ─── Small helpers ──────────────────────────────────────────────────────────────

function InitialsAvatar({ initials, size = "md" }) {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-14 h-14 text-base",
    };
    return (
        <div
            className={`${sizes[size]} rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white font-semibold flex items-center justify-center flex-shrink-0 shadow-md`}
        >
            {initials}
        </div>
    );
}

function StarRow({ score = 4.9 }) {
    const full = Math.floor(score);
    const partial = score - full;
    return (
        <span className="inline-flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="relative inline-block">
                    <Star className="w-3.5 h-3.5 text-zinc-200 fill-zinc-200" />
                    {i < full && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 absolute inset-0" />
                    )}
                    {i === full && partial > 0 && (
                        <span
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${partial * 100}%` }}
                        >
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        </span>
                    )}
                </span>
            ))}
        </span>
    );
}

// ─── Gallery image with shimmer + error fallback ────────────────────────────────

function GalleryImage({ src, alt, className, gradient }) {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div
                className={`${className} bg-gradient-to-br ${gradient} flex items-center justify-center`}
            >
                <div className="flex flex-col items-center gap-1.5 text-zinc-400 opacity-50">
                    <Grid3X3 className="w-7 h-7" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">
                        No photo
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className} overflow-hidden relative bg-zinc-100`}>
            {!loaded && (
                <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-pulse`}
                />
            )}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
            />
        </div>
    );
}

// ─── Bento Gallery ──────────────────────────────────────────────────────────────

function BentoGallery({ images, name, onShowAll }) {
    // Pad to 5 slots; use your original /storage/ path prefix
    const slots = Array.from({ length: 5 }).map((_, i) =>
        images[i]?.path ? `/storage/${images[i].path}` : null,
    );

    return (
        <div className="relative rounded-2xl overflow-hidden h-[420px] md:h-[500px] mb-10">
            <div className="grid grid-cols-2 gap-1.5 h-full">
                {/* Hero — left half */}
                <div
                    className="group relative cursor-pointer"
                    onClick={onShowAll}
                >
                    <GalleryImage
                        src={slots[0]}
                        alt={`${name} — main`}
                        className="w-full h-full"
                        gradient={PLACEHOLDER_GRADIENTS[0]}
                    />
                </div>

                {/* 2×2 right grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
                    {[1, 2, 3, 4].map((idx) => (
                        <div
                            key={idx}
                            className="group relative cursor-pointer"
                            onClick={onShowAll}
                        >
                            <GalleryImage
                                src={slots[idx]}
                                alt={`${name} — photo ${idx + 1}`}
                                className="w-full h-full"
                                gradient={PLACEHOLDER_GRADIENTS[idx]}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* "Show all" overlay button */}
            <Button
                variant="secondary"
                onClick={onShowAll}
                className="absolute bottom-4 right-4 flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
                <Grid3X3 className="w-4 h-4 text-zinc-500" />
                Show all photos
            </Button>

            {/* Inset ring polish */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/5 pointer-events-none" />
        </div>
    );
}

// ─── Lightbox ───────────────────────────────────────────────────────────────────

function Lightbox({ images, onClose }) {
    const srcs = images
        .map((img) => (img?.path ? `/storage/${img.path}` : null))
        .filter(Boolean);
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c - 1 + srcs.length) % srcs.length);
    const next = () => setCurrent((c) => (c + 1) % srcs.length);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    if (!srcs.length) return null;

    return (
        <div className="fixed inset-0 z-50 bg-zinc-950/96 backdrop-blur-xl flex items-center justify-center">
            <button
                onClick={onClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors"
            >
                <X className="w-5 h-5" />
            </button>
            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-zinc-400 text-sm font-medium">
                {current + 1} / {srcs.length}
            </p>

            {srcs.length > 1 && (
                <>
                    <button
                        onClick={prev}
                        className="absolute left-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={next}
                        className="absolute right-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            <img
                src={srcs[current]}
                alt={`Photo ${current + 1}`}
                className="max-h-[85vh] max-w-[85vw] object-contain rounded-xl shadow-2xl"
            />

            {srcs.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {srcs.map((src, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-12 h-8 rounded-md overflow-hidden ring-2 transition-all duration-200 ${
                                i === current
                                    ? "ring-white scale-110"
                                    : "ring-zinc-600 opacity-50 hover:opacity-80"
                            }`}
                        >
                            <img
                                src={src}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Show({ auth, resource, ratings }) {
    const formatDateInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatDateLabel = (value) => {
        if (!value) return "Select date";
        const [year, month, day] = value.split("-");
        const parsed = new Date(Number(year), Number(month) - 1, Number(day));

        if (Number.isNaN(parsed.getTime())) {
            return "Select date";
        }

        return parsed.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const calculateNights = (start, end) => {
        if (!start || !end) return 0;

        const startDate = new Date(`${start}T00:00:00`);
        const endDate = new Date(`${end}T00:00:00`);
        const diffMs = endDate.getTime() - startDate.getTime();

        if (diffMs <= 0) return 0;

        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    };

    // ── Safe defaults (mirrors your original pattern) ──
    const item = resource || {};
    const images = item.images || [];
    const typeMeta = TYPE_META[item.type] || TYPE_META.villa;
    const TypeIcon = typeMeta.icon;

    const price = item.price || 0;
    const today = new Date();
    const defaultCheckInDate = new Date(today);
    defaultCheckInDate.setDate(defaultCheckInDate.getDate() + 1);
    const defaultCheckOutDate = new Date(defaultCheckInDate);
    defaultCheckOutDate.setDate(defaultCheckOutDate.getDate() + 1);
    // calculate nights, service fee, and total based on defaults for the reservation form
    const { data, setData, post, processing, errors } = useForm({
        resource_id: item.id || "",
        start_time: formatDateInput(defaultCheckInDate),
        end_time: formatDateInput(defaultCheckOutDate),

        guests: 2,
    });
    
    
    const nights = calculateNights(formatDateInput(defaultCheckInDate), formatDateInput(defaultCheckOutDate));
    const serviceFee = Math.round(price * nights * 0.12);
    const total = price * nights + serviceFee;

    // ── State ──
    const [saved, setSaved] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [bookingStatus, setBookingStatus] = useState(null);
    const [bookingSheetOpen, setBookingSheetOpen] = useState(false);

    const visibleAmenities = showAllAmenities
        ? AMENITIES
        : AMENITIES.slice(0, 6);

    const reserve = () => {
        if (!auth?.user) {
            window.location.href = route("login");
            return;
        }

        post("/reservations", {
            preserveScroll: true,
            onSuccess: () => {
                setBookingStatus({
                    type: "success",
                    message: "Reservation created successfully.",
                });
                setBookingSheetOpen(true);
            },
            onError: (formErrors) => {
                setBookingStatus({
                    type: "error",
                    message:
                        formErrors.error ||
                        formErrors.start_time ||
                        formErrors.end_time ||
                        formErrors.guests ||

                        "This reservation could not be completed.",
                });
                setBookingSheetOpen(true);
            },
        });
    };

    return (
        <MainLayout auth={auth}>
            <Head
                title={`${item.name || item.title || "Listing"} - ReserveFlow`}
            />

            <Drawer open={bookingSheetOpen} onOpenChange={setBookingSheetOpen}>
                <DrawerContent className="w-full max-w-full sm:max-w-full outline-none overflow-hidden p-0 sm:pb-0 !max-h-[90vh]">
                    <div className="flex-1 overflow-y-auto w-full">
                        <div className="w-full max-w-7xl mx-auto">
                            <DrawerHeader className="border-b border-border px-6 py-6 sm:px-10">
                                <h3 className="text-3xl font-bold text-foreground">
                                    {bookingStatus?.type === "success"
                                        ? "Reservation Confirmed"
                                        : "These dates are unavailable"}
                                </h3>
                                <p className="mt-2 max-w-2xl text-base">
                                    {bookingStatus?.type === "success"
                                        ? "Your booking request was saved. Review the stay details below before moving on."
                                        : bookingStatus?.message ||
                                          "Another guest already booked these dates. Pick a different range to continue."}
                                </p>
                            </DrawerHeader>

                            <div className="grid gap-8 px-6 py-8 sm:px-10 grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
                                <div className="space-y-6">
                                    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                            Listing
                                        </p>
                                        <h2 className="mt-3 text-3xl font-bold text-foreground">
                                            {item.name ||
                                                item.title ||
                                                "Listing"}
                                        </h2>
                                        <p className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
                                            <MapPin className="h-4 w-4" />
                                            {item.location ||
                                                "Location unavailable"}
                                        </p>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                                Check-in
                                            </p>
                                            <p className="mt-3 text-xl font-bold text-foreground">
                                                {formatDateLabel(
                                                    data.start_time,
                                                )}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                                Checkout
                                            </p>
                                            <p className="mt-3 text-xl font-bold text-foreground">
                                                {formatDateLabel(data.end_time)}
                                            </p>
                                        </div>
                                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                                                Guests
                                            </p>
                                            <p className="mt-3 text-xl font-bold text-foreground">
                                                {data.guests}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                                        Reservation summary
                                    </p>
                                    <div className="mt-6 space-y-4 text-sm text-zinc-600">
                                        <div className="flex items-center justify-between">
                                            <span>
                                                MAD {price.toLocaleString()} ×{" "}
                                                {nights} nights
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                MAD{" "}
                                                {(
                                                    price * nights
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Service fee</span>
                                            <span className="font-semibold text-foreground">
                                                MAD{" "}
                                                {serviceFee.toLocaleString()}
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex items-center justify-between text-base font-bold text-foreground">
                                            <span>Total</span>
                                            <span>
                                                MAD {total.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`mt-6 rounded-2xl border px-4 py-4 text-sm ${
                                            bookingStatus?.type === "success"
                                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                                : "border-red-200 bg-red-50 text-red-700"
                                        }`}
                                    >
                                        <p className="font-semibold">
                                            {bookingStatus?.type === "success"
                                                ? "Confirmed and saved"
                                                : "Dates need to change"}
                                        </p>
                                        <p className="mt-1">
                                            {bookingStatus?.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full border-t border-border bg-background">
                        <div className="w-full max-w-7xl mx-auto">
                            <DrawerFooter className="px-6 py-5 sm:px-10 sm:flex-row sm:justify-end">
                                {bookingStatus?.type === "success" ? (
                                    <>
                                        <DrawerClose asChild>
                                            <Button
                                                variant="outline"
                                                className="rounded-xl"
                                            >
                                                Back to listing
                                            </Button>
                                        </DrawerClose>
                                        <DrawerClose asChild>
                                            <Button className="rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white">
                                                Done
                                            </Button>
                                        </DrawerClose>
                                    </>
                                ) : (
                                    <>
                                        <DrawerClose asChild>
                                            <Button
                                                variant="outline"
                                                className="rounded-xl"
                                            >
                                                Close
                                            </Button>
                                        </DrawerClose>
                                        <DrawerClose asChild>
                                            <Button className="rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white">
                                                Choose different dates
                                            </Button>
                                        </DrawerClose>
                                    </>
                                )}
                            </DrawerFooter>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Lightbox */}
            {lightboxOpen && images.length > 0 && (
                <Lightbox
                    images={images}
                    onClose={() => setLightboxOpen(false)}
                />
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-12">
                {/* ── 1. Header ── */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="space-y-2">
                        {/* Type badge + Guest Favourite */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeMeta.color}`}
                            >
                                <TypeIcon className="w-3 h-3" />
                                {typeMeta.label}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <Award className="w-3 h-3" />
                                Guest Favourite
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-zinc-950 tracking-tight leading-tight">
                            {item.name || item.title || "Unnamed Listing"}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-zinc-600 font-medium">
                            <span className="flex items-center gap-1.5">
                                <StarRow score={4.9} />
                                <span className="font-bold text-zinc-800">
                                    4.9
                                </span>
                                <span className="text-zinc-400">·</span>
                                <button className="underline underline-offset-2 hover:text-zinc-900 transition-colors">
                                    reviews
                                </button>
                            </span>
                            {item.views > 0 && (
                                <>
                                    <span className="text-zinc-300">·</span>
                                    <span className="flex items-center gap-1 text-zinc-500">
                                        <Eye className="w-3.5 h-3.5" />
                                        {(
                                            item.views || 0
                                        ).toLocaleString()}{" "}
                                        views
                                    </span>
                                </>
                            )}
                            {item.location && (
                                <>
                                    <span className="text-zinc-300">·</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                        {item.location}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Share / Save — uses your original Shadcn Button variant="outline" */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2 rounded-xl border-zinc-200 hover:border-zinc-400 transition-colors"
                        >
                            <Share className="w-4 h-4" /> Share
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSaved((s) => !s)}
                            className={`gap-2 rounded-xl transition-all duration-200 ${
                                saved
                                    ? "border-rose-300 text-rose-600 bg-rose-50 hover:bg-rose-100"
                                    : "border-zinc-200 hover:border-zinc-400"
                            }`}
                        >
                            <Heart
                                className={`w-4 h-4 transition-all duration-200 ${saved ? "fill-rose-500 text-rose-500 scale-110" : ""}`}
                            />
                            {saved ? "Saved" : "Save"}
                        </Button>
                    </div>
                </div>

                {/* ── 2. Bento Gallery ── */}
                <BentoGallery
                    images={images}
                    name={item.name || "Listing"}
                    onShowAll={() => setLightboxOpen(true)}
                />

                {/* ── 3. Main content split: lg:col-span-2 + col-span-1 ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* ── LEFT: Details ── */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Host Info */}
                        <div className="flex items-center justify-between pb-6 border-b border-zinc-200">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-950">
                                    Hosted by{" "}
                                    {item.owner?.name || "Verified Partner"}
                                </h2>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 mt-1.5">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3.5 h-3.5" /> Up to{" "}
                                        {item.max_guests} guests
                                    </span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <Bed className="w-3.5 h-3.5" />{" "}
                                        {item.bedrooms} bedrooms
                                    </span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1">
                                        <Bath className="w-3.5 h-3.5" />{" "}
                                        {item.bathrooms} bathrooms
                                    </span>
                                </div>
                                <p className="text-zinc-500 text-sm mt-1">
                                    Superhost · Fast responder
                                </p>
                            </div>
                            <div className="relative flex-shrink-0">
                                <div className="h-14 w-14 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xl font-bold shadow-md">
                                    P
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Check
                                        className="w-3 h-3 text-white"
                                        strokeWidth={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                {
                                    icon: Award,
                                    title: "Superhost",
                                    sub: "Experienced, highly rated host",
                                },
                                {
                                    icon: CalendarDays,
                                    title: "Free cancellation",
                                    sub: "Cancel up to 7 days before",
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Fully insured",
                                    sub: "Protected by Host Guarantee",
                                },
                            ].map(({ icon: Icon, title, sub }) => (
                                <div
                                    key={title}
                                    className="flex gap-3 p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <Icon className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-semibold text-zinc-900">
                                            {title}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-0.5 leading-snug">
                                            {sub}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-950 mb-3">
                                About this listing
                            </h3>
                            <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                                {item.description ||
                                    `Experience the best of ${item.location} with this premium listing. Perfect for your next getaway, event, or commute.`}
                            </p>
                        </div>

                        <Separator />

                        {/* Amenities */}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-950 mb-4">
                                What this place offers
                            </h3>
                            <div className="grid grid-cols-2 gap-3 text-zinc-700">
                                {visibleAmenities.map(
                                    ({ icon: Icon, label, available }) => (
                                        <div
                                            key={label}
                                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                                available
                                                    ? "hover:bg-zinc-50"
                                                    : "text-zinc-300"
                                            }`}
                                        >
                                            <div
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${available ? "bg-zinc-100" : "bg-zinc-50"}`}
                                            >
                                                <Icon
                                                    className={`w-4 h-4 ${available ? "text-zinc-500" : "text-zinc-300"}`}
                                                />
                                            </div>
                                            <span
                                                className={`text-sm font-medium ${!available ? "line-through" : ""}`}
                                            >
                                                {label}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                            <Button
                                variant="outline"
                                className="mt-5 rounded-xl border-2 border-zinc-800 font-semibold hover:bg-zinc-900 hover:text-white transition-all duration-200"
                                onClick={() => setShowAllAmenities((s) => !s)}
                            >
                                {showAllAmenities
                                    ? "Show fewer amenities"
                                    : `Show all ${AMENITIES.length} amenities`}
                            </Button>
                        </div>

                        <Separator />

                        {/* Reviews */}
                        <ResourceReviews resource={resource} auth={auth} />
                    </div>

                    {/* ── Booking Widget ── */}
                    <div className="relative order-first lg:order-none mb-8 lg:mb-0">
                        <div className="lg:sticky lg:top-24">
                            <Card className="shadow-xl border-zinc-200 p-2 rounded-2xl">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-baseline justify-between">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-zinc-950">
                                                MAD {price.toLocaleString()}
                                            </span>
                                            <span className="text-zinc-500 text-sm font-normal mb-1">
                                                / night
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span className="font-semibold text-zinc-800">
                                                {item.rating?.toFixed(1)}
                                            </span>
                                            <span className="text-zinc-400 text-xs ml-0.5">
                                                · 124
                                            </span>
                                        </div>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Date picker — styled up from your original grid */}
                                    <div className="grid grid-cols-2 border-2 border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors duration-200">
                                        <div className="p-3 border-r border-zinc-200 hover:bg-zinc-50 transition-colors">
                                            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                                Check-in
                                            </span>
                                            <input
                                                type="date"
                                                min={formatDateInput(today)}
                                                value={data.start_time}
                                                onChange={(e) =>
                                                    setData(
                                                        "start_time",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-transparent text-sm font-semibold text-zinc-900 outline-none"
                                            />
                                            <span className="mt-1 block text-xs text-zinc-500">
                                                {formatDateLabel(
                                                    data.start_time,
                                                )}
                                            </span>
                                        </div>
                                        <div className="p-3 hover:bg-zinc-50 transition-colors">
                                            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                                Checkout
                                            </span>
                                            <input
                                                type="date"
                                                min={
                                                    data.start_time ||
                                                    formatDateInput(today)
                                                }
                                                value={data.end_time}
                                                onChange={(e) =>
                                                    setData(
                                                        "end_time",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-transparent text-sm font-semibold text-zinc-900 outline-none"
                                            />
                                            <span className="mt-1 block text-xs text-zinc-500">
                                                {formatDateLabel(data.end_time)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Guests stepper */}
                                    <div className="border-2 border-zinc-200 rounded-xl px-3 py-2.5 flex items-center justify-between hover:border-zinc-400 transition-colors">
                                        <div>
                                            <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-0.5">
                                                Guests
                                            </div>
                                            <div className="text-sm font-semibold text-zinc-900">
                                                {data.guests} guest
                                                {data.guests !== 1 ? "s" : ""}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    setData(
                                                        "guests",
                                                        Math.max(
                                                            1,
                                                            Number(
                                                                data.guests,
                                                            ) - 1,
                                                        ),
                                                    )
                                                }
                                                type="button"
                                                className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors leading-none text-lg"
                                            >
                                                −
                                            </button>
                                            <span className="w-5 text-center font-medium text-zinc-800">
                                                {data.guests}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setData(
                                                        "guests",
                                                        Math.min(
                                                            item.max_guests ||
                                                                12,
                                                            Number(
                                                                data.guests,
                                                            ) + 1,
                                                        ),
                                                    )
                                                }
                                                type="button"
                                                className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors leading-none text-lg"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Reserve CTA */}
                                    <Button
                                        onClick={reserve}
                                        disabled={processing || nights < 1}
                                        className="w-full text-lg font-bold py-6 bg-zinc-950 hover:bg-zinc-800 active:bg-black text-white rounded-xl shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/30 transition-all duration-200 flex items-center justify-center gap-2 group"
                                    >
                                        {processing
                                            ? "Reserving..."
                                            : "Reserve"}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>

                                    <div className="text-center text-zinc-500 text-sm">
                                        You won't be charged yet
                                    </div>

                                    {/* Price breakdown */}
                                    <div className="space-y-2.5 pt-1">
                                        <div className="flex justify-between text-sm text-zinc-600">
                                            <button className="underline underline-offset-2 hover:text-zinc-900 transition-colors text-left">
                                                MAD {price.toLocaleString()} ×{" "}
                                                {nights} nights
                                            </button>
                                            <span>
                                                MAD{" "}
                                                {(
                                                    price * nights
                                                ).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm text-zinc-600">
                                            <button className="underline underline-offset-2 hover:text-zinc-900 transition-colors text-left">
                                                Service fee
                                            </button>
                                            <span>
                                                MAD{" "}
                                                {serviceFee.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>

                                <Separator className="my-2" />

                                <CardFooter className="flex justify-between font-bold text-zinc-950 pb-2">
                                    <span>Total before taxes</span>
                                    <span>MAD {total.toLocaleString()}</span>
                                </CardFooter>
                            </Card>

                            {/* Trust badge */}
                            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-zinc-500 font-medium">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                Secure &amp; protected booking
                            </div>
                            <p className="text-center mt-2">
                                <button className="text-xs text-zinc-400 underline underline-offset-2 hover:text-zinc-600 transition-colors">
                                    Report this listing
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Mobile sticky booking bar (your original had no mobile widget) ── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card/95 backdrop-blur-md border-t border-border px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
                <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
                    <div>
                        <div className="text-lg font-bold text-zinc-900">
                            MAD {price.toLocaleString()}
                            <span className="text-sm font-normal text-zinc-500 ml-1">
                                / night
                            </span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-zinc-700">
                                4.9
                            </span>
                            <span className="text-xs text-zinc-400">
                                · 124 reviews
                            </span>
                        </div>
                    </div>
                    <Button
                        onClick={reserve}
                        disabled={processing || nights < 1}
                        className="flex-1 max-w-[160px] py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2 group"
                    >
                        {processing ? "Reserving..." : "Reserve"}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </div>
            </div>
        </MainLayout>
    );
}
