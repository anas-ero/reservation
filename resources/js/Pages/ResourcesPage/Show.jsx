import { useState, useEffect } from "react";
import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Star, MapPin, Share, Heart, Wifi, Car as CarIcon,
    Wind, Coffee, ShieldCheck, ChevronLeft, ChevronRight,
    Eye, Users, Maximize2, CalendarDays, X, Check, Award,
    ArrowRight, Home, Briefcase, Dumbbell, Zap, Grid3X3,
    Flame, Tv, Utensils, ParkingCircle, Bath, Waves,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ─── Constants ─────────────────────────────────────────────────────────────────

const TYPE_META = {
    hotel:        { label: "Hotel / Stay", icon: Home,      color: "bg-amber-100 text-amber-800 border-amber-200"    },
    villa:        { label: "Villa",        icon: Home,      color: "bg-amber-100 text-amber-800 border-amber-200"    },
    car:          { label: "Vehicle",      icon: CarIcon,   color: "bg-sky-100 text-sky-800 border-sky-200"          },
    pitch:        { label: "Pitch",        icon: Dumbbell,  color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    workspace:    { label: "Workspace",    icon: Briefcase, color: "bg-violet-100 text-violet-800 border-violet-200" },
    sports_pitch: { label: "Sports Pitch", icon: Dumbbell,  color: "bg-emerald-100 text-emerald-800 border-emerald-200" },
};

const PLACEHOLDER_GRADIENTS = [
    "from-zinc-200 to-zinc-300",
    "from-slate-200 to-zinc-200",
    "from-zinc-300 to-slate-300",
    "from-stone-200 to-zinc-200",
    "from-zinc-200 to-stone-300",
];

const AMENITIES = [
    { icon: Wifi,          label: "High-speed Wi-Fi",      available: true  },
    { icon: ParkingCircle, label: "Free parking",           available: true  },
    { icon: Wind,          label: "Air conditioning",       available: true  },
    { icon: Waves,         label: "Infinity pool",          available: true  },
    { icon: Coffee,        label: "Espresso machine",       available: true  },
    { icon: Tv,            label: "Smart TV (4K)",          available: true  },
    { icon: Utensils,      label: "Fully-equipped kitchen", available: true  },
    { icon: Bath,          label: "Rain shower + bathtub",  available: true  },
    { icon: Flame,         label: "Fireplace",              available: false },
    { icon: Zap,           label: "EV charger",             available: false },
];

const REVIEWS_BREAKDOWN = [
    { label: "Cleanliness",   score: 5.0 },
    { label: "Accuracy",      score: 4.8 },
    { label: "Check-in",      score: 4.9 },
    { label: "Communication", score: 5.0 },
    { label: "Location",      score: 4.9 },
    { label: "Value",         score: 4.7 },
];

const MOCK_REVIEWS = [
    { id: 1, initials: "SR", name: "Sophie R.", date: "April 2025",    rating: 5, text: "Absolutely breathtaking property. The Atlas Mountain views at sunrise were worth every dirham. Host was incredibly responsive and left a welcome basket of local treats." },
    { id: 2, initials: "MT", name: "Marcus T.", date: "March 2025",    rating: 5, text: "Stayed for a week and didn't want to leave. The infinity pool overlooking the valley is something else. Architecture feels like a private art museum." },
    { id: 3, initials: "LK", name: "Lena K.",   date: "February 2025", rating: 5, text: "Perfect retreat. Spotlessly clean, superbly furnished, and the location is serene yet accessible. We'll definitely be back next winter." },
    { id: 4, initials: "JO", name: "James O.",  date: "January 2025",  rating: 5, text: "The photos don't do it justice — it's even more stunning in person. Staff arranged a private chef for our last evening which was unforgettable." },
];

// ─── Small helpers ──────────────────────────────────────────────────────────────

function InitialsAvatar({ initials, size = "md" }) {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-14 h-14 text-base",
    };
    return (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white font-semibold flex items-center justify-center flex-shrink-0 shadow-md`}>
            {initials}
        </div>
    );
}

function StarRow({ score = 4.9 }) {
    const full    = Math.floor(score);
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
                        <span className="absolute inset-0 overflow-hidden" style={{ width: `${partial * 100}%` }}>
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
    const [error,  setError ] = useState(false);

    if (!src || error) {
        return (
            <div className={`${className} bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                <div className="flex flex-col items-center gap-1.5 text-zinc-400 opacity-50">
                    <Grid3X3 className="w-7 h-7" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest">No photo</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className} overflow-hidden relative bg-zinc-100`}>
            {!loaded && (
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-pulse`} />
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
        images[i]?.path ? `/storage/${images[i].path}` : null
    );

    return (
        <div className="relative rounded-2xl overflow-hidden h-[420px] md:h-[500px] mb-10">
            <div className="grid grid-cols-2 gap-1.5 h-full">
                {/* Hero — left half */}
                <div className="group relative cursor-pointer" onClick={onShowAll}>
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
                        <div key={idx} className="group relative cursor-pointer" onClick={onShowAll}>
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
    const srcs = images.map((img) => img?.path ? `/storage/${img.path}` : null).filter(Boolean);
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((c) => (c - 1 + srcs.length) % srcs.length);
    const next = () => setCurrent((c) => (c + 1) % srcs.length);

    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape")     onClose();
            if (e.key === "ArrowLeft")  prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    if (!srcs.length) return null;

    return (
        <div className="fixed inset-0 z-50 bg-zinc-950/96 backdrop-blur-xl flex items-center justify-center">
            <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
            <p className="absolute top-5 left-1/2 -translate-x-1/2 text-zinc-400 text-sm font-medium">
                {current + 1} / {srcs.length}
            </p>

            {srcs.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={next} className="absolute right-4 p-3 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white transition-colors">
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
                                i === current ? "ring-white scale-110" : "ring-zinc-600 opacity-50 hover:opacity-80"
                            }`}
                        >
                            <img src={src} alt="" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function Show({ auth, resource }) {

    // ── Safe defaults (mirrors your original pattern) ──
    const item     = resource || {};
    const images   = item.images || [];
    const typeMeta = TYPE_META[item.type] || TYPE_META.villa;
    const TypeIcon = typeMeta.icon;

    const price      = item.price || 0;
    const nights     = 5; // mock
    const serviceFee = Math.round(price * nights * 0.12);
    const total      = price * nights + serviceFee;

    // ── State ──
    const [saved,            setSaved           ] = useState(false);
    const [lightboxOpen,     setLightboxOpen    ] = useState(false);
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [guests,           setGuests          ] = useState(2);
    const [checkIn                             ] = useState("Jun 14, 2025");
    const [checkOut                            ] = useState("Jun 19, 2025");

    const visibleAmenities = showAllAmenities ? AMENITIES : AMENITIES.slice(0, 6);

    return (
        <MainLayout auth={auth}>
            <Head title={`${item.name || item.title || "Listing"} - ReserveFlow`} />

            {/* Lightbox */}
            {lightboxOpen && images.length > 0 && (
                <Lightbox images={images} onClose={() => setLightboxOpen(false)} />
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-12">

                {/* ── 1. Header ── */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="space-y-2">

                        {/* Type badge + Guest Favourite */}
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${typeMeta.color}`}>
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
                                <span className="font-bold text-zinc-800">4.9</span>
                                <span className="text-zinc-400">·</span>
                                <button className="underline underline-offset-2 hover:text-zinc-900 transition-colors">
                                    124 reviews
                                </button>
                            </span>
                            {item.views > 0 && (
                                <>
                                    <span className="text-zinc-300">·</span>
                                    <span className="flex items-center gap-1 text-zinc-500">
                                        <Eye className="w-3.5 h-3.5" />
                                        {(item.views || 0).toLocaleString()} views
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
                        <Button variant="outline" size="sm" className="gap-2 rounded-xl border-zinc-200 hover:border-zinc-400 transition-colors">
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
                            <Heart className={`w-4 h-4 transition-all duration-200 ${saved ? "fill-rose-500 text-rose-500 scale-110" : ""}`} />
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
                                <h2 className="text-xl font-bold text-zinc-950">Hosted by Verified Partner</h2>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 mt-1.5">
                                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> Up to 8 guests</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" /> 4 bedrooms</span>
                                    <span>·</span>
                                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" /> 3 bathrooms</span>
                                </div>
                                <p className="text-zinc-500 text-sm mt-1">Superhost · Fast responder</p>
                            </div>
                            <div className="relative flex-shrink-0">
                                <div className="h-14 w-14 rounded-full bg-zinc-950 text-white flex items-center justify-center text-xl font-bold shadow-md">
                                    P
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                </div>
                            </div>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { icon: Award,        title: "Superhost",         sub: "Experienced, highly rated host" },
                                { icon: CalendarDays, title: "Free cancellation", sub: "Cancel up to 7 days before" },
                                { icon: ShieldCheck,  title: "Fully insured",     sub: "Protected by Host Guarantee" },
                            ].map(({ icon: Icon, title, sub }) => (
                                <div key={title} className="flex gap-3 p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                                    <Icon className="w-5 h-5 text-zinc-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-sm font-semibold text-zinc-900">{title}</div>
                                        <div className="text-xs text-zinc-500 mt-0.5 leading-snug">{sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-950 mb-3">About this listing</h3>
                            <p className="text-zinc-600 leading-relaxed whitespace-pre-wrap">
                                {item.description ||
                                    `Experience the best of ${item.location} with this premium listing. Perfect for your next getaway, event, or commute.`}
                            </p>
                        </div>

                        <Separator />

                        {/* Amenities */}
                        <div>
                            <h3 className="text-lg font-bold text-zinc-950 mb-4">What this place offers</h3>
                            <div className="grid grid-cols-2 gap-3 text-zinc-700">
                                {visibleAmenities.map(({ icon: Icon, label, available }) => (
                                    <div
                                        key={label}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                                            available ? "hover:bg-zinc-50" : "text-zinc-300"
                                        }`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${available ? "bg-zinc-100" : "bg-zinc-50"}`}>
                                            <Icon className={`w-4 h-4 ${available ? "text-zinc-500" : "text-zinc-300"}`} />
                                        </div>
                                        <span className={`text-sm font-medium ${!available ? "line-through" : ""}`}>{label}</span>
                                    </div>
                                ))}
                            </div>
                            <Button
                                variant="outline"
                                className="mt-5 rounded-xl border-2 border-zinc-800 font-semibold hover:bg-zinc-900 hover:text-white transition-all duration-200"
                                onClick={() => setShowAllAmenities((s) => !s)}
                            >
                                {showAllAmenities ? "Show fewer amenities" : `Show all ${AMENITIES.length} amenities`}
                            </Button>
                        </div>

                        <Separator />

                        {/* Reviews */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-zinc-950">Reviews</h3>
                                <div className="flex items-center gap-1.5 bg-zinc-900 text-white rounded-full px-3 py-1">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-sm font-bold">4.9</span>
                                    <span className="text-zinc-400 text-xs">· 124</span>
                                </div>
                            </div>

                            {/* Score breakdown */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                {REVIEWS_BREAKDOWN.map(({ label, score }) => (
                                    <div key={label} className="flex items-center gap-3">
                                        <span className="text-sm text-zinc-600 w-28 flex-shrink-0">{label}</span>
                                        <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-zinc-800 rounded-full" style={{ width: `${(score / 5) * 100}%` }} />
                                        </div>
                                        <span className="text-sm font-semibold text-zinc-800 w-6 text-right">{score}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Review cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                {MOCK_REVIEWS.map((review) => (
                                    <div key={review.id} className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                        <div className="flex items-center gap-3">
                                            <InitialsAvatar initials={review.initials} size="sm" />
                                            <div>
                                                <div className="text-sm font-semibold text-zinc-900">{review.name}</div>
                                                <div className="text-xs text-zinc-400">{review.date}</div>
                                            </div>
                                            <div className="ml-auto flex">
                                                {Array.from({ length: review.rating }).map((_, i) => (
                                                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-zinc-600 leading-relaxed">{review.text}</p>
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="rounded-xl border-2 border-zinc-800 font-semibold hover:bg-zinc-900 hover:text-white transition-all duration-200">
                                Show all 124 reviews
                            </Button>
                        </div>

                    </div>

                    {/* ── RIGHT: Sticky Booking Widget ── */}
                    <div className="relative hidden lg:block">
                        <div className="sticky top-24">
                            <Card className="shadow-xl border-zinc-200 p-2 rounded-2xl">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-baseline justify-between">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-zinc-950">MAD {price.toLocaleString()}</span>
                                            <span className="text-zinc-500 text-sm font-normal mb-1">/ night</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                            <span className="font-semibold text-zinc-800">4.9</span>
                                            <span className="text-zinc-400 text-xs ml-0.5">· 124</span>
                                        </div>
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    {/* Date picker — styled up from your original grid */}
                                    <div className="grid grid-cols-2 border-2 border-zinc-200 rounded-xl overflow-hidden focus-within:border-zinc-900 transition-colors duration-200">
                                        <div className="p-3 border-r border-zinc-200 cursor-pointer hover:bg-zinc-50 transition-colors">
                                            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Check-in</span>
                                            <span className="text-sm font-semibold text-zinc-900">{checkIn}</span>
                                        </div>
                                        <div className="p-3 cursor-pointer hover:bg-zinc-50 transition-colors">
                                            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Checkout</span>
                                            <span className="text-sm font-semibold text-zinc-900">{checkOut}</span>
                                        </div>
                                    </div>

                                    {/* Guests stepper */}
                                    <div className="border-2 border-zinc-200 rounded-xl px-3 py-2.5 flex items-center justify-between hover:border-zinc-400 transition-colors">
                                        <div>
                                            <div className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mb-0.5">Guests</div>
                                            <div className="text-sm font-semibold text-zinc-900">{guests} guest{guests !== 1 ? "s" : ""}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                                                className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors leading-none text-lg"
                                            >−</button>
                                            <span className="w-5 text-center font-medium text-zinc-800">{guests}</span>
                                            <button
                                                onClick={() => setGuests((g) => Math.min(12, g + 1))}
                                                className="w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors leading-none text-lg"
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Reserve CTA */}
                                    <Button className="w-full text-lg font-bold py-6 bg-zinc-950 hover:bg-zinc-800 active:bg-black text-white rounded-xl shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/30 transition-all duration-200 flex items-center justify-center gap-2 group">
                                        Reserve
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>

                                    <div className="text-center text-zinc-500 text-sm">
                                        You won't be charged yet
                                    </div>

                                    {/* Price breakdown */}
                                    <div className="space-y-2.5 pt-1">
                                        <div className="flex justify-between text-sm text-zinc-600">
                                            <button className="underline underline-offset-2 hover:text-zinc-900 transition-colors text-left">
                                                MAD {price.toLocaleString()} × {nights} nights
                                            </button>
                                            <span>MAD {(price * nights).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-zinc-600">
                                            <button className="underline underline-offset-2 hover:text-zinc-900 transition-colors text-left">
                                                Service fee
                                            </button>
                                            <span>MAD {serviceFee.toLocaleString()}</span>
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
                            <span className="text-sm font-normal text-zinc-500 ml-1">/ night</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs font-semibold text-zinc-700">4.9</span>
                            <span className="text-xs text-zinc-400">· 124 reviews</span>
                        </div>
                    </div>
                    <Button className="flex-1 max-w-[160px] py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-sm shadow-lg shadow-zinc-900/20 flex items-center justify-center gap-2 group">
                        Reserve
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                </div>
            </div>

        </MainLayout>
    );
}
