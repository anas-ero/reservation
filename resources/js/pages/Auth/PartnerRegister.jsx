import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function PartnerRegister() {
    // 1. Add the new fields to our state
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        business_name: "",
        cin_or_rc: "",
        phone_number: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("partner.register"));
    };

    return (
        <GuestLayout>
            <Head title="Become a Partner" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-zinc-900">
                    Partner with ReserveFlow
                </h1>
                <p className="text-sm text-zinc-600 mt-2">
                    Start renting your properties and vehicles.
                </p>
            </div>

            <form onSubmit={submit}>
                {/* Standard Name */}
                <div>
                    <InputLabel htmlFor="name" value="Your Full Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                {/* NEW: Business Name */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="business_name"
                        value="Business or Agency Name"
                    />
                    <TextInput
                        id="business_name"
                        name="business_name"
                        value={data.business_name}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                            setData("business_name", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.business_name}
                        className="mt-2"
                    />
                </div>

                {/* NEW: CIN or RC */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="cin_or_rc"
                        value="CIN / Registre de Commerce (RC)"
                    />
                    <TextInput
                        id="cin_or_rc"
                        name="cin_or_rc"
                        value={data.cin_or_rc}
                        className="mt-1 block w-full"
                        placeholder="e.g., AB123456 or 12345"
                        onChange={(e) => setData("cin_or_rc", e.target.value)}
                        required
                    />
                    <InputError message={errors.cin_or_rc} className="mt-2" />
                </div>

                {/* NEW: Phone Number */}
                <div className="mt-4">
                    <InputLabel htmlFor="phone_number" value="Phone Number" />
                    <TextInput
                        id="phone_number"
                        name="phone_number"
                        type="tel"
                        value={data.phone_number}
                        className="mt-1 block w-full"
                        placeholder="+212 600 000 000"
                        onChange={(e) =>
                            setData("phone_number", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.phone_number}
                        className="mt-2"
                    />
                </div>

                <hr className="my-6 border-zinc-200" />

                {/* Email */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Login Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password */}
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Confirm Password */}
                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end mt-6">
                    <Link
                        href={route("login")}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md"
                    >
                        Already a partner?
                    </Link>

                    <PrimaryButton
                        className="ms-4 bg-zinc-950"
                        disabled={processing}
                    >
                        Create Partner Account
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
