import { Link } from "@inertiajs/react";
import { Search } from "lucide-react";

export default function MainLayout({ children, auth }) {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-950">
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-zinc-950 p-1.5 rounded-md">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight">
                            ReserveFlow
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={route("partner.register")}
                            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 hidden md:block"
                        >
                            Partner with us
                        </Link>
                        {auth?.user ? (
                            <Link
                                href={route("dashboard")}
                                className="text-sm font-medium text-zinc-950 hover:underline"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href={route("login")}
                                    className="text-sm font-medium text-zinc-950 hover:text-zinc-700 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-800"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main>{children}</main>
        </div>
    );
}
