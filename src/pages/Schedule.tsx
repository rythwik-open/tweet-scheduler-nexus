
import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Schedule = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Schedule</h1>
        <button className="neumorphic px-4 py-2 rounded-xl flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
          <Calendar className="h-5 w-5" />
          <span>New Schedule</span>
        </button>
      </div>

      {/* Schedule grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScheduleCard 
          time="9:00 AM" 
          title="Product Launch Tweet"
          status="scheduled"
        />
        <ScheduleCard 
          time="2:30 PM" 
          title="Weekly Update"
          status="draft"
        />
        <ScheduleCard 
          time="5:00 PM" 
          title="Community Engagement"
          status="scheduled"
        />
      </div>
    </div>
  );
};

interface ScheduleCardProps {
  time: string;
  title: string;
  status: 'scheduled' | 'draft';
}

const ScheduleCard = ({ time, title, status }: ScheduleCardProps) => {
  return (
    <Card className="neumorphic p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground">{time}</p>
          <h3 className="text-lg font-medium text-primary mt-1">{title}</h3>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === 'scheduled' 
            ? 'bg-primary/20 text-primary' 
            : 'bg-muted text-muted-foreground'
        }`}>
          {status}
        </span>
      </div>
    </Card>
  );
};

export default Schedule;
