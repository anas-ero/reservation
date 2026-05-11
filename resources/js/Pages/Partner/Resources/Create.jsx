import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Building, MapPin, AlignLeft, Tags, ArrowLeft } from 'lucide-react';

export default function CreateListing({ auth }) {
    
    // Inertia's built-in form helper makes handling validation errors a breeze
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        type: '', 
        price: '',
        location: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // This sends the data to the store() method in your PartnerResourceController
        post(route('partner.resources.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('owner.dashboard')} className="text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-zinc-800 leading-tight">Create New Listing</h2>
                </div>
            }
        >
            <Head title="Create Listing" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-zinc-200 bg-zinc-50/50">
                            <h3 className="text-lg font-bold text-zinc-900">Listing Details</h3>
                            <p className="text-sm text-zinc-500">Provide the basic information for what you are renting out.</p>
                        </div>

                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                
                                {/* 1. Name & Type */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2">
                                            <Building className="w-4 h-4 text-zinc-400" />
                                            Listing Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950 rounded-lg shadow-sm"
                                            placeholder="e.g., Atlas Mountain Villa"
                                            required
                                        />
                                        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2">
                                            <Tags className="w-4 h-4 text-zinc-400" />
                                            Resource Type
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950 rounded-lg shadow-sm"
                                        >
                                            <option value="">Select a type</option>
                                            <option value="villa">Villa / Apartment</option>
                                            <option value="car">Vehicle / Car</option>
                                            <option value="sports_pitch">Sports Pitch</option>
                                        </select>
                                        {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                                    </div>
                                </div>

                                {/* 2. Location & Price */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-zinc-400" />
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="w-full border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950 rounded-lg shadow-sm"
                                            placeholder="e.g., Marrakech, Gueliz"
                                            required
                                        />
                                        {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2">
                                            <span className="font-bold text-zinc-400 ml-1">MAD</span>
                                            Price (per day/unit)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className="w-full border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950 rounded-lg shadow-sm"
                                            placeholder="0.00"
                                            required
                                        />
                                        {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                    </div>
                                </div>

                                {/* 3. Description */}
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1 flex items-center gap-2">
                                        <AlignLeft className="w-4 h-4 text-zinc-400" />
                                        Description
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="w-full border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950 rounded-lg shadow-sm"
                                        placeholder="Describe the amenities, rules, and features..."
                                        required
                                    ></textarea>
                                    {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                                </div>

                                {/* Submit Area */}
                                <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                                    <Link 
                                        href={route('owner.dashboard')} 
                                        className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 text-sm font-bold text-white bg-zinc-950 rounded-lg hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                                    >
                                        {processing ? 'Saving...' : 'Publish Listing'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}