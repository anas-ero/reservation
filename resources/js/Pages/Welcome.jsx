import { Head, Link } from '@inertiajs/react';
import { 
    Search, MapPin, Calendar, Users, 
    Music, Laptop, Palette, Trophy, ArrowRight 
} from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
            <Head title="Find Events - EventFlow" />

            {/* Navigation */}
            <header className="bg-white border-b border-zinc-200">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-extrabold tracking-tight">EventFlow</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 hidden sm:block">
                            List your event
                        </Link>
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="text-sm font-medium text-zinc-950 hover:underline">
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={route('login')} className="text-sm font-medium text-zinc-950">
                                    Sign in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-900"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero & Search Booking Engine */}
            <section className="bg-zinc-950 pt-16 pb-32 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                        Find your next experience.
                    </h1>
                    <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto">
                        Discover and book the best concerts, workshops, and tech events happening near you.
                    </p>
                </div>

                {/* The "Booking.com" Style Search Bar */}
                <div className="absolute left-0 right-0 -bottom-8 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl border border-zinc-200 p-2 sm:p-4">
                        <form className="flex flex-col md:flex-row gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                            
                            {/* Location / Event Type */}
                            <div className="flex-1 flex items-center px-4 py-2 md:py-0">
                                <MapPin className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">Location or Event</label>
                                    <input 
                                        type="text" 
                                        placeholder="Where are you going?" 
                                        className="w-full border-0 p-0 text-sm focus:ring-0 placeholder-zinc-500 text-zinc-950 outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Date Picker (Mock) */}
                            <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                                <Calendar className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">Dates</label>
                                    <input 
                                        type="text" 
                                        placeholder="Add dates" 
                                        className="w-full border-0 p-0 text-sm focus:ring-0 placeholder-zinc-500 text-zinc-950 outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Guests / Tickets */}
                            <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                                <Users className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">Tickets</label>
                                    <input 
                                        type="text" 
                                        placeholder="1 Adult" 
                                        className="w-full border-0 p-0 text-sm focus:ring-0 placeholder-zinc-500 text-zinc-950 outline-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="px-2 md:pl-4 md:pr-0 pt-2 md:pt-0 flex items-center">
                                <button type="button" className="w-full md:w-auto bg-zinc-950 text-white px-8 py-4 md:py-3 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center">
                                    <Search className="w-4 h-4 mr-2" />
                                    Search
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </section>

            {/* Add margin to account for absolute positioned search bar */}
            <div className="h-20 sm:h-16"></div>

            {/* Quick Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    <button className="flex flex-col items-center justify-center min-w-[100px] gap-2 text-zinc-500 hover:text-zinc-950 group transition-colors">
                        <Music className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Concerts</span>
                    </button>
                    <button className="flex flex-col items-center justify-center min-w-[100px] gap-2 text-zinc-500 hover:text-zinc-950 group transition-colors">
                        <Laptop className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Tech & Dev</span>
                    </button>
                    <button className="flex flex-col items-center justify-center min-w-[100px] gap-2 text-zinc-500 hover:text-zinc-950 group transition-colors">
                        <Palette className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Arts</span>
                    </button>
                    <button className="flex flex-col items-center justify-center min-w-[100px] gap-2 text-zinc-500 hover:text-zinc-950 group transition-colors">
                        <Trophy className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">Sports</span>
                    </button>
                </div>
            </section>

            {/* Trending Locations / Events */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Trending in Morocco</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Booking Card 1 */}
                    <Link href="#" className="group">
                        <div className="aspect-square bg-zinc-200 rounded-xl mb-3 overflow-hidden relative">
                            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                Casablanca
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-zinc-950 group-hover:underline">DevFest 2026</h3>
                                <p className="text-sm text-zinc-500">Oct 15 - Oct 17</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold">250 MAD</span>
                            </div>
                        </div>
                    </Link>

                    {/* Booking Card 2 */}
                    <Link href="#" className="group">
                        <div className="aspect-square bg-zinc-200 rounded-xl mb-3 overflow-hidden relative">
                            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                Marrakech
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-zinc-950 group-hover:underline">Oasis Festival</h3>
                                <p className="text-sm text-zinc-500">Sep 05 - Sep 07</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold">800 MAD</span>
                            </div>
                        </div>
                    </Link>

                    {/* Booking Card 3 */}
                    <Link href="#" className="group">
                        <div className="aspect-square bg-zinc-200 rounded-xl mb-3 overflow-hidden relative">
                            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                Rabat
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-zinc-950 group-hover:underline">Mawazine</h3>
                                <p className="text-sm text-zinc-500">Jun 20 - Jun 28</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold">Free - 500 MAD</span>
                            </div>
                        </div>
                    </Link>
                    
                    {/* Booking Card 4 */}
                    <Link href="#" className="group">
                        <div className="aspect-square bg-zinc-200 rounded-xl mb-3 overflow-hidden relative">
                            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                Tangier
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-zinc-950 group-hover:underline">Jazz Festival</h3>
                                <p className="text-sm text-zinc-500">Sep 18 - Sep 21</p>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-sm font-bold">350 MAD</span>
                            </div>
                        </div>
                    </Link>
                </div>
                
                <div className="mt-10 text-center">
                    <button className="border border-zinc-950 text-zinc-950 px-6 py-3 rounded-lg font-medium text-sm hover:bg-zinc-50 transition-colors">
                        Show more events
                    </button>
                </div>
            </section>

        </div>
    );
}