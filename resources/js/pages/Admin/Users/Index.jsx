import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, Link } from "@inertiajs/react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Trash2, ShieldAlert, User, Star } from "lucide-react";
import { useState } from "react";

export default function Index({ auth, users, filters }) {
    const [search, setSearch] = useState(filters.search || "");
    const [role, setRole] = useState(filters.role || "");

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route("admin.users"),
            { search, role },
            { preserveState: true }
        );
    };

    const handleRemove = (userId) => {
        if (confirm("Are you sure you want to completely remove this user? This action cannot be undone.")) {
            router.delete(route("admin.users.destroy", userId), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-zinc-800 leading-tight">
                    Manage Users
                </h2>
            }
        >
            <Head title="Manage Users" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                            <CardTitle>Platform Users</CardTitle>
                            
                            <form
                                onSubmit={handleFilter}
                                className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
                            >
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                                    <Input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        className="pl-9 h-9"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                                <select
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                        router.get(route("admin.users"), { search, role: e.target.value }, { preserveState: true });
                                    }}
                                    className="flex h-9 w-full sm:w-40 rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950"
                                >
                                    <option value="">All Roles</option>
                                    <option value="customer">Customer</option>
                                    <option value="owner">Owner</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </form>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Listings</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-10 text-zinc-500">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.data.map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-zinc-900">{user.name}</span>
                                                        <span className="text-sm text-zinc-500">{user.email}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant="outline" 
                                                        className={
                                                            user.role === 'admin' ? "bg-red-50 text-red-700" :
                                                            user.role === 'owner' ? "bg-indigo-50 text-indigo-700" : 
                                                            "bg-zinc-100 text-zinc-700"
                                                        }
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {user.role === 'owner' ? (
                                                        user.is_verified ? (
                                                            <span className="text-xs font-semibold text-emerald-600">Verified</span>
                                                        ) : (
                                                            <span className="text-xs font-semibold text-orange-600">Pending</span>
                                                        )
                                                    ) : (
                                                        <span className="text-zinc-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {user.role === 'owner' ? (
                                                        <span className="font-medium">{user.resources_count}</span>
                                                    ) : (
                                                        <span className="text-zinc-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-zinc-600">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {user.id !== auth.user.id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-zinc-400 hover:text-red-600 hover:bg-red-50"
                                                            onClick={() => handleRemove(user.id)}
                                                            title="Remove User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {users.links && users.last_page > 1 && (
                                <div className="mt-6 flex justify-center gap-1">
                                    {users.links.map((link, i) => {
                                        if (!link.url) {
                                            return (
                                                <span
                                                    key={i}
                                                    className="px-3 py-1 border border-zinc-200 rounded-md text-sm text-zinc-400"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            );
                                        }
                                        return (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                                    link.active
                                                        ? "bg-zinc-950 text-white border-zinc-950"
                                                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
