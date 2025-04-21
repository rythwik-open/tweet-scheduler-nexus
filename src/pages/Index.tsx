
import { Plus, BarChart } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Index = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
        <button className="neumorphic px-4 py-2 rounded-xl flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Plus className="h-5 w-5" />
          <span>New Post</span>
        </button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Scheduled Posts" value="8" subtitle="Remaining" />
        <StatCard title="Post Frequency" value="2" subtitle="per day" />
        <StatCard title="Posts Today" value="3" subtitle="completed" />
        <StatCard title="Success Rate" value="98%" subtitle="last 30 days" />
      </div>

      {/* Post composer */}
      <Card className="neumorphic p-6 space-y-6">
        <h2 className="text-xl font-semibold text-primary">Create Post</h2>
        <textarea
          className="w-full h-32 neumorphic-inset p-4 text-sm resize-none focus:ring-1 focus:ring-primary outline-none"
          placeholder="Write your tweet..."
        />
        <div className="flex gap-4">
          <button className="neumorphic flex-1 py-3 rounded-xl text-primary hover:opacity-80 transition-opacity">
            Post Now
          </button>
          <button className="neumorphic flex-1 py-3 rounded-xl text-primary hover:opacity-80 transition-opacity">
            Add to Queue
          </button>
        </div>
      </Card>
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

export default Index;
