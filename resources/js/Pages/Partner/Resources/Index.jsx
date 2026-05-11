import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = () => {
    return (
        <AuthenticatedLayout>
            <h1 className="text-2xl font-bold text-zinc-900">My Resources</h1>
            <p className="text-sm text-zinc-500">
                Manage your listings and availability.
            </p>
        </AuthenticatedLayout>
    );
};

export default Index;
