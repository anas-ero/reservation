import MainLayout from "@/Layouts/MainLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import { Filter, MapPin } from "lucide-react"; // Make sure to install lucide-react if you haven't!

import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/Components/ui/button-group";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input"; 
import ResourceCard from "@/Components/Resource/ResourceCard";

export default function Index({ auth, resources, filters }) {
    // 1. View Mode State
    const [viewMode, setViewMode] = useState("list");

    // Safety checks
    const safeResources = resources || {};
    const safeFilters = filters || {};
    const items =
        safeResources?.data ||
        (Array.isArray(safeResources) ? safeResources : []);
    const safeItems = Array.isArray(items) ? items.slice(0, 100) : [];
    const safeLinks = Array.isArray(safeResources?.links)
        ? safeResources.links.slice(0, 20)
        : [];

    // 2. Filter Form State (Defaults to what the URL passed in)
    const [searchParams, setSearchParams] = useState({
        location: safeFilters.location || "",
        type: safeFilters.type || "",
        start_date: safeFilters.start_date || "",
        end_date: safeFilters.end_date || "",
    });

    // 3. Handle Input Changes
    const handleFilterChange = (field, value) => {
        setSearchParams((prev) => ({ ...prev, [field]: value }));
    };

    // 4. Submit Filters to Backend
    const applyFilters = (e) => {
        e.preventDefault();

        router.get(route("public.resources.index"), searchParams, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <MainLayout auth={auth}>
            <Head title="Search Results - ReserveFlow" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* --- LEFT SIDEBAR: Interactive Filters --- */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="border border-zinc-200 rounded-xl bg-white p-5 sticky top-24">
                            <div className="flex items-center gap-2 mb-4 font-bold text-lg text-zinc-950">
                                <Filter className="w-5 h-5" /> Filters
                            </div>

                            <form onSubmit={applyFilters} className="space-y-4">
                                {/* Location */}
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                        Location
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="e.g. Marrakech"
                                        value={searchParams.location}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "location",
                                                e.target.value,
                                            )
                                        }
                                        className="h-9"
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        className="flex h-9 w-full rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                                        value={searchParams.type}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "type",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="">All Categories</option>
                                        <option value="stays">
                                            Villas & Stays
                                        </option>
                                        <option value="cars">Vehicles</option>
                                        <option value="sports">
                                            Sports Pitches
                                        </option>
                                    </select>
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                            Check-in
                                        </label>
                                        <Input
                                            type="date"
                                            value={searchParams.start_date}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "start_date",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 px-2 text-xs"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-zinc-700 mb-1">
                                            Check-out
                                        </label>
                                        <Input
                                            type="date"
                                            value={searchParams.end_date}
                                            onChange={(e) =>
                                                handleFilterChange(
                                                    "end_date",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 px-2 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2">
                                    <Button
                                        type="submit"
                                        className="w-full bg-zinc-950 text-white hover:bg-zinc-800"
                                    >
                                        Apply Filters
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() =>
                                            router.get(
                                                route("public.resources.index"),
                                            )
                                        }
                                    >
                                        Clear All
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </aside>

                    {/* --- RIGHT MAIN CONTENT: Results --- */}
                    <div className="flex-1">
                        {/* Header & View Toggles */}
                        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h1 className="text-2xl font-bold text-zinc-950">
                                {safeFilters.location || "All locations"}:{" "}
                                {safeResources.total || safeItems.length}{" "}
                                properties found
                            </h1>
                            <div>
                                <ButtonGroup>
                                    <Button
                                        variant="secondary"
                                        className={
                                            viewMode === "list"
                                                ? "bg-black text-white hover:bg-zinc-800"
                                                : ""
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("list")}
                                    >
                                        List
                                    </Button>
                                    <ButtonGroupSeparator />
                                    <Button
                                        variant="secondary"
                                        className={
                                            viewMode === "grid"
                                                ? "bg-black text-white hover:bg-zinc-800"
                                                : ""
                                        }
                                        size="sm"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        Grid
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>

                        {/* Results Grid/List */}
                        <div
                            className={
                                viewMode === "grid"
                                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                                    : "space-y-4"
                            }
                        >
                            {safeItems.length === 0 ? (
                                <div className="p-12 text-center bg-white border border-zinc-200 rounded-xl col-span-full">
                                    <p className="text-zinc-500 font-medium">
                                        No available{" "}
                                        {safeFilters.type || "properties"} found
                                        for your search.
                                    </p>
                                    <Button
                                        variant="link"
                                        onClick={() =>
                                            router.get(
                                                route("public.resources.index"),
                                            )
                                        }
                                        className="mt-2 text-zinc-950"
                                    >
                                        Clear filters and try again
                                    </Button>
                                </div>
                            ) : viewMode === "list" ? (
                                safeItems.map((item) => (
                                    <ResourceCard
                                        key={item.id}
                                        resource={item}
                                    />
                                ))
                            ) : (
                                safeItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="border border-zinc-200 bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col group"
                                    >
                                        <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                                            {item.images &&
                                            item.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${item.images[0].path}`}
                                                    alt={
                                                        item.title || item.name
                                                    }
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                                            <div>
                                                <h2 className="text-lg font-bold text-zinc-950 group-hover:underline cursor-pointer line-clamp-1">
                                                    {item.title || item.name}
                                                </h2>
                                                <div className="flex items-center text-sm text-zinc-500 mt-1">
                                                    <MapPin className="w-3.5 h-3.5 mr-1" />{" "}
                                                    {item.location}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-100">
                                                <p className="text-xl font-bold tracking-tight text-zinc-950">
                                                    MAD {item.price}
                                                    <span className="text-sm font-normal text-zinc-500 ml-1">
                                                        / unit
                                                    </span>
                                                </p>
                                                <Link
                                                    href={route(
                                                        "public.resources.show",
                                                        item.id,
                                                    )}
                                                    className="bg-zinc-950 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-800 transition shadow-sm text-center"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {safeLinks.length > 0 &&
                            safeResources.last_page > 1 && (
                                <div className="mt-10 flex justify-center gap-1 flex-wrap">
                                    {safeLinks.map((link, index) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 border border-zinc-200 rounded-md text-sm bg-zinc-50 text-zinc-400 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                                                    link.active
                                                        ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                                                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                                                }`}
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                    </div>
                </div>
            </main>
        </MainLayout>
    );
}
