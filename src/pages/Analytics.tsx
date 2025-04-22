
import { BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const analyticsData = [
  { day: 'Mon', posts: 4 },
  { day: 'Tue', posts: 3 },
  { day: 'Wed', posts: 5 },
  { day: 'Thu', posts: 2 },
  { day: 'Fri', posts: 6 },
  { day: 'Sat', posts: 3 },
  { day: 'Sun', posts: 4 },
];

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Analytics</h1>
        <button className="neumorphic px-4 py-2 rounded-xl flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <BarChart2 className="h-5 w-5" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Chart section */}
      <Card className="neumorphic p-6">
        <h2 className="text-xl font-semibold text-primary mb-6">Weekly Posts</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Bar dataKey="posts" fill="hsl(73 100% 50%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Posts" value="245" subtitle="this month" />
        <StatCard title="Engagement Rate" value="12.4%" subtitle="last 30 days" />
        <StatCard title="Peak Time" value="2:00 PM" subtitle="most active" />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
}

const StatCard = ({ title, value, subtitle }: StatCardProps) => {
  return (
    <Card className="neumorphic p-6">
      <h3 className="text-lg font-medium text-primary">{title}</h3>
      <div className="mt-4">
        <p className="text-4xl font-bold text-primary">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </Card>
  );
};

export default Analytics;
