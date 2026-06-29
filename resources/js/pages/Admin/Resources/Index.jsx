import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
    Layers, 
    Car, 
    Hotel, 
    CheckCircle, 
    XCircle, 
    MapPin, 
    EyeOff, 
    Eye 
} from "lucide-react";
import { useState } from "react";

export default function Index({ auth, resources, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [type, setType] = useState(filters.type || "all");

    // Handle searching and filtering triggers
    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(route('admin.resources'), { search, type }, { preserveState: true });
    };

    // Toggle listing visibility matrix
    const handleToggleStatus = (resourceId) => {
        router.patch(route('admin.resources.toggle', resourceId), {}, {
            preserveScroll: true
        });
    };

    // Helper icon selector based on schema type
    const getTypeIcon = (type) => {
        switch (type) {
            case "car": return <Car className="w-4 h-4 text-blue-500" />;
            case "hotel": return <Hotel className="w-4 h-4 text-emerald-500" />;
            default: return <Layers className="w-4 h-4 text-indigo-500" />; // For pitch / general categories
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                    Platform Listings Moderator
                </h2>
            }
        >
            <Head title="Platform Listings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Filter & Options Bar */}
                    <Card className="border border-zinc-100 dark:border-zinc-800">
                        <CardContent className="pt-6">
                            <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-500">Search Listings</label>
                                    <Input 
                                        placeholder="Filter by title..." 
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-48 space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-500">Category Type</label>
                                    <select 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                    >
                                        <option value="all">All Items</option>
                                        <option value="car">Cars</option>
                                        <option value="hotel">Hotels</option>
                                        <option value="pitch">Pitches</option>
                                    </select>
                                </div>
                                <Button type="submit" className="bg-zinc-900 text-white w-full md:w-auto">
                                    Apply Filters
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Main Listings Grid Panel */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Global Listings ({resources.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {resources.length === 0 ? (
                                <p className="text-center text-zinc-500 py-12">No listings found matching criteria.</p>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Listing Details</TableHead>
                                            <TableHead>Vendor (Owner)</TableHead>
                                            <TableHead>Pricing Schema</TableHead>
                                            <TableHead>Location</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Moderation</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {resources.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-zinc-50 rounded-md border dark:border-zinc-700">
                                                            {getTypeIcon(item.type)}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm text-zinc-900 font-semibold">{item.title}</span>
                                                            <span className="text-xs text-zinc-400 uppercase tracking-wider font-medium">{item.type}</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-zinc-600 dark:text-zinc-400">
                                                    {item.owner_name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.price}</span>
                                                        <span className="text-xs text-zinc-400 italic">per {item.pricing_type}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 shrink-0" />
                                                        {item.location}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={item.status === 'active' ? 'default' : 'secondary'}
                                                        className={item.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-800 dark:text-zinc-400'}
                                                    >
                                                        {item.status === 'active' ? 'Active' : 'Hidden'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant={item.status === 'active' ? 'destructive' : 'default'}
                                                        className={item.status === 'active' ? '' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                                                        onClick={() => handleToggleStatus(item.id)}
                                                    >
                                                        {item.status === 'active' ? (
                                                            <>
                                                                <EyeOff className="w-3.5 h-3.5 mr-1" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Eye className="w-3.5 h-3.5 mr-1" />
                                                                Activate
                                                            </>
                                                        )}
                                                    </Button>
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