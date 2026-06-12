import { Link, usePage } from "@inertiajs/react";
import ApplicationLogo from "@/components/ApplicationLogo";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Calendar,
    MapPin,
    LayoutDashboard,
    Users,
    User,
    LogOut,
    ChevronUp,
} from "lucide-react";
import { Layers, ReceiptEuroIcon } from "lucide-react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Settings } from "lucide-react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const isRouteActive = (pattern) => {
        return route().current(pattern) || route().current(pattern + ".*");
    };
    const getLinkStyle = (pattern) => {
        return isRouteActive(pattern)
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "hover:bg-gray-100 dark:hover:bg-gray-700/50";
    };

    return (
        <SidebarProvider>
            {/* 1. THE SIDEBAR */}
            <Sidebar variant="inset">
                {/* Logo Area */}
                <SidebarHeader>
                    <div className="flex h-12 items-center px-4 mt-2">
                        <Link href="/">
                            <ApplicationLogo className="h-8 w-auto fill-current text-gray-800 dark:text-gray-200" />
                        </Link>
                    </div>
                </SidebarHeader>

                {/* Navigation Links */}
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Menu</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {/* CUSTOMER LINKS */}
                                {user.role === "customer" && (
                                    <>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "dashboard",
                                                )}
                                            >
                                                <Link
                                                    href={route("dashboard")}
                                                    className={getLinkStyle(
                                                        "dashboard",
                                                    )}
                                                >
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    <span>My Bookings</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "resources.*",
                                                )}
                                            >
                                                <Link
                                                    href="/resources"
                                                    className={getLinkStyle(
                                                        "resources.*",
                                                    )}
                                                >
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    <span>Find a Place</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </>
                                )}

                                {/* OWNER LINKS */}
                                {user.role === "owner" && (
                                    <>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "owner.dashboard",
                                                )}
                                            >
                                                <Link
                                                    href={route(
                                                        "owner.dashboard",
                                                    )}
                                                    className={getLinkStyle(
                                                        "owner.dashboard",
                                                    )}
                                                >
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Partner Hub</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "partner.resources.*",
                                                )}
                                            >
                                                <Link
                                                    href={route(
                                                        "partner.resources.index",
                                                    )}
                                                    className={getLinkStyle(
                                                        "partner.resources.*",
                                                    )}
                                                >
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    <span>Manage Listings</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </>
                                )}

                                {/* ADMIN LINKS */}
                                {user.role === "admin" && (
                                    <>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "admin.dashboard",
                                                )}
                                            >
                                                <Link
                                                    href={route(
                                                        "admin.dashboard",
                                                    )}
                                                    className={getLinkStyle(
                                                        "admin.dashboard",
                                                    )}
                                                >
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Admin Overview</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "admin.users",
                                                )}
                                            >
                                                <Link
                                                    href="/admin/users"
                                                    className={getLinkStyle(
                                                        "admin.users",
                                                    )}
                                                >
                                                    <Users className="mr-2 h-4 w-4" />
                                                    <span>Manage Users</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                        {/* Resource Moderator */}
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "admin.resources",
                                                )}
                                            >
                                                <Link
                                                    href="/admin/resources"
                                                    className={getLinkStyle(
                                                        "admin.resources",
                                                    )}
                                                >
                                                    <Layers className="mr-2 h-4 w-4" />
                                                    <span>
                                                        Platform Listings
                                                    </span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                        {/* NEW: Global Financial Transaction/Booking Ledger */}
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "admin.transactions",
                                                )}
                                            >
                                                <Link
                                                    href="/admin/transactions"
                                                    className={getLinkStyle(
                                                        "admin.transactions",
                                                    )}
                                                >
                                                    <ReceiptEuroIcon className="mr-2 h-4 w-4" />
                                                    <span>Global Bookings</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>

                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isRouteActive(
                                                    "admin.settings",
                                                )}
                                            >
                                                <Link
                                                    href="/admin/settings"
                                                    className={getLinkStyle(
                                                        "admin.settings",
                                                    )}
                                                >
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    <span>System Settings</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </>
                                )}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                {/* User Profile Dropdown at the Bottom */}
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    >
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col gap-0.5 leading-none">
                                            <span className="font-semibold text-sm">
                                                {user.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground capitalize">
                                                {user.role}
                                            </span>
                                        </div>
                                        <ChevronUp className="ml-auto h-4 w-4" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-[--radix-dropdown-menu-trigger-width]"
                                >
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={route("profile.edit")}
                                            className="w-full flex items-center cursor-pointer"
                                        >
                                            <User className="mr-2 h-4 w-4" />
                                            <span>Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            method="post"
                                            href={route("logout")}
                                            as="button"
                                            className="w-full flex items-center cursor-pointer"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log Out</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

            {/* 2. THE MAIN CONTENT AREA */}
            <SidebarInset>
                {/* Top Header with Hamburger Trigger */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:bg-gray-800 dark:border-gray-700">
                    <SidebarTrigger className="-ml-1" />
                    <div className="w-full">
                        {header && (
                            <div className="font-semibold text-gray-800 dark:text-gray-200">
                                {header}
                            </div>
                        )}
                    </div>
                    <ModeToggle />
                </header>

                {/* Page Content Slot */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
