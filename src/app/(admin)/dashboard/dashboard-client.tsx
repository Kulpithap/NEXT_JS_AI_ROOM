"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  RefreshCcw, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  avgOrderValue: number;
}

interface RevenueData {
  date: string;
  amount: number;
}

interface Order {
  id: number;
  date: string;
  customerName: string;
  totalAmount: number;
  status: "delivered" | "received" | "processing";
}

type Period = "7d" | "30d" | "90d";

export default function DashboardClient({ user }: { user: any }) {
  const [period, setPeriod] = useState<Period>("30d");
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [loading, setLoading] = useState({ stats: true, revenue: true, orders: true });
  const [errors, setErrors] = useState({ stats: null, revenue: null, orders: null });

  const fetchStats = useCallback(async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      const data = await res.json();
      setStats(data);
      setErrors(prev => ({ ...prev, stats: null }));
    } catch (e: any) {
      setErrors(prev => ({ ...prev, stats: e.message }));
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  }, []);

  const fetchRevenue = useCallback(async () => {
    setLoading(prev => ({ ...prev, revenue: true }));
    try {
      const res = await fetch(`/api/admin/revenue?period=${period}`);
      if (!res.ok) throw new Error("Failed to fetch revenue");
      const data = await res.json();
      setRevenue(data);
      setErrors(prev => ({ ...prev, revenue: null }));
    } catch (e: any) {
      setErrors(prev => ({ ...prev, revenue: e.message }));
    } finally {
      setLoading(prev => ({ ...prev, revenue: false }));
    }
  }, [period]);

  const fetchOrders = useCallback(async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      const res = await fetch("/api/admin/orders?limit=5");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
      setErrors(prev => ({ ...prev, orders: null }));
    } catch (e: any) {
      setErrors(prev => ({ ...prev, orders: e.message }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchRevenue();
    fetchOrders();

    const interval = setInterval(() => {
      fetchStats();
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStats, fetchRevenue, fetchOrders]);

  useEffect(() => {
    fetchRevenue();
  }, [fetchRevenue]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(dateStr));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
          {(["7d", "30d", "90d"] as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "ghost"}
              size="sm"
              onClick={() => setPeriod(p)}
              className="px-4"
            >
              {p === "7d" && "7 วัน"}
              {p === "30d" && "30 วัน"}
              {p === "90d" && "90 วัน"}
            </Button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="รายได้รวม" 
          value={stats ? formatCurrency(stats.totalRevenue) : "..."} 
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
          loading={loading.stats} 
          error={errors.stats}
          onRetry={fetchStats}
        />
        <StatCard 
          title="คำสั่งซื้อ" 
          value={stats ? stats.totalOrders.toLocaleString() : "..."} 
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />} 
          loading={loading.stats} 
          error={errors.stats}
          onRetry={fetchStats}
        />
        <StatCard 
          title="ลูกค้าทั้งหมด" 
          value={stats ? stats.totalCustomers.toLocaleString() : "..."} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
          loading={loading.stats} 
          error={errors.stats}
          onRetry={fetchStats}
        />
        <StatCard 
          title="เฉลี่ยต่อออเดอร์" 
          value={stats ? formatCurrency(stats.avgOrderValue) : "..."} 
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} 
          loading={loading.stats} 
          error={errors.stats}
          onRetry={fetchStats}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>แนวโน้มรายได้</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.revenue ? (
              <div className="h-[300px] flex items-center justify-center">
                <Spinner />
              </div>
            ) : errors.revenue ? (
              <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-muted-foreground">{errors.revenue}</p>
                <Button variant="outline" size="sm" onClick={fetchRevenue}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> ลองอีกครั้ง
                </Button>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenue}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(str) => new Date(str).toLocaleDateString("th-TH", { day: 'numeric', month: 'short' })}
                    />
                    <YAxis 
                      tickFormatter={(val) => `฿${val / 1000}k`}
                    />
                    <Tooltip 
                      formatter={(val: any) => [formatCurrency(Number(val) || 0), "รายได้"]}
                      labelFormatter={(label: any) => formatDate(String(label))}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>ออเดอร์ล่าสุด</CardTitle>
            <Button variant="ghost" size="sm" onClick={fetchOrders} disabled={loading.orders}>
              <RefreshCcw className={`h-3 w-3 ${loading.orders ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {loading.orders ? (
              <div className="h-[300px] flex items-center justify-center">
                <Spinner />
              </div>
            ) : errors.orders ? (
              <div className="h-[300px] flex flex-col items-center justify-center gap-2 text-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
                <p className="text-sm text-muted-foreground">{errors.orders}</p>
                <Button variant="outline" size="sm" onClick={fetchOrders}>
                  <RefreshCcw className="mr-2 h-3 w-3" /> ลองอีกครั้ง
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ออเดอร์</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead className="text-right">ยอดรวม</TableHead>
                      <TableHead className="text-center">สถานะ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                          ไม่พบข้อมูลออเดอร์
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">#{order.id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell className="text-right">{formatCurrency(order.totalAmount)}</TableCell>
                          <TableCell className="text-center">
                            <OrderStatusBadge status={order.status} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, loading, error, onRetry }: { 
  title: string, 
  value: string, 
  icon: React.ReactNode, 
  loading: boolean, 
  error: string | null,
  onRetry: () => void 
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon}
        </div>
        <div className="flex items-baseline gap-2">
          {loading ? (
            <Spinner className="h-6 w-6" />
          ) : error ? (
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <Button variant="link" size="sm" className="h-auto p-0 text-destructive" onClick={onRetry}>
                รีโหลด
              </Button>
            </div>
          ) : (
            <h2 className="text-2xl font-bold">{value}</h2>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const config = {
    delivered: { label: "ส่งแล้ว", color: "bg-green-100 text-green-700" },
    received: { label: "ได้รับแล้ว", color: "bg-blue-100 text-blue-700" },
    processing: { label: "กำลังดำเนินการ", color: "bg-yellow-100 text-yellow-700" },
  };
  const { label, color } = config[status];
  return (
    <Badge className={`${color} border-none font-normal`}>
      {label}
    </Badge>
  );
}
