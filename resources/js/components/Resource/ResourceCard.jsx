import React from "react";
import { Link } from "@inertiajs/react";
import { MapPin, Star } from "lucide-react";

const ResourceCard = ({ resource }) => {
    const ratings = resource.ratings || [];
    const averageRating = ratings.length > 0 
        ? (ratings.reduce((acc, curr) => acc + Number(curr.rating), 0) / ratings.length).toFixed(1) 
        : "New";
    return (
        <div className="flex flex-col sm:flex-row border border-zinc-200 bg-white rounded-xl overflow-hidden hover:shadow-md transition">
            
            {/* 1. Image Column (Left on Desktop, Top on Mobile) */}
            <div className="relative w-full sm:w-64 h-48 sm:h-auto bg-zinc-100 flex-shrink-0">
                {resource.images && resource.images.length > 0 ? (
                    <img
                        src={`/storage/${resource.images[0].path}`}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-400">
                        No Image
                    </div>
                )}
            </div>

            {/* 2. Details Column (Right on Desktop, Bottom on Mobile) */}
            <div className="p-4 flex-1 flex flex-col justify-between">
                
                {/* Title & Location */}
                <div>
                    <div className="flex justify-between items-start">
                        <h2 className="text-xl font-bold text-zinc-950 hover:underline cursor-pointer line-clamp-1">
                            {resource.title}
                        </h2>
                        <div className="flex items-center gap-1 text-sm font-bold text-zinc-900 ml-2">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span>{averageRating}</span>
                            <span className="text-zinc-400 font-normal text-xs">
                                ({ratings.length})
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center text-sm text-zinc-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {resource.location}
                    </div>
                </div>

                {/* Price & Action Button */}
                <div className="mt-auto pt-4 flex flex-col items-end">
                    <p className="text-2xl font-bold tracking-tight text-zinc-950">
                        MAD {resource.price}
                    </p>
                    <Link
                        href={`/resources/${resource.id}`}
                        className="bg-zinc-950 text-white mt-2 w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-800 transition shadow-sm text-center"
                    >
                        See details
                    </Link>
                </div>
                
            </div>
        </div>
    );
};

export default ResourceCard;