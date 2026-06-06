import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import {
    Building,
    Plus,
    Search,
    MoreHorizontal,
    Edit,
    Eye,
    Trash2,
    MapPin,
    Car,
    Tent,
    ExternalLink,
} from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";

export default function ResourceIndex({ auth, resources }) {
    // Helper to pick icons
    const getIconForType = (type) => {
        switch (type) {
            case "car":
                return <Car className="w-4 h-4 text-blue-500" />;
            case "hotel":
            case "villa":
                return <Building className="w-4 h-4 text-emerald-500" />;
            case "pitch":
            case "sports_pitch":
                return <Tent className="w-4 h-4 text-orange-500" />;
            default:
                return <Building className="w-4 h-4 text-zinc-500" />;
        }
    };

    function getTypeLabel(type) {
        switch (type) {
            case "hotel":
            case "villa":
                return "Hotel / Stay";
            case "car":
                return "Car";
            case "pitch":
            case "sports_pitch":
                return "Pitch";
            default:
                return String(type || "").replace("_", " ");
        }
    }

    // Handle deleting a listing
    function handleDelete(id) {
        if (confirm(
            "Are you sure you want to delete this listing? This action cannot be undone."
        )) {
            router.delete(route("partner.resources.destroy", id));
        }
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                            My Listings
                        </h2>
                        <p className="text-sm text-zinc-500">
                            Manage your properties, vehicles, and spaces.
                        </p>
                    </div>
                    <Button asChild className="gap-2">
                        <Link href={route("partner.resources.create")}>
                            <Plus className="w-4 h-4" /> Add New Listing
                        </Link>
                    </Button>
                </div>
            }
        >
            <Head title="My Listings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle>All Resources</CardTitle>
                                <CardDescription>
                                    A complete list of everything you are
                                    hosting on the platform.
                                </CardDescription>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full md:w-72">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input
                                    type="text"
                                    placeholder="Search listings..."
                                    className="pl-9 bg-zinc-50 border-zinc-200 focus-visible:ring-zinc-900"
                                />
                            </div>
                        </CardHeader>

                        <CardContent>
                            {resources.length === 0 ? (
                                <div className="text-center py-16 flex flex-col items-center border-2 border-dashed border-zinc-200 rounded-lg">
                                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                                        <Building className="w-8 h-8 text-zinc-300" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-zinc-900">
                                        No listings yet
                                    </h4>
                                    <p className="text-sm text-zinc-500 mt-1 mb-6 max-w-sm">
                                        You haven't added any resources to your
                                        portfolio. Create your first listing to
                                        start accepting bookings.
                                    </p>
                                    <Button asChild>
                                        <Link
                                            href={route(
                                                "partner.resources.create",
                                            )}
                                        >
                                            Create your first listing
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Listing</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {resources.map((resource) => (
                                            <TableRow key={resource.id}>
                                                {/* 1. Name & Type */}
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-zinc-50 rounded-md border border-zinc-100">
                                                            {getIconForType(
                                                                resource.type,
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <Link
                                                                href={route(
                                                                    "partner.resources.show",
                                                                    resource.id,
                                                                )}
                                                                className="hover:underline font-semibold text-zinc-900"
                                                            >
                                                                {resource.title}
                                                            </Link>
                                                            <span className="text-xs text-zinc-500 capitalize">
                                                                {getTypeLabel(resource.type)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* 2. Location */}
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                                                        <MapPin className="w-3.5 h-3.5" />{" "}
                                                        {resource.location}
                                                    </div>
                                                </TableCell>

                                                {/* 3. Price */}
                                                <TableCell>
                                                    <span className="font-semibold">
                                                        {resource.price} MAD
                                                    </span>
                                                    <span className="text-zinc-500 text-xs">
                                                        / unit
                                                    </span>
                                                </TableCell>

                                                {/* 4. Status */}
                                                <TableCell>
                                                    {resource.is_active ? (
                                                        <Badge
                                                            variant="outline"
                                                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        >
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            Hidden
                                                        </Badge>
                                                    )}
                                                </TableCell>

                                                {/* 5. Actions Dropdown */}
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <span className="sr-only">
                                                                    Open menu
                                                                </span>
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-[160px]"
                                                        >
                                                            <DropdownMenuLabel>
                                                                Actions
                                                            </DropdownMenuLabel>
                                                            <DropdownMenuSeparator />

                                                            {/* View Dashboard */}
                                                            <DropdownMenuItem
                                                                asChild
                                                                className="cursor-pointer"
                                                            >
                                                                <Link
                                                                    href={route(
                                                                        "partner.resources.show",
                                                                        resource.id,
                                                                    )}
                                                                    className="flex items-center w-full"
                                                                >
                                                                    <Eye className="mr-2 h-4 w-4" />{" "}
                                                                    View Details
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            {/* Edit Listing (You'll build this route later!) */}
                                                            <DropdownMenuItem asChild className="cursor-pointer">
                                                                <Link href={route('partner.resources.edit', resource.id)} className="flex items-center w-full">
                                                                    <Edit className="mr-2 h-4 w-4" /> Edit Listing
                                                                </Link>
                                                            </DropdownMenuItem>

                                                            <DropdownMenuSeparator />

                                                            {/* Delete Listing */}
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        resource.id,
                                                                    )
                                                                }
                                                                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />{" "}
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
