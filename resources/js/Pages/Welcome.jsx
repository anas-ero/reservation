import MainLayout from "@/Layouts/MainLayout";
import { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Search,
    MapPin,
    Calendar,
    Users,
    Bed,
    Car,
    Trophy,
    Briefcase,
    ChevronRight,
    Star,
    Clock,
} from "lucide-react";
import BookingCalendar from "@/Components/Style/Calendar/BookingCalendar";
import SingleDateTimePicker from "@/Components/Style/Calendar/SingleDateTimePicker";
import TimePicker from "@/Components/Style/Calendar/TimePicker";
import HerorResorcesCard from "@/Components/Landing/HerorResorcesCard";

export default function Welcome({ auth, resources, currentFilters }) {
    // State to handle the multi-category search tabs
    const [searchType, setSearchType] = useState("stays");
    const [dateRange, setDateRange] = useState({});
    const [singleDate, setSingleDate] = useState(null);
    const [location, setLocation] = useState("");
    const [time, setTime] = useState(null);

    const handleSearch = () => {
        let data = {
            type: searchType,
            location: location,
        };

        if (searchType !== "sports") {
            data.start_date = dateRange?.from?.toISOString();
            data.end_date = dateRange?.to?.toISOString();
        }

        if (searchType === "sports") {
            data.date = singleDate?.toISOString();
            data.time = time;
        }

        router.get("/resources", data);
    };

    return (
        <MainLayout auth={auth}>
            <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
                <Head title="Book Anything - ReserveFlow" />

                {/* Hero & Tabbed Search Engine */}
                <section className="bg-zinc-950 pt-20 pb-40 px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-5xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                            Reserve whatever you need,{" "}
                            <br className="hidden md:block" /> whenever you need
                            it.
                        </h1>
                        <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto">
                            From luxury villas and rental cars to football
                            pitches and co-working spaces. One platform for all
                            your bookings.
                        </p>
                    </div>

                    {/* The Multi-Category Search Engine */}
                    <div className="absolute left-0 right-0 -bottom-16 px-4 sm:px-6 lg:px-8 z-10">
                        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
                            {/* Search Type Tabs */}
                            <div className="flex border-b border-zinc-200 bg-zinc-50/50 overflow-x-auto hide-scrollbar">
                                <button
                                    onClick={() => setSearchType("stays")}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${searchType === "stays" ? "border-zinc-950 text-zinc-950 bg-white" : "border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"}`}
                                >
                                    <Bed className="w-4 h-4" /> Stays & Hotels
                                </button>
                                <button
                                    onClick={() => setSearchType("cars")}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${searchType === "cars" ? "border-zinc-950 text-zinc-950 bg-white" : "border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"}`}
                                >
                                    <Car className="w-4 h-4" /> Car Rentals
                                </button>
                                <button
                                    onClick={() => setSearchType("sports")}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${searchType === "sports" ? "border-zinc-950 text-zinc-950 bg-white" : "border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"}`}
                                >
                                    <Trophy className="w-4 h-4" /> Sports Venues
                                </button>
                                <button
                                    onClick={() => setSearchType("workspaces")}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${searchType === "workspaces" ? "border-zinc-950 text-zinc-950 bg-white" : "border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"}`}
                                >
                                    <Briefcase className="w-4 h-4" /> Workspaces
                                </button>
                            </div>

                            {/* Search Inputs */}
                            <div className="p-2 sm:p-4">
                                <div className="flex flex-col md:flex-row gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                                    {/* Dynamic Location/Facility Input */}
                                    <div className="flex-1 flex items-center px-4 py-2 md:py-0">
                                        <MapPin className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                        <div className="w-full">
                                            <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">
                                                {searchType === "sports"
                                                    ? "Facility or City"
                                                    : "Location"}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={
                                                    searchType === "sports"
                                                        ? "e.g. 5v5 Pitch, Casablanca"
                                                        : "Where are you going?"
                                                }
                                                value={location}
                                                onChange={(e) =>
                                                    setLocation(e.target.value)
                                                }
                                                className="w-full border-0 p-0 text-sm focus:ring-0 placeholder-zinc-400 text-zinc-950 outline-none bg-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Dynamic Dates */}
                                    <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                                        <Calendar className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                        <div className="w-full">
                                            <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">
                                                {searchType === "sports" ||
                                                searchType === "workspaces"
                                                    ? "Date & Time"
                                                    : "Check in - Check out"}
                                            </label>
                                            {searchType === "sports" ? (
                                                <SingleDateTimePicker
                                                    date={singleDate}
                                                    setDate={setSingleDate}
                                                    time={time}
                                                    setTime={setTime}
                                                />
                                            ) : (
                                                <BookingCalendar
                                                    value={dateRange}
                                                    onChange={setDateRange}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {searchType === "sports" && (
                                        <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                                            <Clock className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                            <div className="w-full">
                                                <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">
                                                    Time
                                                </label>
                                                <TimePicker
                                                    value={time}
                                                    onChange={setTime}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {/* Dynamic Options */}
                                    <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                                        {searchType === "cars" ? (
                                            <Car className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                        ) : (
                                            <Users className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                        )}
                                        <div className="w-full">
                                            <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">
                                                {searchType === "cars"
                                                    ? "Vehicle Type"
                                                    : "Guests"}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={
                                                    searchType === "cars"
                                                        ? "SUV, Economy, etc."
                                                        : "Add guests"
                                                }
                                                className="w-full border-0 p-0 text-sm focus:ring-0 placeholder-zinc-400 text-zinc-950 outline-none bg-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Search Button */}
                                    <div className="px-2 md:pl-4 md:pr-0 pt-2 md:pt-0 flex items-center">
                                        <button
                                            type="button"
                                            onClick={handleSearch}
                                            className="w-full md:w-auto bg-zinc-950 text-white px-8 py-4 md:py-3 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center"
                                        >
                                            <Search className="w-4 h-4 mr-2" />
                                            Search
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-28 sm:h-24"></div>

                {/* Diverse Listings Showcase */}
                
                <HerorResorcesCard resources={resources} initialFilter={currentFilters?.category || ''}/>
                
            </div>
        </MainLayout>
    );
}
