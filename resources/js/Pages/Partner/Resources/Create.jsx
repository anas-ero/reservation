import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    ArrowLeft,
    BedDouble,
    Building,
    Car,
    MapPin,
    MenuSquare,
    Minus,
    Plus,
    Tent,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const LISTING_TYPES = [
    {
        value: 'stays',
        label: 'Stay / House',
        description: 'Villa, apartment, guest house, or home stay',
        icon: Building,
    },
    {
        value: 'cars',
        label: 'Car',
        description: 'Vehicle rental with daily or hourly pricing',
        icon: Car,
    },
    {
        value: 'sports',
        label: 'Pitch',
        description: 'Sports field, court, or training space',
        icon: Tent,
    },
];

const PRICING_TYPES = [
    { value: 'nightly', label: 'Nightly' },
    { value: 'daily', label: 'Daily' },
    { value: 'hourly', label: 'Hourly' },
];

const DEFAULT_PRICING = {
    stays: 'nightly',
    cars: 'daily',
    sports: 'hourly',
};

const DEFAULT_ROOMS = [
    {
        room_type: 'Bedroom 1',
        removable: false,
        beds: [{ count: 1, type: 'full bed' }],
    },
    {
        room_type: 'Living room',
        removable: false,
        beds: [{ count: 1, type: 'sofa bed' }],
    },
    {
        room_type: 'Other spaces',
        removable: false,
        beds: [{ count: 1, type: 'king bed' }],
    },
];

const AMENITY_OPTIONS = [
    'Air conditioning',
    'Heating',
    'Wi-Fi',
    'TV',
    'Kitchen',
    'Parking',
    'Washer',
    'Pool',
    'Other',
];

const LANGUAGE_OPTIONS = ['Arabic', 'French', 'English', 'Spanish'];

