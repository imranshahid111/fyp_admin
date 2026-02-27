import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
    ArrowLeft, User as UserIcon, Mail, Phone, Calendar,
    MapPin, History, Ban, CheckCircle, Loader2, CreditCard,
    ShoppingBag, Star, ShieldCheck
} from 'lucide-react';
import { apiService } from '../services/api';
import type { User, Booking } from '../types';
import StatusBadge from '../components/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import { Avatar, AvatarFallback } from '../components/ui/avatar';

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchUserData();
        }
    }, [id]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [userRes, bookingsRes] = await Promise.all([
                apiService.getUser(id!),
                apiService.getBookings()
            ]);
            setUser(userRes.data);
            setBookings(bookingsRes.data.filter((b: Booking) => b.userId === id));
        } catch (error) {
            console.error('Error fetching user details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: User['status']) => {
        if (!user) return;
        try {
            await apiService.updateUser(user.id, { status: newStatus });
            setUser({ ...user, status: newStatus });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Loading user profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-muted/30 rounded-3xl border-2 border-dashed">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <UserIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">User not found</h2>
                <p className="text-muted-foreground mt-2 max-w-xs">The user account you are looking for doesn't exist or has been removed.</p>
                <Button variant="outline" onClick={() => navigate('/users')} className="mt-6 rounded-xl">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Users
                </Button>
            </div>
        );
    }

    const totalSpent = bookings.reduce((sum, b) => sum + b.fare, 0);

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-16">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/users')}
                        className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-border/50 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="h-6 w-6 text-slate-600" />
                    </Button>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{user.name}</h1>
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 font-bold px-3 py-0.5">
                                Regular Customer
                            </Badge>
                        </div>
                        <p className="text-slate-500 font-medium">User ID: <span className="font-mono text-slate-400">{user.id}</span></p>
                    </div>
                </div>

                <div className="flex gap-3">
                    {user.status === 'active' ? (
                        <Button
                            variant="destructive"
                            onClick={() => handleStatusChange('suspended')}
                            className="h-12 px-6 rounded-2xl font-bold shadow-lg shadow-red-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Ban className="mr-2 h-5 w-5" />
                            Suspend Account
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handleStatusChange('active')}
                            className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Activate Account
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="rounded-[32px] border-none shadow-xl shadow-slate-200/50 overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700" />
                        <CardHeader className="relative -mt-12 pb-6 items-center border-none">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                                <AvatarFallback className="text-2xl font-black bg-slate-100 text-indigo-600">
                                    {user.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="text-center mt-4">
                                <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
                                <div className="flex items-center justify-center gap-1.5 mt-1">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span className="text-slate-500 text-sm font-medium">Verified Profile</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pb-12 px-8">
                            <div className="grid gap-5">
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email Address</p>
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <p className="text-slate-900 font-bold text-sm truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Phone Number</p>
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <p className="text-slate-900 font-bold text-sm truncate">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Joined Date</p>
                                    <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <p className="text-slate-900 font-bold text-sm truncate">
                                            {new Date(user.joinedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-slate-500">Status</span>
                                    <StatusBadge status={user.status} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
                            <CardContent className="p-8 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">Total Bookings</p>
                                    <p className="text-4xl font-black text-slate-900">{user.totalBookings}</p>
                                </div>
                                <div className="p-4 bg-indigo-50 rounded-2xl group-hover:scale-110 transition-transform">
                                    <ShoppingBag className="w-8 h-8 text-indigo-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="rounded-3xl border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
                            <CardContent className="p-8 flex items-center justify-between">
                                <div>
                                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-1">Total Expenditure</p>
                                    <p className="text-4xl font-black text-slate-900">${totalSpent.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-emerald-50 rounded-2xl group-hover:scale-110 transition-transform">
                                    <CreditCard className="w-8 h-8 text-emerald-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity Table */}
                    <Card className="rounded-[32px] border-none shadow-sm overflow-hidden bg-white">
                        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-50 rounded-xl">
                                    <History className="w-6 h-6 text-slate-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Recent Activity</CardTitle>
                            </div>
                            <Button variant="ghost" className="font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-xl">
                                Export History
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="hover:bg-transparent border-none">
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Date</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Route & Map</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Amount</TableHead>
                                        <TableHead className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.length > 0 ? (
                                        bookings.map((booking) => (
                                            <TableRow
                                                key={booking.id}
                                                className="hover:bg-slate-50 transition-colors group cursor-pointer"
                                                onClick={() => navigate(`/jobs/${booking.id}`)}
                                            >
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-slate-900 text-sm">
                                                            {new Date(booking.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">#{booking.id}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <div className="flex items-center gap-2 text-slate-700 font-semibold group-hover:text-indigo-600 transition-colors">
                                                        <MapPin className="w-4 h-4 text-slate-300" />
                                                        {booking.route}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-8 py-5">
                                                    <span className="font-black text-slate-900 text-lg">${booking.fare}</span>
                                                </TableCell>
                                                <TableCell className="px-8 py-5 text-right">
                                                    <StatusBadge status={booking.status} type="job" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-medium italic">
                                                No activity recorded for this user yet
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
