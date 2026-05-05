import MainLayout from "@/Layouts/MainLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import {
    ButtonGroup,
    ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import ResourceCard from "@/Components/Resource/ResourceCard";

export default function Index({ auth, resources, filters }) {
    const [viewMode, setViewMode] = useState("list");

    // Safety checks
    const safeResources = resources || {};
    const safeFilters = filters || {};

    // Extract the array of data safely
    const items = safeResources?.data || (Array.isArray(safeResources) ? safeResources : []);

    // Prevent infinite loops or memory explosions
    const safeItems = Array.isArray(items) ? items.slice(0, 100) : [];
    const safeLinks = Array.isArray(safeResources?.links) ? safeResources.links.slice(0, 20) : [];

    return (
        <MainLayout auth={auth}>
            <Head title="Search Results - ReserveFlow" />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* LEFT SIDEBAR: Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
                        <div className="border border-zinc-200 rounded-xl bg-white p-5 space-y-6">
                            <h3 className="font-bold text-lg">
                                Current Search
                            </h3>
                            <div className="text-sm text-zinc-600">
                                <p>
                                    <strong>Location:</strong>{" "}
                                    {safeFilters.location || "Anywhere"}
                                </p>
                                <p className="capitalize">
                                    <strong>Type:</strong> {safeFilters.type || "All"}
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT MAIN CONTENT: Results */}
                    <div className="flex-1">
                        
                        {/* Header & View Toggles */}
                        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h1 className="text-2xl font-bold text-zinc-950">
                                {safeFilters.location || "All locations"}:{" "}
                                {safeResources.total || safeItems.length} properties found
                            </h1>
                            <div>
                                <ButtonGroup>
                                    <Button
                                        variant="secondary"
                                        className={viewMode === "list" ? "bg-black text-white hover:bg-zinc-800" : ""}
                                        size="lg"
                                        onClick={() => setViewMode("list")}
                                    >
                                        List
                                    </Button>
                                    <ButtonGroupSeparator />
                                    <Button
                                        variant="secondary"
                                        className={viewMode === "grid" ? "bg-black text-white hover:bg-zinc-800" : ""}
                                        size="lg"
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
                                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                                    : "space-y-4"
                            }
                        >
                            {safeItems.length === 0 ? (
                                <div className="p-8 text-center bg-white border border-zinc-200 rounded-xl col-span-full">
                                    <p className="text-zinc-500">
                                        No available {safeFilters.type || "properties"} found for these dates.
                                    </p>
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
                                        className="border border-zinc-200 bg-white rounded-xl overflow-hidden hover:shadow-md transition flex flex-col"
                                    >
                                        <div className="relative w-full h-48 bg-zinc-100">
                                            {item.images && item.images.length > 0 ? (
                                                <img
                                                    src={`/storage/${item.images[0].path}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                                                    No Image
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-4 flex flex-col gap-3 flex-1 justify-between">
                                            <div>
                                                <h2 className="text-lg font-bold text-zinc-950 hover:underline cursor-pointer line-clamp-1">
                                                    {item.name}
                                                </h2>
                                                <p className="text-sm text-zinc-500">
                                                    {item.location}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-xl font-bold tracking-tight text-zinc-950">
                                                    MAD {item.price}
                                                </p>
                                                <Link
                                                    href={`/resources/${item.id}`}
                                                    className="bg-zinc-950 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-800 transition shadow-sm text-center"
                                                >
                                                    See availability
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Pagination Controls */}
                        {safeLinks.length > 0 && (
                            <div className="mt-8 flex justify-center gap-1 flex-wrap">
                                {safeLinks.map((link, index) => {
                                    
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={index}
                                                className="px-4 py-2 border border-zinc-200 rounded text-sm bg-white text-zinc-900 opacity-50 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-4 py-2 border rounded text-sm transition-colors ${
                                                link.active 
                                                    ? "bg-zinc-950 text-white border-zinc-950" 
                                                    : "bg-white text-zinc-900 border-zinc-200 hover:bg-zinc-50"
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
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