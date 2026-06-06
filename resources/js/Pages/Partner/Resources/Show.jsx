import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Eye, TrendingUp, Users, Star, MessageSquare } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";

export default function ShowResource({ auth, resource, analytics, bookings, reviews }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('partner.resources.index')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h2 className="font-semibold text-xl text-zinc-800 leading-tight">{resource.name}</h2>
                        <p className="text-sm text-zinc-500 capitalize">{resource.type.replace('_', ' ')} • {resource.location}</p>
                    </div>
                </div>
            }
        >
            <Head title={`Manage - ${resource.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <Tabs defaultValue="overview" className="w-full">
                        {/* Tab Navigation */}
                        <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="bookings">Bookings</TabsTrigger>
                            <TabsTrigger value="reviews">Reviews</TabsTrigger>
                        </TabsList>

                        {/* TAB 1: OVERVIEW & ANALYTICS */}
                        <TabsContent value="overview" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                                        <Eye className="w-4 h-4 text-zinc-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{analytics.total_views}</div>
                                        <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1">
                                            <TrendingUp className="w-3 h-3" /> +{analytics.this_week_views} this week
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                                        <Users className="w-4 h-4 text-zinc-400" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{analytics.conversion_rate}</div>
                                        <p className="text-xs text-zinc-500 mt-1">Visitors who booked</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium">Status</CardTitle>
                                        <div className={`w-3 h-3 rounded-full ${resource.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-xl font-bold">{resource.is_active ? 'Active & Visible' : 'Hidden'}</div>
                                        <Button variant="link" className="px-0 h-auto text-xs mt-2">Change status</Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        {/* TAB 2: BOOKINGS / PARTICIPANTS */}
                        <TabsContent value="bookings">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Bookings</CardTitle>
                                    <CardDescription>Manage participants and approve pending reservations.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Customer</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead className="text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookings.map((booking) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell className="font-medium">{booking.customer}</TableCell>
                                                    <TableCell>{booking.date}</TableCell>
                                                    <TableCell>{booking.amount} MAD</TableCell>
                                                    <TableCell className="text-right">
                                                        {booking.status === 'confirmed' ? (
                                                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">Confirmed</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Pending</Badge>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 3: REVIEWS & COMMENTS */}
                        <TabsContent value="reviews">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Customer Feedback</CardTitle>
                                    <CardDescription>See what people are saying about this listing.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="flex gap-4 border-b border-zinc-100 pb-6 last:border-0 last:pb-0">
                                            <Avatar>
                                                <AvatarFallback className="bg-zinc-900 text-white">
                                                    {review.author.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-zinc-900">{review.author}</h4>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-200'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-zinc-500">{review.date}</span>
                                                </div>
                                                <p className="text-sm text-zinc-600 mt-2">{review.comment}</p>
                                                <Button variant="ghost" size="sm" className="mt-2 text-xs text-zinc-500 gap-1 h-8 px-2 -ml-2">
                                                    <MessageSquare className="w-3 h-3" /> Reply
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}