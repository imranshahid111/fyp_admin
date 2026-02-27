import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, MapPin, Calendar, Clock, Truck,
    User, Building2, DollarSign, Shield, Info,
    CheckCircle, XCircle, Loader2, Navigation,
    Package, ArrowRight, CreditCard, ExternalLink
} from 'lucide-react';
import { apiService } from '../services/api';
import type { Job } from '../types';
import StatusBadge from '../components/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export default function JobDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchJobData();
        }
    }, [id]);

    const fetchJobData = async () => {
        try {
            setLoading(true);
            const res = await apiService.getJob(id!);
            setJob(res.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Loading logistics data...</p>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-muted/30 rounded-3xl border-2 border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Job not found</h2>
                <p className="text-muted-foreground mt-2 max-w-xs">The logistics job record you are looking for doesn't exist or has been archived.</p>
                <Button variant="outline" onClick={() => navigate('/jobs')} className="mt-6 rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Jobs
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/jobs')}
                        className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-border/50 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="h-6 w-6 text-slate-600" />
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Job #{job.id.slice(0, 8).toUpperCase()}</h1>
                            <StatusBadge status={job.status} type="job" />
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-medium pt-1">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-bold border-none uppercase text-[10px] tracking-widest">{job.truckType}</Badge>
                            <span>•</span>
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Created {new Date(job.requestedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2.5">
                    <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold bg-white shadow-sm border-slate-200 hover:bg-slate-50">
                        Download Invoice
                    </Button>
                    <Button className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-200">
                        Modify Logistics
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left & Middle Columns: Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Trip Logistics Card */}
                    <Card className="rounded-[40px] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between border-none">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 rounded-2xl">
                                    <Navigation className="w-6 h-6 text-indigo-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Trip Logistics</CardTitle>
                            </div>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 font-bold px-3 py-1">
                                GPS Tracking Active
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="relative flex flex-col gap-16">
                                {/* Vertical Dashed Line */}
                                <div className="absolute left-[15px] top-[40px] bottom-[40px] w-[2px] border-l-2 border-dashed border-indigo-100" />

                                {/* Pickup Point */}
                                <div className="flex gap-8 relative z-10 group">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white ring-[10px] ring-indigo-50 shrink-0 shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                                        <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Origin / Pickup</p>
                                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{job.pickupLocation}</h3>
                                        <div className="flex items-center gap-4 pt-1">
                                            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(job.requestedDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                <Clock className="w-4 h-4" />
                                                09:00 AM CST
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dropoff Point */}
                                <div className="flex gap-8 relative z-10 group">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-[10px] ring-emerald-50 shrink-0 shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                                        <div className="w-2.5 h-2.5 bg-white rounded-full" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Destination / Dropoff</p>
                                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{job.deliveryLocation}</h3>
                                        <div className="flex items-center gap-4 pt-1">
                                            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                <Navigation className="w-4 h-4 text-emerald-500" />
                                                420.5 km total distance
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                <Clock className="w-4 h-4" />
                                                Est. 6h 15m
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Summary Footer */}
                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 px-2">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-emerald-50 rounded-2xl">
                                        <DollarSign className="w-8 h-8 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Contract Value</p>
                                        <p className="text-4xl font-black text-slate-900 leading-none">${job.fare.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-emerald-50/50 border border-emerald-100 px-5 py-3 rounded-2xl">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="font-black text-emerald-700 uppercase text-[10px] tracking-widest">Payment Confirmed</span>
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cargo Specs Card */}
                    <Card className="rounded-[32px] border-none shadow-sm bg-slate-900 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <CardContent className="p-8 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4 max-w-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                                        <Package className="w-5 h-5 text-indigo-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Cargo Specification</h3>
                                </div>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                    Freight consists of high-priority logistics materials tailored for {job.truckType} transport.
                                    Ensuring full climate control and real-time stabilization monitoring.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 min-w-[240px]">
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center hover:bg-white/10 transition-colors">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Weight</p>
                                    <p className="text-white font-black">4.8 Tons</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex flex-col items-center hover:bg-white/10 transition-colors">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Volume</p>
                                    <p className="text-white font-black">32.5 m³</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Stakeholders */}
                <div className="space-y-6">
                    <Card className="rounded-[32px] border-none shadow-lg shadow-slate-200/50 bg-white p-8">
                        <CardHeader className="p-0 pb-8 border-b border-slate-50 mb-8 items-start gap-4 flex-row">
                            <div className="p-2.5 bg-indigo-50 rounded-xl">
                                <Shield className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-bold">Stakeholders</CardTitle>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">Verified Participants Only</p>
                            </div>
                        </CardHeader>

                        <div className="space-y-6">
                            {/* Client */}
                            <div
                                className="group cursor-pointer"
                                onClick={() => navigate(`/users`)}
                            >
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Principal Client</p>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-indigo-50 hover:border-indigo-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                            <AvatarFallback className="bg-indigo-600 text-white font-black text-xs">
                                                {job.userName.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-none">{job.userName}</p>
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">Verified Account</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                                </div>
                            </div>

                            {/* Fleet Owner */}
                            <div
                                className="group cursor-pointer"
                                onClick={() => navigate(`/truck-owners`)}
                            >
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Logistics Provider</p>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-purple-50 hover:border-purple-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 text-purple-600 shadow-sm">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-none">{job.truckOwnerName}</p>
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">Tier 1 Provider</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-purple-600" />
                                </div>
                            </div>

                            {/* Operator */}
                            <div
                                className="group cursor-pointer"
                                onClick={() => navigate(`/drivers`)}
                            >
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Primary Operator</p>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-amber-50 hover:border-amber-100 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 text-amber-600 shadow-sm">
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 leading-none">{job.driverName || 'Allocating... '}</p>
                                            <p className="text-[11px] text-slate-500 font-medium mt-1">Professional License</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-amber-600" />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <section className="bg-slate-50 rounded-[32px] p-8 border border-slate-200/50 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Info className="w-16 h-16 text-slate-900" />
                        </div>
                        <div className="flex items-center gap-3 text-slate-900 relative z-10">
                            <Info className="w-5 h-5 text-indigo-600" />
                            <h4 className="font-black uppercase text-[10px] tracking-widest">Administrative Context</h4>
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed relative z-10">
                            Logistics operation under real-time surveillance. Incident reports must be logged within 30 minutes of occurrence.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
