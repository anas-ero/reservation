import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Building, 
    Wallet, 
    CalendarClock, 
    Activity, 
    Plus, 
    MapPin, 
    Car, 
    Tent
} from 'lucide-react';

export default function OwnerDashboard({ auth, stats, recentResources }) {
    
    // Helper function to pick an icon based on resource type
    const getIconForType = (type) => {
        switch(type) {
            case 'car': return <Car className="w-4 h-4 text-blue-500" />;
            case 'villa': return <Building className="w-4 h-4 text-emerald-500" />;
            case 'sports_pitch': return <Tent className="w-4 h-4 text-orange-500" />;
            default: return <Building className="w-4 h-4 text-zinc-500" />;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-zinc-800 leading-tight">Partner Overview</h2>}
        >
            <Head title="Owner Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* --- 1. STATS GRID --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        
                        {/* Stat Card 1 */}
                        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm flex flex-col">
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-zinc-500">Total Listings</span>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Activity className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <span className="text-3xl font-bold text-zinc-900 mt-4">{stats.total_resources}</span>
                            <span className="text-xs text-zinc-400 mt-1">{stats.active_resources} currently active</span>
                        </div>

                        {/* Stat Card 2 */}
                        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm flex flex-col">
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-zinc-500">Monthly Revenue</span>
                                <div className="p-2 bg-emerald-50 rounded-lg">
                                    <Wallet className="w-5 h-5 text-emerald-600" />
                                </div>
                            </div>
                            <span className="text-3xl font-bold text-zinc-900 mt-4">{stats.monthly_revenue} <span className="text-lg text-zinc-400 font-medium">MAD</span></span>
                            <span className="text-xs text-zinc-400 mt-1">Pending payout calculation</span>
                        </div>

                        {/* Stat Card 3 */}
                        <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm flex flex-col">
                            <div className="flex justify-between items-start">
                                <span className="text-sm font-medium text-zinc-500">Pending Bookings</span>
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <CalendarClock className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                            <span className="text-3xl font-bold text-zinc-900 mt-4">{stats.pending_bookings}</span>
                            <span className="text-xs text-zinc-400 mt-1">Requires your approval</span>
                        </div>
                    </div>


                    {/* --- 2. RECENT RESOURCES SECTION --- */}
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                        
                        {/* Header & Action Button */}
                        <div className="px-6 py-5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
                            <div>
                                <h3 className="text-base font-bold text-zinc-900">Your Recent Listings</h3>
                                <p className="text-sm text-zinc-500 mt-0.5">Manage your properties, vehicles, and spaces.</p>
                            </div>
                            
                            {/* This links to the route we made in the previous step! */}
                            <Link 
                                href={route('partner.resources.create')}
                                className="inline-flex items-center justify-center px-4 py-2 bg-zinc-950 text-white text-sm font-semibold rounded-lg hover:bg-zinc-800 transition-colors shadow-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Create Listing
                            </Link>
                        </div>

                        {/* Data Table / Empty State */}
                        {recentResources.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                                    <Building className="w-8 h-8 text-zinc-300" />
                                </div>
                                <h4 className="text-lg font-semibold text-zinc-900">No listings yet</h4>
                                <p className="text-zinc-500 mt-1 max-w-sm">You haven't added any resources to your portfolio. Create your first listing to start accepting bookings.</p>
                                <Link 
                                    href={route('partner.resources.create')}
                                    className="mt-6 text-sm font-medium text-zinc-900 underline hover:text-zinc-600"
                                >
                                    Get started &rarr;
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-white border-b border-zinc-100 text-zinc-500">
                                        <tr>
                                            <th className="px-6 py-4 font-medium">Resource Name</th>
                                            <th className="px-6 py-4 font-medium">Location</th>
                                            <th className="px-6 py-4 font-medium">Price</th>
                                            <th className="px-6 py-4 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {recentResources.map((resource) => (
                                            <tr key={resource.id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-zinc-100 rounded-md">
                                                            {getIconForType(resource.type)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-zinc-900">{resource.name}</div>
                                                            <div className="text-zinc-500 text-xs capitalize">{resource.type.replace('_', ' ')}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5 text-zinc-600">
                                                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                                        {resource.location}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-zinc-900">{resource.price} MAD</span>
                                                    <span className="text-zinc-500 text-xs"> / unit</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {resource.is_active ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                                                            Hidden
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        {/* Footer Link to see all resources */}
                        {recentResources.length > 0 && (
                            <div className="px-6 py-3 border-t border-zinc-200 bg-zinc-50 text-center">
                                <Link href={route('partner.resources.index')} className="text-sm font-medium text-zinc-600 hover:text-zinc-900">
                                    View all resources
                                </Link>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}