import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft,
    Mail,
    Phone,
    Award,
    Briefcase,
    ExternalLink,
    Star,
    Truck,
    History,
    UserCheck,
    UserX,
    Loader2,
    User,
    ShieldCheck,
    Calendar,
} from 'lucide-react';
import { apiService } from '../services/api';
import type { Driver, Job, TruckOwner } from '../types';
import StatusBadge from '../components/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export default function DriverDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [driver, setDriver] = useState<Driver | null>(null);
    const [owner, setOwner] = useState<TruckOwner | null>(null);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchDriverData();
    }, [id]);

    const fetchDriverData = async () => {
        setLoading(true);
        try {
            const [driverRes, ownersRes, jobsRes] = await Promise.all([
                apiService.getDriver(id),
                apiService.getTruckOwners(),
                apiService.getJobs(),
            ]);

            const driverData = driverRes.data;
            setDriver(driverData);
            setOwner(ownersRes.data.find((o: TruckOwner) => o.id === driverData.truckOwnerId) ?? null);
            setJobs(jobsRes.data.filter((j: Job) => j.driverId === id));
        } catch (err) {
            console.error('Failed to load driver data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: Driver['status']) => {
        if (!driver) return;
        try {
            await apiService.updateDriver(driver.id, { status: newStatus });
            setDriver((prev) => prev && { ...prev, status: newStatus });
        } catch (err) {
            console.error('Status update failed:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading driver profile...</p>
                </div>
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-6 text-center">
                <div className="p-4 rounded-full bg-gray-100">
                    <User className="h-12 w-12 text-muted-foreground/70" />
                </div>
                <div className="max-w-xs">
                    <h2 className="text-2xl font-bold tracking-tight">Driver not found</h2>
                    <p className="mt-2 text-muted-foreground text-sm">The driver profile you are looking for might have been moved or deleted.</p>
                </div>
                <Button variant="outline" size="lg" onClick={() => navigate('/drivers')} className="rounded-full">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA]/50">
            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-20 w-full bg-white/80 backdrop-blur-md border-b">
                <div className="container mx-auto max-w-5xl h-16 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full hover:bg-gray-100"
                            onClick={() => navigate('/drivers')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="hidden sm:block">
                            <h2 className="text-sm font-semibold text-gray-900">Driver Profile</h2>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold">Management Panel</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {driver.status === 'available' ? (
                            <Button variant="destructive" size="sm" onClick={() => handleStatusChange('inactive')} className="h-9 px-4 rounded-lg shadow-sm">
                                <UserX className="mr-2 h-4 w-4" />
                                Suspend Account
                            </Button>
                        ) : (
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 px-4 rounded-lg shadow-sm" size="sm" onClick={() => handleStatusChange('available')}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Reactivate
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-5xl px-6 py-10 space-y-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 md:p-12 text-white shadow-2xl">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl opacity-30"></div>

                    <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-white/20 shadow-xl">
                                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-primary to-blue-600">
                                    {driver.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg">
                                <ShieldCheck className="h-6 w-6 text-emerald-500" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <div>
                                <div className="flex flex-col md:flex-row items-center gap-3">
                                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{driver.name}</h1>
                                    <StatusBadge status={driver.status} />
                                </div>
                                <p className="mt-2 text-slate-300 text-lg flex items-center justify-center md:justify-start gap-2">
                                    <Truck className="h-5 w-5 opacity-70" />
                                    Professional Logistic Partner
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span>{driver.rating.toFixed(1)} Rating</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm">
                                    <Briefcase className="h-4 w-4 text-blue-300" />
                                    <span>ID: {driver.id.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium backdrop-blur-sm">
                                    <Calendar className="h-4 w-4 text-purple-300" />
                                    <span>Joined 2024</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact & Personal Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-2xl">
                            <CardHeader className="bg-gray-50/50 pb-4">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Contact Details</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <DetailItem icon={<Mail className="text-blue-500" />} label="Email Address" value={driver.email} />
                                <DetailItem icon={<Phone className="text-emerald-500" />} label="Phone Number" value={driver.phone} />
                                <DetailItem icon={<Award className="text-amber-500" />} label="License Number" value={driver.licenseNumber} isMono />

                                {owner && (
                                    <div
                                        className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group"
                                        onClick={() => navigate(`/truck-owners/${owner.id}`)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Current Employer</span>
                                            <ExternalLink className="h-3.5 w-3.5 text-slate-300 group-hover:text-primary transition-colors" />
                                        </div>
                                        <p className="font-semibold text-slate-800">{owner.company}</p>
                                        <p className="text-xs text-slate-500 mt-1">{owner.name}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions/Info Card could go here */}
                    </div>

                    {/* Stats & History */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <StatGridItem label="Total Jobs" value={driver.completedJobs.toString()} icon={<History />} color="blue" />
                            <StatGridItem label="Avg Rating" value={driver.rating.toFixed(1)} icon={<Star />} color="amber" />
                            <StatGridItem label="Success Rate" value="98.5%" icon={<ShieldCheck />} color="emerald" />
                        </div>

                        {/* Recent Activity */}
                        <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-gray-50">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <History className="h-5 w-5 text-primary" />
                                    Recent Job History
                                </CardTitle>
                                <Button variant="ghost" size="sm" className="text-primary font-semibold hover:bg-primary/5" onClick={() => navigate('/jobs')}>
                                    View Full History
                                </Button>
                            </CardHeader>
                            <CardContent className="p-0">
                                {jobs.length === 0 ? (
                                    <div className="px-6 py-12 text-center">
                                        <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                            <Briefcase className="h-6 w-6 text-gray-300" />
                                        </div>
                                        <p className="text-sm text-muted-foreground font-medium">No active or past job records found.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {jobs.slice(0, 5).map((job) => (
                                            <div
                                                key={job.id}
                                                className="p-5 hover:bg-gray-50/80 transition-all cursor-pointer group"
                                                onClick={() => navigate(`/jobs/${job.id}`)}
                                            >
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-bold text-slate-400 font-mono">#{job.id.slice(-6).toUpperCase()}</span>
                                                            <StatusBadge status={job.status} type="job" />
                                                        </div>
                                                        <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors">{job.userName}</h3>
                                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                            <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> {job.truckType}</span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(job.requestedDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="p-2 rounded-full border border-gray-100 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all">
                                                            <ArrowLeft className="h-4 w-4 rotate-180" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailItem({ icon, label, value, isMono = false }: { icon: React.ReactNode, label: string, value: string, isMono?: boolean }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 p-2 rounded-lg bg-gray-50 border border-gray-100">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider leading-none">{label}</p>
                <p className={`font-semibold text-slate-800 break-all ${isMono ? 'font-mono' : ''}`}>{value}</p>
            </div>
        </div>
    );
}

function StatGridItem({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: 'blue' | 'amber' | 'emerald' }) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };

    return (
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-2">
            <div className={`p-2.5 rounded-xl border ${colorClasses[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-black text-slate-900">{value}</p>
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{label}</p>
            </div>
        </div>
    );
}