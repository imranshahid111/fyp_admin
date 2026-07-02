import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, Building2, User, Mail, Phone, Calendar,
    Truck, Users, Star, DollarSign, History, CheckCircle,
    XCircle, Ban, Loader2, MapPin, FileText, ExternalLink
} from 'lucide-react';
import { apiService } from '../services/api';
import type { TruckOwner, Driver, Job } from '../types';
import StatusBadge from '../components/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export default function TruckOwnerDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [owner, setOwner] = useState<TruckOwner | null>(null);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [trucks, setTrucks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchOwnerData();
        }
    }, [id]);

    const fetchOwnerData = async () => {
        try {
            setLoading(true);
            const [ownerRes, driversRes, jobsRes] = await Promise.all([
                apiService.getTruckOwner(id!),
                apiService.getDrivers(),
                apiService.getJobs()
            ]);
            const payload = ownerRes.data?.data ?? ownerRes.data;
            const ownerData = payload?.owner ?? payload;
            const mapDriver = (d: any): Driver => ({
                id: String(d.id),
                name: d.name ?? '',
                email: d.email ?? '',
                phone: d.phone ?? '',
                licenseNumber: d.licenseNumber ?? d.licence_number ?? '',
                truckOwnerId: String(d.truck_owner_id ?? d.truckOwnerId ?? ''),
                truckOwnerName: d.truckOwnerName ?? d.truck_owner_name ?? '',
                assignedJobs: d.assignedJobs ?? 0,
                completedJobs: d.completedJobs ?? 0,
                status: (d.status === 'active' ? 'available' : d.status === 'inactive' ? 'inactive' : d.status) as Driver['status'],
                rating: d.rating ?? 0,
            });
            const driversFromPayload = Array.isArray(payload?.drivers) ? payload.drivers.map(mapDriver) : [];
            const driversList = (driversRes.data?.data ?? driversRes.data ?? []).map(mapDriver);
            const driversForOwner = driversFromPayload.length > 0 ? driversFromPayload : driversList.filter((d: Driver) => String(d.truckOwnerId) === id);
            const jobsList = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.data ?? [];
            const trucksFromPayload = Array.isArray(payload?.trucks) ? payload.trucks : [];
            if (ownerData) {
                const mapped: TruckOwner = {
                    id: String(ownerData.id),
                    name: ownerData.name ?? '',
                    email: ownerData.email ?? '',
                    phone: ownerData.phone ?? '',
                    company: ownerData.company ?? ownerData.business_name ?? '',
                    registrationDate: ownerData.registrationDate ?? ownerData.created_at ?? new Date().toISOString().split('T')[0],
                    totalTrucks: ownerData.totalTrucks ?? trucksFromPayload.length ?? 0,
                    totalDrivers: ownerData.totalDrivers ?? driversForOwner.length ?? 0,
                    status: ownerData.status ?? 'pending',
                    rating: ownerData.rating ?? 0,
                    cnic_front_img: ownerData.cnic_front_img,
                    cnic_back_img: ownerData.cnic_back_img,
                };
                setOwner(mapped);
            } else {
                setOwner(null);
            }
            setDrivers(driversForOwner);
            setTrucks(trucksFromPayload);
            setJobs(jobsList.filter((j: Job) => String(j.truckOwnerId) === id));
        } catch (error) {
            console.error('Error fetching owner details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus: TruckOwner['status']) => {
        if (!owner) return;
        try {
            const ownerId = String(owner.id);
            if (newStatus === 'approved') {
                await apiService.approveTruckOwner(ownerId);
            } else if (newStatus === 'rejected') {
                await apiService.rejectTruckOwner(ownerId);
            } else if (newStatus === 'inactive' || newStatus === 'suspended') {
                await apiService.suspendTruckOwner(ownerId);
            }
            setOwner({ ...owner, status: newStatus === 'suspended' ? 'suspended' : newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Loading owner profile...</p>
                </div>
            </div>
        );
    }

    if (!owner) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-muted/30 rounded-3xl border-2 border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Truck owner not found</h2>
                <p className="text-muted-foreground mt-2 max-w-xs">The fleet owner you are looking for doesn't exist or has been removed.</p>
                <Button variant="outline" onClick={() => navigate('/truck-owners')} className="mt-6 rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Owners
                </Button>
            </div>
        );
    }

    const totalRevenue = jobs.reduce((sum, j) => sum + j.fare, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                <div className="flex items-start gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/truck-owners')}
                        className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-border/50 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="h-6 w-6 text-slate-600" />
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{owner.company}</h1>
                            <StatusBadge status={owner.status} type="approval" />
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-medium pt-1">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Head Office</span>
                            <span>•</span>
                            <span className="text-slate-400">ID: {owner.id}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2.5">
                    {owner.status === 'pending' && (
                        <>
                            <Button
                                onClick={() => handleUpdateStatus('approved')}
                                className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Approve Account
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleUpdateStatus('rejected')}
                                className="h-12 px-6 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all"
                            >
                                <XCircle className="mr-2 h-5 w-5" />
                                Reject
                            </Button>
                        </>
                    )}
                    {owner.status === 'approved' && (
                        <Button
                            variant="destructive"
                            onClick={() => handleUpdateStatus('inactive')}
                            className="h-12 px-6 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Ban className="mr-2 h-5 w-5" />
                            Deactivate Company
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 overflow-hidden relative">
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700" />
                        <CardHeader className="relative pt-12 pb-6 items-center border-none">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                                <AvatarFallback className="text-2xl font-black bg-indigo-50 text-indigo-600">
                                    {owner.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center mt-4">
                                <CardTitle className="text-2xl font-bold">{owner.name}</CardTitle>
                                <p className="text-muted-foreground text-sm font-medium mt-1">Fleet Administrator</p>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pb-12">
                            <div className="grid gap-5">
                                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Mail className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                                        <p className="text-slate-900 font-bold truncate">{owner.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Phone className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                                        <p className="text-slate-900 font-bold truncate">{owner.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                    <div className="p-2 bg-white rounded-xl shadow-sm">
                                        <Calendar className="w-4 h-4 text-indigo-500" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Join Date</p>
                                        <p className="text-slate-900 font-bold truncate">{new Date(owner.registrationDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    <span className="text-xl font-black text-slate-900">{(owner.rating ?? 0).toFixed(1)}</span>
                                    <span className="text-slate-400 text-sm font-medium">/ 5.0</span>
                                </div>
                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 font-bold py-1 px-3 rounded-lg border-indigo-100">
                                    Top Provider
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Truck className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <Badge variant="outline" className="border-blue-100 text-blue-600 bg-blue-50/50">Active Fleet</Badge>
                                </div>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">Total Trucks</p>
                                <p className="text-4xl font-black text-slate-900">{owner.totalTrucks}</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <Badge variant="outline" className="border-emerald-100 text-emerald-600 bg-emerald-50/50">Efficiency</Badge>
                                </div>
                                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">Active Drivers</p>
                                <p className="text-4xl font-black text-slate-900">{owner.totalDrivers}</p>
                            </CardContent>
                        </Card>

                        <Card className="rounded-3xl border-none shadow-lg bg-slate-900 overflow-hidden group relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-8 -mt-8" />
                            <CardContent className="p-8 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform backdrop-blur-sm">
                                        <DollarSign className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <Badge variant="outline" className="border-white/20 text-emerald-400 bg-white/5">Profitability</Badge>
                                </div>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Total Revenue</p>
                                <p className="text-4xl font-black text-white">${totalRevenue.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Verification Documents */}
                    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 rounded-xl">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Verification Documents</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div>
                                <h3 className="text-sm font-bold uppercase text-slate-500 mb-4">Owner CNIC</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <DocPreview label="CNIC (Front)" src={(owner as any).cnic_front_img} />
                                    <DocPreview label="CNIC (Back)" src={(owner as any).cnic_back_img} />
                                </div>
                            </div>

                            {trucks.length > 0 && (
                                <div className="pt-6 border-t border-slate-100">
                                    <h3 className="text-sm font-bold uppercase text-slate-500 mb-4">Truck Documents</h3>
                                    <div className="space-y-6">
                                        {trucks.map(truck => (
                                            <div key={truck.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                <p className="font-bold text-slate-900 mb-4">Truck #{truck.registration_number}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                    <DocPreview label="Registration" src={truck.registration_doc} />
                                                    <DocPreview label="Fitness Certificate" src={truck.fitness_doc} />
                                                    <DocPreview label="Insurance" src={truck.insurance_doc} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Drivers List */}
                    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 rounded-xl">
                                    <Users className="w-6 h-6 text-indigo-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Registered Drivers</CardTitle>
                            </div>
                            <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-bold px-4 py-1 rounded-full">
                                {drivers.length} Members
                            </Badge>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Driver Info</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">License Number</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Performance</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {drivers.length > 0 ? (
                                        drivers.map((driver) => (
                                            <TableRow
                                                key={driver.id}
                                                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                                onClick={() => navigate(`/drivers/${driver.id}`)}
                                            >
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">
                                                                {driver.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{driver.name}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{driver.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <div className="font-mono text-sm bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 inline-block">
                                                        {driver.licenseNumber}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                                        <span className="font-bold text-slate-900">{(driver.rating ?? 0).toFixed(1)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5 text-right">
                                                    <StatusBadge status={driver.status} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium italic">
                                                No drivers assigned to this company yet
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Jobs History */}
                    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-purple-50 rounded-xl">
                                    <History className="w-6 h-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Recent Fleet Activity</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" className="font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50" onClick={() => navigate('/jobs')}>
                                View All Jobs
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest w-24">ID</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Execution Details</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Revenue</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {jobs.length > 0 ? (
                                        jobs.slice(0, 5).map((job) => (
                                            <TableRow
                                                key={job.id}
                                                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                                onClick={() => navigate(`/jobs/${job.id}`)}
                                            >
                                                <TableCell className="px-8 py-5 font-black text-slate-400">#{job.id}</TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-xs">{job.truckType}</span>
                                                            <span className="text-slate-300">•</span>
                                                            <span className="text-xs font-semibold text-slate-600">{job.driverName || 'Self Dispatch'}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(job.requestedDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <span className="font-black text-slate-900 text-lg">${job.fare}</span>
                                                </TableCell>
                                                <TableCell className="px-8 py-5 text-right">
                                                    <StatusBadge status={job.status} type="job" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium italic">
                                                No job history recorded for this company
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function DocPreview({ label, src }: { label: string, src?: string }) {
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    const IMAGE_BASE_URL = API_URL.replace('/api', ''); 
    const fullSrc = src ? (src.startsWith('http') ? src : `${IMAGE_BASE_URL}/${src}`) : null;

    return (
        <div className="space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</p>
            <div className="aspect-[4/3] rounded-xl bg-slate-50 border border-slate-100 overflow-hidden group relative">
                {fullSrc ? (
                    <>
                        <img src={fullSrc} alt={label} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <a 
                            href={fullSrc} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                            <ExternalLink className="h-6 w-6 text-white" />
                        </a>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                        <FileText className="h-8 w-8 mb-2" />
                        <span className="text-[10px] font-bold uppercase">Not Uploaded</span>
                    </div>
                )}
            </div>
        </div>
    );
}
