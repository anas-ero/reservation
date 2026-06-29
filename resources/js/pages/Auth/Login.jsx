import Checkbox from "@/components/Checkbox";
import InputError from "@/components/InputError";
import InputLabel from "@/components/InputLabel";
import PrimaryButton from "@/components/PrimaryButton";
import TextInput from "@/components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6 dark:bg-gray-900">
            <Head title="Log in" />

            <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
                {/* Left Side: Form */}
                <div className="w-full p-8 sm:p-12 md:w-1/2">
                    <div className="mb-8 text-center sm:text-left">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Please sign in to your account
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div>
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full "
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData("email", e.target.value)}
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
                                autoComplete="current-password"
                                onChange={(e) => setData("password", e.target.value)}
                            />

                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                    Remember me
                                </span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:hover:text-indigo-300 dark:focus:ring-offset-gray-900"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-end">
                            <PrimaryButton className="w-full justify-center py-3" disabled={processing}>
                                Log in
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
