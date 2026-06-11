import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
    className,
    onSubmit,
    data,
    setData,
    errors,
    processing,
    canResetPassword,
    ...props
}) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent className="p-6 md:p-8">
                    <form className="p-6 md:p-8" onSubmit={onSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <h1 className="text-2xl font-bold">
                                    Welcome back
                                </h1>
                                <p className="text-balance text-muted-foreground">
                                    Login to your account
                                </p>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                {/* Show Laravel Email Validation Errors */}
                                {errors.email && (
                                    <span className="text-sm text-red-500 font-medium">
                                        {errors.email}
                                    </span>
                                )}
                            </Field>

                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">
                                        Password
                                    </FieldLabel>
                                    {canResetPassword && (
                                        <a
                                            href={route("password.request")}
                                            className="ml-auto text-sm underline-offset-2 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />
                                {/* Show Laravel Password Validation Errors */}
                                {errors.password && (
                                    <span className="text-sm text-red-500 font-medium">
                                        {errors.password}
                                    </span>
                                )}
                            </Field>

                            <Field>
                                <Button type="submit" disabled={processing}>
                                    {processing ? "Logging in..." : "Login"}
                                </Button>
                            </Field>

                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{" "}
                                <a href={route("register")}>Sign up</a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center">
                By clicking continue, you agree to our{" "}
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>.
            </FieldDescription>
        </div>
    );
}
