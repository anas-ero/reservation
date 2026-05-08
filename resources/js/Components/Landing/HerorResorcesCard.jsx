import React from "react";
import { Link, router } from "@inertiajs/react";
import { Bed, Star, MapPin } from "lucide-react";
import  SelectDemo  from "./Style/Select";

// 1. Accept the database records as props
const HerorResorcesCard = ({ resources = [], initialFilter}) => {

    // 2. When the select changes, tell Inertia to ping the backend
    const handleCategoryChange = (selectedValue) => {
        const filterValue = selectedValue === "all" ? "" : selectedValue;
        router.get(
            '/', // The URL of your current page
            { category: filterValue }, // The new filter data to send to Laravel
            { 
                preserveState: true, // Don't reset the whole page
                preserveScroll: true, // Don't jump back to the top
                replace: true // Keeps browser history clean
            }
        );
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-950">
                        Featured Reservations
                    </h2>
                    <p className="text-zinc-500 mt-1">
                        Top-rated spots and rentals available right now.
                    </p>
                </div>
                
                <div className="flex w-full md:w-auto">
                    {/* Pass the current filter and the router trigger */}
                    <SelectDemo 
                        value={initialFilter} 
                        onChange={handleCategoryChange} 
                    />
                </div>
            </div>

            {/* 3. Render the data straight from the database prop */}
            {resources.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 bg-zinc-50 rounded-xl">
                    No resources match your filters.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map((item) => (
                        <Link key={item.id} href={`/reservations/${item.id}`} className="group flex flex-col">
                            <div className="aspect-[4/3] bg-zinc-200 rounded-xl mb-4 overflow-hidden relative">
                                {item.image_url && (
                                    <img 
                                        src={item.image_url} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold shadow-sm flex items-center capitalize">
                                    <Bed className="w-3 h-3 mr-1.5" /> {item.category}
                                </div>
                            </div>
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-zinc-950 group-hover:underline line-clamp-1">
                                    {item.title}
                                </h3>
                                <div className="flex items-center text-sm font-medium shrink-0 ml-2">
                                    <Star className="w-3 h-3 fill-zinc-950 text-zinc-950 mr-1" />
                                    {item.rating || "New"}
                                </div>
                            </div>
                            <p className="text-sm text-zinc-500 mb-2 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> {item.location} • Up to {item.guests} guests
                            </p>
                            <p className="text-sm text-zinc-950 mt-auto">
                                <span className="font-bold">{item.price} MAD</span> / night
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};

export default HerorResorcesCard;