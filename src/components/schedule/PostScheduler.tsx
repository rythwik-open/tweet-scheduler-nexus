
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PostSchedulerProps {
  content: string;
  onSchedule: (date: Date, queueId: string) => void;
  selectedQueue: string;
}

const PostScheduler = ({ content, onSchedule, selectedQueue }: PostSchedulerProps) => {
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent"
          disabled={!content.trim()}
        >
          <Calendar className="h-4 w-4" />
          Schedule Post
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 neumorphic border-0" align="start">
        <div className="p-3">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              if (newDate) {
                setDate(newDate);
                onSchedule(newDate, selectedQueue);
              }
            }}
            initialFocus
            className={cn("pointer-events-auto")}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PostScheduler;
