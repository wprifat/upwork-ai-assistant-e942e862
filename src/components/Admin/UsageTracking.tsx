import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Users, CreditCard, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Stats {
  totalUsers: number;
  freeUsers: number;
  monthlyUsers: number;
  lifetimeUsers: number;
}

const UsageTracking = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    freeUsers: 0,
    monthlyUsers: 0,
    lifetimeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("plan_type");

      if (error) throw error;

      const total = profiles?.length || 0;
      const free = profiles?.filter((p) => p.plan_type === "free").length || 0;
      const monthly = profiles?.filter((p) => p.plan_type === "monthly").length || 0;
      const lifetime = profiles?.filter((p) => p.plan_type === "lifetime").length || 0;

      setStats({
        totalUsers: total,
        freeUsers: free,
        monthlyUsers: monthly,
        lifetimeUsers: lifetime,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch usage statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Free Plan",
      value: stats.freeUsers,
      icon: UserCheck,
      color: "text-muted-foreground",
    },
    {
      title: "Monthly Plan",
      value: stats.monthlyUsers,
      icon: CreditCard,
      color: "text-blue-500",
    },
    {
      title: "Lifetime Plan",
      value: stats.lifetimeUsers,
      icon: CreditCard,
      color: "text-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Distribution</CardTitle>
          <CardDescription>Breakdown of users by subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Free</TableCell>
                  <TableCell className="text-right">{stats.freeUsers}</TableCell>
                  <TableCell className="text-right">
                    {stats.totalUsers > 0
                      ? ((stats.freeUsers / stats.totalUsers) * 100).toFixed(1)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Monthly</TableCell>
                  <TableCell className="text-right">{stats.monthlyUsers}</TableCell>
                  <TableCell className="text-right">
                    {stats.totalUsers > 0
                      ? ((stats.monthlyUsers / stats.totalUsers) * 100).toFixed(1)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lifetime</TableCell>
                  <TableCell className="text-right">{stats.lifetimeUsers}</TableCell>
                  <TableCell className="text-right">
                    {stats.totalUsers > 0
                      ? ((stats.lifetimeUsers / stats.totalUsers) * 100).toFixed(1)
                      : 0}
                    %
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageTracking;