export default function CreateListing({ auth }) {
    const [step, setStep] = useState(1);
    const [bedroomCounter, setBedroomCounter] = useState(2);
    const [openRoomIndex, setOpenRoomIndex] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        type: '',
        pricing_type: 'nightly',
        location: '',
        address: '',
        postal_code: '',
        country: 'Morocco',
        price: '',
        description: '',
        max_guests: 4,
        exclude_infants: false,
        bathrooms: 2,
        allows_children: false,
        rooms: DEFAULT_ROOMS,
        amenities: [],
        custom_amenity: '',
        breakfast_included: false,
        languages: [],
        smoking_allowed: false,
        parties_allowed: false,
        pets_allowed: 'no',
        check_in_from: '15:00',
        check_in_until: '18:00',
        check_out_from: '08:00',
        check_out_until: '11:00',
    });

    const selectedType = LISTING_TYPES.find((item) => item.value === data.type);

    const mapPreviewUrl = useMemo(() => {
        const query = [data.address, data.location, data.postal_code, data.country]
            .filter((value) => value && String(value).trim().length > 0)
            .join(', ');

        if (!query) {
            return null;
        }

        return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    }, [data.address, data.location, data.postal_code, data.country]);

    const handleTypeChange = (value) => {
        setData('type', value);
        setData('pricing_type', DEFAULT_PRICING[value] || 'nightly');
    };

    const updateRoom = (index, key, value) => {
        const nextRooms = [...data.rooms];
        nextRooms[index] = {
            ...nextRooms[index],
            [key]: value,
        };
        setData('rooms', nextRooms);
    };

    const updateRoomBed = (roomIndex, bedIndex, key, value) => {
        const nextRooms = [...data.rooms];
        const nextBeds = [...nextRooms[roomIndex].beds];
        nextBeds[bedIndex] = {
            ...nextBeds[bedIndex],
            [key]: key === 'count' ? Math.max(1, Number(value) || 1) : value,
        };
        nextRooms[roomIndex] = {
            ...nextRooms[roomIndex],
            beds: nextBeds,
        };
        setData('rooms', nextRooms);
    };

    const addBedToRoom = (roomIndex) => {
        const nextRooms = [...data.rooms];
        nextRooms[roomIndex] = {
            ...nextRooms[roomIndex],
            beds: [...nextRooms[roomIndex].beds, { count: 1, type: 'queen bed' }],
        };
        setData('rooms', nextRooms);
    };

    const removeBedFromRoom = (roomIndex, bedIndex) => {
        const nextRooms = [...data.rooms];
        if (nextRooms[roomIndex].beds.length <= 1) {
            return;
        }
        nextRooms[roomIndex] = {
            ...nextRooms[roomIndex],
            beds: nextRooms[roomIndex].beds.filter((_, i) => i !== bedIndex),
        };
        setData('rooms', nextRooms);
    };

    const addBedroom = () => {
        const next = bedroomCounter + 1;
        setBedroomCounter(next);
        setData('rooms', [
            ...data.rooms,
            {
                room_type: `Bedroom ${next}`,
                beds: [{ count: 1, type: 'queen bed' }],
                removable: true,
            },
        ]);
    };

    const removeRoom = (index) => {
        const room = data.rooms[index];
        if (!room?.removable) {
            return;
        }
        setData(
            'rooms',
            data.rooms.filter((_, i) => i !== index),
        );
    };

    const toggleAmenity = (amenity) => {
        if (data.amenities.includes(amenity)) {
            setData(
                'amenities',
                data.amenities.filter((item) => item !== amenity),
            );
            if (amenity === 'Other') {
                setData('custom_amenity', '');
            }
            return;
        }
        setData('amenities', [...data.amenities, amenity]);
    };

    const toggleLanguage = (language) => {
        if (data.languages.includes(language)) {
            setData(
                'languages',
                data.languages.filter((item) => item !== language),
            );
            return;
        }
        setData('languages', [...data.languages, language]);
    };

    const goNext = () => setStep((current) => Math.min(current + 1, 3));
    const goBack = () => setStep((current) => Math.max(current - 1, 1));

    const submit = (e) => {
        e.preventDefault();
        post(route('partner.resources.store'));
    };

    const stepLabel = {
        1: 'Choose your listing type',
        2: 'Add the map location',
        3: 'Property details',
    }[step];

    const canContinueStep1 = data.title.trim().length > 0 && data.type.length > 0;
    const canContinueStep2 =
        data.location.trim().length > 0 &&
        data.address.trim().length > 0 &&
        data.postal_code.trim().length > 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Link
                        href={route('owner.dashboard')}
                        className="text-zinc-400 hover:text-zinc-900 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                            Create Specialized Listing
                        </h2>
                        <p className="text-sm text-zinc-500">{stepLabel}</p>
                    </div>
                </div>
            }
        >
            <Head title="Create Listing" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="border-b border-zinc-200 bg-zinc-50/80 px-6 py-5">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-zinc-900">
                                        Booking-style listing setup
                                    </h3>
                                    <p className="text-sm text-zinc-500 max-w-2xl">
                                        Select category, set location, and define complete property details.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                    <span className={`px-3 py-1 rounded-full ${step >= 1 ? 'bg-zinc-950 text-white' : 'bg-zinc-100'}`}>1</span>
                                    <span className={`px-3 py-1 rounded-full ${step >= 2 ? 'bg-zinc-950 text-white' : 'bg-zinc-100'}`}>2</span>
                                    <span className={`px-3 py-1 rounded-full ${step >= 3 ? 'bg-zinc-950 text-white' : 'bg-zinc-100'}`}>3</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            <form onSubmit={submit} className="space-y-8">
                                {step === 1 && (
                                    <section className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 mb-2">
                                                    Listing name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.title}
                                                    onChange={(e) => setData('title', e.target.value)}
                                                    className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                                    placeholder="e.g. Atlas Mountain Villa"
                                                    required
                                                />
                                                {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                                            </div>

                                            <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4">
                                                <p className="text-sm font-semibold text-zinc-900">Selected type</p>
                                                <p className="mt-1 text-sm text-zinc-500">
                                                    {selectedType ? selectedType.label : 'Choose one below'}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-800">
                                                <MenuSquare className="w-4 h-4 text-zinc-400" />
                                                Choose what you want to list
                                            </div>

                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                                {LISTING_TYPES.map((item) => {
                                                    const Icon = item.icon;
                                                    const active = data.type === item.value;
                                                    return (
                                                        <button
                                                            key={item.value}
                                                            type="button"
                                                            onClick={() => handleTypeChange(item.value)}
                                                            className={`rounded-2xl border p-5 text-left transition-all ${
                                                                active
                                                                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-lg shadow-zinc-950/10'
                                                                    : 'border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-sm'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-500'}`} />
                                                                <span className={`text-xs font-semibold uppercase tracking-wider ${active ? 'text-zinc-200' : 'text-zinc-400'}`}>
                                                                    Step 1
                                                                </span>
                                                            </div>
                                                            <h4 className="mt-4 text-base font-bold">{item.label}</h4>
                                                            <p className={`mt-2 text-sm ${active ? 'text-zinc-200' : 'text-zinc-500'}`}>{item.description}</p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {errors.type && <p className="text-sm text-red-600 mt-2">{errors.type}</p>}
                                        </div>
                                    </section>
                                )}

                                {step === 2 && (
                                    <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 mb-2">Area / city</label>
                                                <input
                                                    type="text"
                                                    value={data.location}
                                                    onChange={(e) => setData('location', e.target.value)}
                                                    className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                                    placeholder="e.g. Marrakech - Gueliz"
                                                    required
                                                />
                                                {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 mb-2">Full address</label>
                                                <input
                                                    type="text"
                                                    value={data.address}
                                                    onChange={(e) => setData('address', e.target.value)}
                                                    className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                                    placeholder="Street, building, district"
                                                    required
                                                />
                                                {errors.address && <p className="text-sm text-red-600 mt-1">{errors.address}</p>}
                                            </div>

                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700 mb-2">Postal code</label>
                                                    <input
                                                        type="text"
                                                        value={data.postal_code}
                                                        onChange={(e) => setData('postal_code', e.target.value)}
                                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                                        placeholder="40000"
                                                        required
                                                    />
                                                    {errors.postal_code && <p className="text-sm text-red-600 mt-1">{errors.postal_code}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-zinc-700 mb-2">Country</label>
                                                    <input
                                                        type="text"
                                                        value={data.country}
                                                        onChange={(e) => setData('country', e.target.value)}
                                                        className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                                        placeholder="Morocco"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50">
                                            <div className="border-b border-zinc-200 px-4 py-3">
                                                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                                                    <MapPin className="w-4 h-4 text-zinc-500" />
                                                    Map preview
                                                </div>
                                                <p className="mt-1 text-xs text-zinc-500">Enter the address to show the place on the map.</p>
                                            </div>

                                            <div className="h-[420px] bg-zinc-100">
                                                {mapPreviewUrl ? (
                                                    <iframe
                                                        title="Map preview"
                                                        src={mapPreviewUrl}
                                                        className="h-full w-full border-0"
                                                        loading="lazy"
                                                        referrerPolicy="no-referrer-when-downgrade"
                                                    />
                                                ) : (
                                                    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                                                            <MapPin className="w-7 h-7 text-zinc-300" />
                                                        </div>
                                                        <p className="mt-4 text-sm font-semibold text-zinc-900">Waiting for address</p>
                                                        <p className="mt-2 text-sm text-zinc-500 max-w-xs">Enter the full address to preview the location.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {step === 3 && (
                                    <section className="space-y-8">
                                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 mb-2">Pricing type</label>
                                                <select
                                                    value={data.pricing_type}
                                                    onChange={(e) => setData('pricing_type', e.target.value)}
                                                    className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                                >
                                                    {PRICING_TYPES.map((pricingType) => (
                                                        <option key={pricingType.value} value={pricingType.value}>
                                                            {pricingType.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.pricing_type && <p className="text-sm text-red-600 mt-1">{errors.pricing_type}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-zinc-700 mb-2">Price</label>
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-4 flex items-center text-sm font-semibold text-zinc-400">MAD</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={data.price}
                                                        onChange={(e) => setData('price', e.target.value)}
                                                        className="w-full rounded-xl border-zinc-300 pl-14 focus:border-zinc-950 focus:ring-zinc-950"
                                                        placeholder="0.00"
                                                        required
                                                    />
                                                </div>
                                                {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price}</p>}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
                                            <div className="flex items-center gap-2">
                                                <BedDouble className="w-4 h-4 text-zinc-500" />
                                                <h4 className="text-base font-semibold text-zinc-900">Where can people sleep?</h4>
                                            </div>

                                            <div className="space-y-3">
                                                {data.rooms.map((room, index) => (
                                                    <div key={`${room.room_type}-${index}`} className="rounded-xl border border-zinc-200">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setOpenRoomIndex(
                                                                    openRoomIndex === index ? null : index,
                                                                )
                                                            }
                                                            className="flex w-full items-center justify-between gap-4 p-4 text-left"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-semibold text-zinc-900">
                                                                    {room.room_type}
                                                                </p>
                                                                <p className="text-sm text-zinc-600">
                                                                    {room.beds
                                                                        .map((bed) => `${bed.count} ${bed.type}`)
                                                                        .join(', ')}
                                                                </p>
                                                            </div>
                                                            <span className="text-xs font-medium text-zinc-500">
                                                                {openRoomIndex === index ? 'Hide' : 'Edit'}
                                                            </span>
                                                        </button>

                                                        {openRoomIndex === index && (
                                                            <div className="space-y-3 border-t border-zinc-200 p-4">
                                                                <input
                                                                    type="text"
                                                                    value={room.room_type}
                                                                    onChange={(e) => updateRoom(index, 'room_type', e.target.value)}
                                                                    className="w-full rounded-lg border-zinc-300 text-sm font-semibold focus:border-zinc-950 focus:ring-zinc-950"
                                                                />
                                                                {room.beds.map((bed, bedIndex) => (
                                                                    <div key={`${index}-${bedIndex}`} className="grid grid-cols-[90px_1fr_auto] gap-2">
                                                                        <input
                                                                            type="number"
                                                                            min="1"
                                                                            value={bed.count}
                                                                            onChange={(e) =>
                                                                                updateRoomBed(
                                                                                    index,
                                                                                    bedIndex,
                                                                                    'count',
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-950 focus:ring-zinc-950"
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            value={bed.type}
                                                                            onChange={(e) =>
                                                                                updateRoomBed(
                                                                                    index,
                                                                                    bedIndex,
                                                                                    'type',
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-950 focus:ring-zinc-950"
                                                                            placeholder="queen bed"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => removeBedFromRoom(index, bedIndex)}
                                                                            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                                                                        >
                                                                            <Minus className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addBedToRoom(index)}
                                                                    className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                                                                >
                                                                    <Plus className="w-4 h-4" /> Add bed
                                                                </button>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-end px-4 pb-4">
                                                            {room.removable && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeRoom(index)}
                                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                type="button"
                                                onClick={addBedroom}
                                                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                                            >
                                                <Plus className="w-4 h-4" /> Add bedroom
                                            </button>
                                            {errors.rooms && <p className="text-sm text-red-600">{errors.rooms}</p>}
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-5">
                                            <h4 className="text-base font-semibold text-zinc-900">How many guests can stay?</h4>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('max_guests', Math.max(1, Number(data.max_guests) - 1))}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="min-w-8 text-center text-lg font-semibold text-zinc-900">{data.max_guests}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('max_guests', Number(data.max_guests) + 1)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <label className="flex items-center gap-2 text-sm text-zinc-700">
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(data.exclude_infants)}
                                                    onChange={(e) => setData('exclude_infants', e.target.checked)}
                                                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                />
                                                Exclude infants (0-2 years old) from total number of guests
                                            </label>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
                                            <h4 className="text-base font-semibold text-zinc-900">How many bathrooms are there?</h4>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setData('bathrooms', Math.max(0, Number(data.bathrooms) - 1))}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="min-w-8 text-center text-lg font-semibold text-zinc-900">{data.bathrooms}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('bathrooms', Number(data.bathrooms) + 1)}
                                                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 hover:bg-zinc-50"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
                                            <h4 className="text-base font-semibold text-zinc-900">Do you allow children?</h4>
                                            <div className="flex items-center gap-6">
                                                <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                    <input
                                                        type="radio"
                                                        name="allows_children"
                                                        checked={Boolean(data.allows_children) === true}
                                                        onChange={() => setData('allows_children', true)}
                                                        className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                    />
                                                    Yes
                                                </label>
                                                <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                    <input
                                                        type="radio"
                                                        name="allows_children"
                                                        checked={Boolean(data.allows_children) === false}
                                                        onChange={() => setData('allows_children', false)}
                                                        className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
                                            <h4 className="text-base font-semibold text-zinc-900">What can guests use at your place?</h4>
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                {AMENITY_OPTIONS.map((amenity) => (
                                                    <label key={amenity} className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={data.amenities.includes(amenity)}
                                                            onChange={() => toggleAmenity(amenity)}
                                                            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                        />
                                                        {amenity}
                                                    </label>
                                                ))}
                                            </div>
                                            {data.amenities.includes('Other') && (
                                                <input
                                                    type="text"
                                                    value={data.custom_amenity}
                                                    onChange={(e) => setData('custom_amenity', e.target.value)}
                                                    placeholder="Type custom amenity"
                                                    className="w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-950 focus:ring-zinc-950"
                                                />
                                            )}
                                            <div className="pt-1">
                                                <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(data.breakfast_included)}
                                                        onChange={(e) => setData('breakfast_included', e.target.checked)}
                                                        className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                    />
                                                    Breakfast included
                                                </label>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
                                            <h4 className="text-base font-semibold text-zinc-900">What languages do you or your staff speak?</h4>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full justify-between rounded-xl">
                                                        <span className="truncate text-left">
                                                            {data.languages.length > 0
                                                                ? data.languages.join(', ')
                                                                : 'Select languages'}
                                                        </span>
                                                        <span className="text-zinc-400">{data.languages.length}</span>
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[280px]">
                                                    <div className="space-y-2">
                                                        {LANGUAGE_OPTIONS.map((language) => (
                                                            <label key={language} className="inline-flex w-full items-center gap-2 text-sm text-zinc-700">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={data.languages.includes(language)}
                                                                    onChange={() => toggleLanguage(language)}
                                                                    className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                                />
                                                                {language}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
                                            <h4 className="text-base font-semibold text-zinc-900">House rules</h4>
                                            <div className="space-y-4">
                                                <div>
                                                    <p className="text-sm font-medium text-zinc-700 mb-2">Smoking allowed</p>
                                                    <div className="flex items-center gap-6">
                                                        <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                            <input
                                                                type="radio"
                                                                name="smoking_allowed"
                                                                checked={Boolean(data.smoking_allowed) === true}
                                                                onChange={() => setData('smoking_allowed', true)}
                                                                className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                            />
                                                            Yes
                                                        </label>
                                                        <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                            <input
                                                                type="radio"
                                                                name="smoking_allowed"
                                                                checked={Boolean(data.smoking_allowed) === false}
                                                                onChange={() => setData('smoking_allowed', false)}
                                                                className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                            />
                                                            No
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-zinc-700 mb-2">Parties/events allowed</p>
                                                    <div className="flex items-center gap-6">
                                                        <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                            <input
                                                                type="radio"
                                                                name="parties_allowed"
                                                                checked={Boolean(data.parties_allowed) === true}
                                                                onChange={() => setData('parties_allowed', true)}
                                                                className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                            />
                                                            Yes
                                                        </label>
                                                        <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                            <input
                                                                type="radio"
                                                                name="parties_allowed"
                                                                checked={Boolean(data.parties_allowed) === false}
                                                                onChange={() => setData('parties_allowed', false)}
                                                                className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                            />
                                                            No
                                                        </label>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-zinc-700 mb-2">Do you allow pets?</p>
                                                    <div className="flex flex-wrap items-center gap-6">
                                                        {['yes', 'upon_request', 'no'].map((value) => (
                                                            <label key={value} className="inline-flex items-center gap-2 text-sm text-zinc-700">
                                                                <input
                                                                    type="radio"
                                                                    name="pets_allowed"
                                                                    checked={data.pets_allowed === value}
                                                                    onChange={() => setData('pets_allowed', value)}
                                                                    className="h-4 w-4 border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                                                                />
                                                                {value === 'upon_request' ? 'Upon request' : value.charAt(0).toUpperCase() + value.slice(1)}
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-4">
                                            <h4 className="text-base font-semibold text-zinc-900">Check-in & Check-out times</h4>
                                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-zinc-700">Check-in</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs text-zinc-500 mb-1">From</label>
                                                            <input
                                                                type="time"
                                                                value={data.check_in_from}
                                                                onChange={(e) => setData('check_in_from', e.target.value)}
                                                                className="w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-950 focus:ring-zinc-950"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-zinc-500 mb-1">Until</label>
                                                            <input
                                                                type="time"
                                                                value={data.check_in_until}
                                                                onChange={(e) => setData('check_in_until', e.target.value)}
                                                                className="w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-950 focus:ring-zinc-950"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-sm font-medium text-zinc-700">Check-out</p>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs text-zinc-500 mb-1">From</label>
                                                            <input
                                                                type="time"
                                                                value={data.check_out_from}
                                                                onChange={(e) => setData('check_out_from', e.target.value)}
                                                                className="w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-950 focus:ring-zinc-950"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-zinc-500 mb-1">Until</label>
                                                            <input
                                                                type="time"
                                                                value={data.check_out_until}
                                                                onChange={(e) => setData('check_out_until', e.target.value)}
                                                                className="w-full rounded-lg border-zinc-300 text-sm focus:border-zinc-950 focus:ring-zinc-950"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-zinc-700 mb-2">Description</label>
                                            <textarea
                                                rows="5"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className="w-full rounded-xl border-zinc-300 focus:border-zinc-950 focus:ring-zinc-950"
                                                placeholder="Describe the property, rules, and guest experience..."
                                                required
                                            />
                                            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
                                        </div>
                                    </section>
                                )}

                                <div className="pt-4 border-t border-zinc-100 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={goBack}
                                            disabled={step === 1}
                                            className="px-4 py-2 text-sm font-medium text-zinc-700 bg-white border border-zinc-300 rounded-xl hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            Back
                                        </button>
                                        <Link href={route('owner.dashboard')} className="px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-900">
                                            Cancel
                                        </Link>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {step < 3 ? (
                                            <button
                                                type="button"
                                                onClick={goNext}
                                                disabled={(step === 1 && !canContinueStep1) || (step === 2 && !canContinueStep2)}
                                                className="px-6 py-2 text-sm font-bold text-white bg-zinc-950 rounded-xl hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed"
                                            >
                                                Continue
                                            </button>
                                        ) : (
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-6 py-2 text-sm font-bold text-white bg-zinc-950 rounded-xl hover:bg-zinc-800 disabled:opacity-50 transition-colors"
                                            >
                                                {processing ? 'Saving...' : 'Publish listing'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
