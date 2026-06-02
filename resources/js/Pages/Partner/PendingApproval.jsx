import { Head, Link, usePage } from '@inertiajs/react';
import { 
    Clock, CheckCircle2, ShieldCheck, 
    LogOut, Mail, Building2 
} from 'lucide-react';


export default function PendingApproval() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 selection:bg-zinc-900 selection:text-white font-sans">
            <Head title="Account Under Review" />
            {/* Main Status Card */}
            <div className="max-w-md w-full bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                
                {/* Header Banner */}
                <div className="bg-zinc-950 p-8 text-center relative overflow-hidden">
                    {/* Subtle background decoration */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-zinc-800 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-zinc-800 rounded-full blur-3xl opacity-50"></div>
                    
                    <div className="relative z-10 flex justify-center mb-5">
                        <div className="bg-white/10 p-3 rounded-full backdrop-blur-md border border-white/10">
                            <Clock className="w-8 h-8 text-zinc-50" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white relative z-10 tracking-tight">Application Under Review</h1>
                    <p className="text-zinc-400 mt-2 text-sm relative z-10">
                        We're currently verifying your business details.
                    </p>
                </div>

                {/* Content Body */}
                <div className="p-8">
                    {/* Get logged in user from Inertia page props */}
                    {(() => {
                        const page = usePage();
                        const user = page.props.auth?.user || page.props.user || {};
                        return (
                            <p className="text-sm text-muted-foreground mb-2">Hi {user.name || 'Guest'}</p>
                        );
                    })()}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-8 text-center">
                        Thank you for partnering with us. To ensure the safety and quality of our platform, our team manually reviews all partner accounts. This process usually takes <span className="font-bold text-zinc-950">24-48 hours</span>.
                    </p>

                    {/* Visual Timeline */}
                    <div className="space-y-6 border-l-2 border-border ml-3 pl-6 mb-8">
                        
                        {/* Step 1: Completed */}
                        <div className="relative">
                            <div className="absolute -left-[35px] top-0 bg-card rounded-full">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-950">Account Registered</h3>
                            <p className="text-xs text-zinc-500 mt-1">Your basic partner profile was created successfully.</p>
                        </div>
                        
                        {/* Step 2: In Progress (Active) */}
                        <div className="relative">
                            <div className="absolute -left-[35px] top-0 bg-card rounded-full">
                                {/* CSS Spinner */}
                                <div className="w-6 h-6 rounded-full border-[3px] border-zinc-200 border-t-zinc-950 animate-spin" />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-950">Verification in Progress</h3>
                            <p className="text-xs text-zinc-500 mt-1">Our team is reviewing your CIN/RC and business identity.</p>
                        </div>
                        
                        {/* Step 3: Pending (Faded out) */}
                        <div className="relative opacity-40">
                            <div className="absolute -left-[35px] top-0 bg-card rounded-full">
                                <ShieldCheck className="w-6 h-6 text-zinc-400" />
                            </div>
                            <h3 className="text-sm font-bold text-zinc-950">Approval & Onboarding</h3>
                            <p className="text-xs text-zinc-500 mt-1">Gain full access to your dashboard to start listing resources.</p>
                        </div>

                    </div>

                    {/* Email Notice Box */}
                    <div className="bg-muted rounded-xl p-4 flex items-start gap-3 border border-border mb-8">
                        <Mail className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Keep an eye on your inbox. We will notify you via email the moment your account is approved.
                        </p>
                    </div>

                    {/* Safe Logout Button */}
                    <div className="text-center border-t border-border pt-6">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign out for now
                        </Link>
                    </div>

                </div>
            </div>

            {/* Footer */}
            
        </div>
    );
}
