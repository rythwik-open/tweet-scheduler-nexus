
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const History = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Tweet History</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Showing all posted tweets
          </span>
        </div>
      </div>

      <Card className="neumorphic p-6 border-0">
        <div className="space-y-6">
          <p className="text-center text-muted-foreground py-8">
            No tweets have been posted yet
          </p>
        </div>
      </Card>
    </div>
  );
};

export default History;
