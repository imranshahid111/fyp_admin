import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    ArrowLeft, Save, Loader2, User, Building2,
    Mail, Phone, Truck, Users, ShieldCheck,
    Info, AlertCircle, CheckCircle2
} from 'lucide-react';
import { apiService } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';

export default function AddTruckOwner() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        totalTrucks: 0,
        totalDrivers: 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const ownerData = {
                ...formData,
                id: `TO${Date.now().toString().slice(-3)}`,
                registrationDate: new Date().toISOString().split('T')[0],
                status: 'pending' as const,
                rating: 0,
            };

            await apiService.createTruckOwner(ownerData);
            navigate('/truck-owners');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to add truck owner. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes('total') ? Number(value) : value
        }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/truck-owners')}
                        className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-border/50 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="h-6 w-6 text-slate-600" />
                    </Button>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Register Owner</h1>
                        <p className="text-slate-500 font-medium pt-1 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-indigo-500" />
                            Secure Fleet Onboarding
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/truck-owners')}
                        className="h-12 px-6 rounded-2xl font-bold bg-white shadow-sm border-slate-200 hover:bg-slate-50"
                    >
                        Discard
                    </Button>
                    <Button
                        form="add-owner-form"
                        type="submit"
                        disabled={loading}
                        className="h-12 px-8 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-lg shadow-slate-200"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Finalize Registration'}
                    </Button>
                </div>
            </div>

            <form id="add-owner-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Basic Information Card */}
                    <Card className="rounded-[40px] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-2">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-indigo-50 rounded-2xl">
                                    <User className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black">Personal Profile</CardTitle>
                                    <CardDescription>Legal identification and contact details</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                            placeholder="e.g. Alexander Pierce"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                            placeholder="alexander@fleet.com"
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Contact Number</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Phone className="w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                        </div>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                            placeholder="+1 234 567 8900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company Information Card */}
                    <Card className="rounded-[40px] border-none shadow-xl shadow-slate-200/50 overflow-hidden bg-white">
                        <CardHeader className="p-10 pb-2">
                            <div className="flex items-center gap-4 mb-2">
                                <div className="p-3 bg-purple-50 rounded-2xl">
                                    <Building2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black">Business Entity</CardTitle>
                                    <CardDescription>Legal company registration and fleet scale</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="company" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Company Registered Name</Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building2 className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                    </div>
                                    <Input
                                        id="company"
                                        name="company"
                                        required
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                                        placeholder="Dynamic Logistics Group LLC"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                <div className="space-y-3">
                                    <Label htmlFor="totalTrucks" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Fleet Count (Trucks)</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Truck className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                        </div>
                                        <Input
                                            id="totalTrucks"
                                            name="totalTrucks"
                                            type="number"
                                            min="0"
                                            value={formData.totalTrucks}
                                            onChange={handleChange}
                                            className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="totalDrivers" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Operator Count (Drivers)</Label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Users className="w-5 h-5 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                                        </div>
                                        <Input
                                            id="totalDrivers"
                                            name="totalDrivers"
                                            type="number"
                                            min="0"
                                            value={formData.totalDrivers}
                                            onChange={handleChange}
                                            className="h-14 pl-12 rounded-2xl bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-4 focus:ring-purple-500/10 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Summary Info */}
                    <Card className="rounded-[32px] border-none shadow-lg shadow-slate-200/50 bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        <CardHeader className="p-0 pb-6 border-b border-white/10 mb-6">
                            <CardTitle className="text-xl font-bold">Registration Summary</CardTitle>
                        </CardHeader>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-medium">Owner Name</span>
                                <span className="font-bold text-white truncate max-w-[150px]">{formData.name || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-medium">Organization</span>
                                <span className="font-bold text-white truncate max-w-[150px]">{formData.company || 'Not specified'}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-medium">Fleet Size</span>
                                <Badge variant="outline" className="text-white border-white/20 font-bold px-3">
                                    {formData.totalTrucks} Units
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Status Note */}
                    <section className="bg-slate-50 rounded-[32px] p-8 border border-slate-200/50 space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Info className="w-16 h-16 text-slate-900" />
                        </div>
                        <div className="flex items-center gap-3 text-slate-900 relative z-10">
                            <Info className="w-5 h-5 text-indigo-600" />
                            <h4 className="font-black uppercase text-[10px] tracking-widest">Policy Reminder</h4>
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed relative z-10">
                            New owners are registered as <span className="text-indigo-600 font-bold">Pending</span>. Verification of documentation typically takes 24-48 business hours.
                        </p>
                    </section>

                    {/* Error Message */}
                    {error && (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-[32px] animate-in slide-in-from-top-2 duration-300">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-red-900">Registration Failed</p>
                                    <p className="text-xs text-red-700 font-medium leading-relaxed">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!error && !loading && formData.name && (
                        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[32px] animate-in fade-in duration-500">
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                <p className="text-xs font-bold text-emerald-800">Ready for review</p>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
