import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Star, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

function InitialsAvatar({ initials, size = "md" }) {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-14 h-14 text-base",
    };
    return (
        <div
            className={`${sizes[size]} rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 text-white font-semibold flex items-center justify-center flex-shrink-0 shadow-md`}
        >
            {initials}
        </div>
    );
}

export default function ResourceReviews({ resource, auth }) {
    const ratings = resource.ratings || [];
    const totalReviews = ratings.length;
    const averageRating =
        totalReviews > 0
            ? (
                  ratings.reduce((acc, curr) => acc + curr.rating, 0) /
                  totalReviews
              ).toFixed(1)
            : "0.0";

    const { data, setData, post, processing, reset, errors } = useForm({
        rating: 5,
        comment: "",
    });

    const [popoverOpen, setPopoverOpen] = useState(false);

    const submitReview = (e) => {
        e.preventDefault();
        post(route("ratings.store", resource.id), {
            preserveScroll: true,
            onSuccess: () => {
                setPopoverOpen(false);
                reset();
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-zinc-950">Reviews</h3>
                    <div className="flex items-center gap-1.5 bg-zinc-900 text-white rounded-full px-3 py-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold">
                            {averageRating}
                        </span>
                        <span className="text-zinc-400 text-xs">
                            · {totalReviews}
                        </span>
                    </div>
                </div>

                {auth?.user && (
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="rounded-xl border-2 border-zinc-800 font-semibold hover:bg-zinc-900 hover:text-white transition-all duration-200"
                            >
                                <MessageSquarePlus className="w-4 h-4 mr-2" />
                                Write a Review
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-5 rounded-2xl shadow-xl border-border">
                            <form onSubmit={submitReview} className="space-y-4">
                                <div>
                                    <h4 className="font-bold text-zinc-900 mb-1">
                                        Your Rating
                                    </h4>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    setData("rating", star)
                                                }
                                                className="focus:outline-none focus-visible:ring-2 rounded-full p-0.5"
                                            >
                                                <Star
                                                    className={`w-6 h-6 transition-colors ${
                                                        data.rating >= star
                                                            ? "fill-amber-400 text-amber-400"
                                                            : "fill-zinc-200 text-zinc-200"
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {errors.rating && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.rating}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-1">
                                        Comment
                                    </label>
                                    <textarea
                                        className="w-full rounded-xl border border-zinc-200 p-3 text-sm focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-colors"
                                        rows="3"
                                        placeholder="Share your experience..."
                                        value={data.comment}
                                        onChange={(e) =>
                                            setData("comment", e.target.value)
                                        }
                                    ></textarea>
                                    {errors.comment && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.comment}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl py-2"
                                >
                                    {processing
                                        ? "Submitting..."
                                        : "Submit Review"}
                                </Button>
                            </form>
                        </PopoverContent>
                    </Popover>
                )}
            </div>

            {totalReviews === 0 ? (
                <div className="bg-card rounded-2xl border border-border p-8 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 text-zinc-400 mb-3">
                        <Star className="w-6 h-6" />
                    </div>
                    <h4 className="text-zinc-900 font-bold mb-1">
                        No reviews yet
                    </h4>
                    <p className="text-sm text-zinc-500">
                        Be the first to review this listing!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {ratings.map((review) => {
                        const dateStr = new Date(
                            review.created_at,
                        ).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        });

                        // Fallback initials
                        const reviewerName = review.user?.name || "Guest";
                        const initials = reviewerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase();

                        return (
                            <div
                                key={review.id}
                                className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow space-y-3"
                            >
                                <div className="flex items-center gap-3">
                                    <InitialsAvatar
                                        initials={initials}
                                        size="sm"
                                    />
                                    <div>
                                        <div className="text-sm font-semibold text-zinc-900">
                                            {reviewerName}
                                        </div>
                                        <div className="text-xs text-zinc-400">
                                            {dateStr}
                                        </div>
                                    </div>
                                    <div className="ml-auto flex">
                                        {Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "fill-zinc-200 text-zinc-200"}`}
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-600 leading-relaxed">
                                    {review.comment || (
                                        <span className="italic text-zinc-400">
                                            No comment provided.
                                        </span>
                                    )}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
