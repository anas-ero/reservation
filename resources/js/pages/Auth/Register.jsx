import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
            <Head title="Register" />

            <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                {/* Left Side: Form */}
                <div className="w-full p-8 sm:p-12 md:w-1/2">
                    <div className="mb-8 text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Create an account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Join us today to get started
                        </p>
                    </div>

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="name" value="Name" />

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

                        <div className="mt-4">
                            <InputLabel htmlFor="email" value="Email" />

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
                                Already registered?
                            </Link>

                            <PrimaryButton className="ms-4 px-6 py-3" disabled={processing}>
                                Register
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
