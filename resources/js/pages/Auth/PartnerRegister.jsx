import { useEffect } from "react";
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
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
            <Head title="Become a Partner" />

            <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                {/* Left Side: Form */}
                <div className="w-full p-8 sm:p-12 md:w-1/2">
                    <div className="mb-8 text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Partner with ReserveFlow
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
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

                        <hr className="my-6 border-gray-200 dark:border-gray-700" />

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

                        <div className="mt-6 flex items-center justify-between">
                            <Link
                                href={route("login")}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Already a partner?
                            </Link>

                            <PrimaryButton
                                className="ms-4 bg-zinc-950 px-6 py-3"
                                disabled={processing}
                            >
                                Create Partner Account
                            </PrimaryButton>
                        </div>
                    </form>
                </div>

                {/* Right Side: Creative Visual */}
                <div className="relative hidden w-1/2 bg-indigo-600 md:block">
                    {/* Decorative gradients */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black to-white opacity-80"></div>
                    <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center text-white">
                        <h3 className="mb-4 text-3xl font-bold tracking-tight">
                            Reserve effortlessly
                        </h3>
                        <p className="text-indigo-100">
                            Discover the easiest way to book, manage, and scale your reservations with our robust platform.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
