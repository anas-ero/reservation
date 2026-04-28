import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { 
    Search, MapPin, Calendar, Users, 
    Bed, Car, Trophy, Briefcase, ChevronRight, Star
} from 'lucide-react';

export default function Welcome({ auth }) {
    // State to handle the multi-category search tabs
    const [searchType, setSearchType] = useState('stays');

    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-950 font-sans selection:bg-zinc-900 selection:text-white">
            <Head title="Book Anything - ReserveFlow" />

            {/* Navigation */}
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-zinc-950 p-1.5 rounded-md">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">ReserveFlow</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <Link href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-950 hidden md:block">
                            Partner with us
                        </Link>
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="text-sm font-medium text-zinc-950 hover:underline">
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href={route('login')} className="text-sm font-medium text-zinc-950 hover:text-zinc-700 transition-colors">
                                    Sign in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-800"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero & Tabbed Search Engine */}
            <section className="bg-zinc-950 pt-20 pb-40 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
                        Reserve whatever you need, <br className="hidden md:block"/> whenever you need it.
                    </h1>
                    <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto">
                        From luxury villas and rental cars to football pitches and co-working spaces. One platform for all your bookings.
                    </p>
                </div>

                {/* The Multi-Category Search Engine */}
                <div className="absolute left-0 right-0 -bottom-16 px-4 sm:px-6 lg:px-8 z-10">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
                        
                        {/* Search Type Tabs */}
                        <div className="flex border-b border-zinc-200 bg-zinc-50/50 overflow-x-auto hide-scrollbar">
                            <button 
                                onClick={() => setSearchType('stays')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${searchType === 'stays' ? 'border-zinc-950 text-zinc-950 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'}`}
                            >
                                <Bed className="w-4 h-4" /> Stays & Hotels
                            </button>
                            <button 
                                onClick={() => setSearchType('cars')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${searchType === 'cars' ? 'border-zinc-950 text-zinc-950 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'}`}
                            >
                                <Car className="w-4 h-4" /> Car Rentals
                            </button>
                            <button 
                                onClick={() => setSearchType('sports')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${searchType === 'sports' ? 'border-zinc-950 text-zinc-950 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'}`}
                            >
                                <Trophy className="w-4 h-4" /> Sports Venues
                            </button>
                            <button 
                                onClick={() => setSearchType('workspaces')}
                                className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap ${searchType === 'workspaces' ? 'border-zinc-950 text-zinc-950 bg-white' : 'border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100'}`}
                            >
                                <Briefcase className="w-4 h-4" /> Workspaces
                            </button>
                        </div>

                        {/* Search Inputs */}
                        <div className="p-2 sm:p-4">
                            <form className="flex flex-col md:flex-row gap-2 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-zinc-200">
                                
                                {/* Dynamic Location/Facility Input */}
                                <div className="flex-1 flex items-center px-4 py-2 md:py-0">
                                    <MapPin className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                    <div className="w-full">
                                        <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">
                                            {searchType === 'sports' ? 'Facility or City' : 'Location'}
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder={searchType === 'sports' ? 'e.g. 5v5 Pitch, Casablanca' : 'Where are you going?'} 
                                            className="w-full border-0 p-0 text-sm focus:ring-0 placeholder-zinc-400 text-zinc-950 outline-none bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Dates */}
                                <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                                    <Calendar className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />
                                    <div className="w-full">
                                        <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">
                                            {searchType === 'sports' || searchType === 'workspaces' ? 'Date & Time' : 'Check in - Check out'}
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder={searchType === 'sports' ? 'Select date and hours' : 'Add dates'} 
                                            className="w-full border-0 p-0 text-sm focus:ring-0 placeholder-zinc-400 text-zinc-950 outline-none bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Options */}
                                <div className="flex-1 flex items-center px-4 py-3 md:py-0">
                                    {searchType === 'cars' ? <Car className="w-5 h-5 text-zinc-400 mr-3 shrink-0" /> : <Users className="w-5 h-5 text-zinc-400 mr-3 shrink-0" />}
                                    <div className="w-full">
                                        <label className="block text-xs font-bold text-zinc-950 uppercase tracking-wider mb-1">
                                            {searchType === 'cars' ? 'Vehicle Type' : 'Guests'}
                                        </label>
                                        <input 
                                            type="text" 
                                            placeholder={searchType === 'cars' ? 'SUV, Economy, etc.' : 'Add guests'} 
                                            className="w-full border-0 p-0 text-sm focus:ring-0 placeholder-zinc-400 text-zinc-950 outline-none bg-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Search Button */}
                                <div className="px-2 md:pl-4 md:pr-0 pt-2 md:pt-0 flex items-center">
                                    <button type="button" className="w-full md:w-auto bg-zinc-950 text-white px-8 py-4 md:py-3 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center">
                                        <Search className="w-4 h-4 mr-2" />
                                        Search
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-28 sm:h-24"></div>

            {/* Diverse Listings Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-zinc-950">Featured Reservations</h2>
                        <p className="text-zinc-500 mt-1">Top-rated spots and rentals available right now.</p>
                    </div>
                    <Link href="#" className="hidden sm:flex items-center text-sm font-medium text-zinc-950 hover:underline">
                        View all <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stay Card */}
                    <Link href="#" className="group flex flex-col">
                        <div className="aspect-[4/3] bg-zinc-200 rounded-xl mb-4 overflow-hidden relative">
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center">
                                <Bed className="w-3 h-3 mr-1.5" /> Villa
                            </div>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-zinc-950 group-hover:underline">Atlas View Villa</h3>
                            <div className="flex items-center text-sm font-medium">
                                <Star className="w-3 h-3 fill-zinc-950 text-zinc-950 mr-1" /> 4.9
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 mb-2">Marrakech • Up to 8 guests</p>
                        <p className="text-sm text-zinc-950 mt-auto"><span className="font-bold">1,200 MAD</span> / night</p>
                    </Link>

                    {/* Car Card */}
                    <Link href="#" className="group flex flex-col">
                        <div className="aspect-[4/3] bg-zinc-200 rounded-xl mb-4 overflow-hidden relative">
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center">
                                <Car className="w-3 h-3 mr-1.5" /> SUV
                            </div>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-zinc-950 group-hover:underline">Range Rover Sport</h3>
                            <div className="flex items-center text-sm font-medium">
                                <Star className="w-3 h-3 fill-zinc-950 text-zinc-950 mr-1" /> 5.0
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 mb-2">Casablanca • Auto • 5 Seats</p>
                        <p className="text-sm text-zinc-950 mt-auto"><span className="font-bold">850 MAD</span> / day</p>
                    </Link>

                    {/* Pitch Card */}
                    <Link href="#" className="group flex flex-col">
                        <div className="aspect-[4/3] bg-zinc-200 rounded-xl mb-4 overflow-hidden relative">
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center">
                                <Trophy className="w-3 h-3 mr-1.5" /> Sports
                            </div>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-zinc-950 group-hover:underline">City Club 5v5 Pitch</h3>
                            <div className="flex items-center text-sm font-medium">
                                <Star className="w-3 h-3 fill-zinc-950 text-zinc-950 mr-1" /> 4.7
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 mb-2">Rabat • Synthetic Turf • Showers</p>
                        <p className="text-sm text-zinc-950 mt-auto"><span className="font-bold">300 MAD</span> / hour</p>
                    </Link>
                    
                    {/* Workspace Card */}
                    <Link href="#" className="group flex flex-col">
                        <div className="aspect-[4/3] bg-zinc-200 rounded-xl mb-4 overflow-hidden relative">
                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center">
                                <Briefcase className="w-3 h-3 mr-1.5" /> Workspace
                            </div>
                        </div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-zinc-950 group-hover:underline">TechHub Meeting Room</h3>
                            <div className="flex items-center text-sm font-medium">
                                <Star className="w-3 h-3 fill-zinc-950 text-zinc-950 mr-1" /> 4.8
                            </div>
                        </div>
                        <p className="text-sm text-zinc-500 mb-2">Tangier • Up to 10 people • Wi-Fi</p>
                        <p className="text-sm text-zinc-950 mt-auto"><span className="font-bold">150 MAD</span> / hour</p>
                    </Link>
                </div>
            </section>
            
        </div>
    );
}