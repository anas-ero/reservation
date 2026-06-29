import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const TYPE_OPTIONS = [
    { value: 'hotel', label: 'Hotel / Stay' },
    { value: 'car', label: 'Car' },
    { value: 'pitch', label: 'Pitch' },
];

export default function EditResource({ auth, resource }) {
    const { data, setData, patch, processing, errors } = useForm({
        title: resource?.title ?? '',
        type: resource?.type ?? 'hotel',
        price: resource?.price ?? '',
        pricing_type: resource?.pricing_type ?? 'daily',
        location: resource?.location ?? '',
        max_guests: resource?.max_guests ?? 1,
        bathrooms: resource?.bathrooms ?? 0,
        exclude_infants: Boolean(resource?.exclude_infants),
        allows_children: Boolean(resource?.allows_children),
        description: resource?.description ?? '',
        images: [],
    });

    const handleImageChange = (e) => {
        setData("images", Array.from(e.target.files));
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('partner.resources.update', resource.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('partner.resources.index')}
                        className="text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                        Edit Listing
                    </h2>
                </div>
            }
        >
            <Head title="Edit Listing" />

            <div className="py-10">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-zinc-200 bg-zinc-50/60">
                            <h3 className="text-lg font-bold text-zinc-900">Quick Update</h3>
                            <p className="text-sm text-zinc-500">Update only the essential listing details.</p>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                    />
                                    {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Type</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                    >
                                        {TYPE_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                    />
                                    {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Pricing type</label>
                                    <select
                                        value={data.pricing_type}
                                        onChange={(e) => setData('pricing_type', e.target.value)}
                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                    >
                                        <option value="hourly">Hourly</option>
                                        <option value="daily">Daily</option>
                                        <option value="nightly">Nightly</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Max guests</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.max_guests}
                                        onChange={(e) => setData('max_guests', e.target.value)}
                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-700 mb-1">Bathrooms</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.bathrooms}
                                        onChange={(e) => setData('bathrooms', e.target.value)}
                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.exclude_infants)}
                                        onChange={(e) => setData('exclude_infants', e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                    />
                                    Exclude infants from guests count
                                </label>
                                <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.allows_children)}
                                        onChange={(e) => setData('allows_children', e.target.checked)}
                                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                    />
                                    Allow children
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
                                <textarea
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                />
                                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1">Upload New Photos</label>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    className="w-full text-sm text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-zinc-50 file:text-zinc-700 hover:file:bg-zinc-100" 
                                />
                                {data.images && data.images.length > 0 && (
                                    <p className="text-xs text-zinc-500 mt-2">{data.images.length} files selected</p>
                                )}
                                {errors.images && <p className="text-sm text-red-600 mt-1">{errors.images}</p>}
                                
                                {resource.images && resource.images.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-zinc-700 mb-2">Current Photos</p>
                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {resource.images.map((img) => (
                                                <img 
                                                    key={img.id} 
                                                    src={`/storage/${img.path}`} 
                                                    alt="Resource photo" 
                                                    className="w-24 h-24 object-cover rounded-lg border border-zinc-200"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                                <Link
                                    href={route('partner.resources.index')}
                                    className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 text-sm font-bold text-white bg-zinc-950 rounded-xl hover:bg-zinc-800 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
