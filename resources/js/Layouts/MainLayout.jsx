import { Link } from "@inertiajs/react";
import { Search } from "lucide-react";

export default function MainLayout({ children, auth }) {
    return (
        <div className="min-h-screen bg-zinc-50 text-zinc-950">
            <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2">
                        <div className="bg-zinc-950 p-1.5 rounded-md">
                            <Search className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            Reserve
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/resources"
                            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 transition-colors"
                        >
                            Browse
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 h-9 px-4 py-2"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href={route("partner.register")}
                                    className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
                                >
                                    Become a Partner
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-zinc-600 hover:text-zinc-950"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 h-9 px-4 py-2"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            <footer className="bg-white border-t border-zinc-200 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="bg-zinc-950 p-1 rounded">
                                    <Search className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-lg font-bold">
                                    Reserve
                                </span>
                            </div>
                            <p className="text-sm text-zinc-500 max-w-xs">
                                The modern platform to reserve your workspaces,
                                meeting rooms, and shared offices in just a few
                                clicks.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">
                                Quick Links
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/"
                                        className="text-sm text-zinc-500 hover:text-zinc-950"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/resources"
                                        className="text-sm text-zinc-500 hover:text-zinc-950"
                                    >
                                        Browse
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/reservations"
                                        className="text-sm text-zinc-500 hover:text-zinc-950"
                                    >
                                        Reservations
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm mb-4 uppercase tracking-wider">
                                Legal
                            </h4>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-zinc-500 hover:text-zinc-950"
                                    >
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-zinc-500 hover:text-zinc-950"
                                    >
                                        Terms
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="text-sm text-zinc-500 hover:text-zinc-950"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-zinc-100 flex justify-between items-center">
                        <p className="text-xs text-zinc-400">
                            © 2026 Reserve Platform. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <span className="text-xs text-zinc-400">EN</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
