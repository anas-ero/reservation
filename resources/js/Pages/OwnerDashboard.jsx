import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function OwnerDashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Partner Dashboard</h2>}
        >
            <Head title="Owner Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-medium">Monthly Revenue</h3>
                            <p className="text-3xl font-bold">12,500 MAD</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-medium">Pending Requests</h3>
                            <p className="text-3xl font-bold text-orange-600">4</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-medium">Active Listings</h3>
                            <p className="text-3xl font-bold">2</p>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            Welcome back! Here are your recent bookings...
                            {/* You can add your data tables here later */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}