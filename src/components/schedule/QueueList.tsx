
import { format } from 'date-fns';
import { List } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';

interface Post {
  id: string;
  content: string;
  scheduledTime: Date | null;
  status: 'draft' | 'scheduled';
  queueId: string;
}

interface Queue {
  id: string;
  name: string;
}

interface QueueListProps {
  posts: Post[];
  queues: Queue[];
}

const QueueList = ({ posts, queues }: QueueListProps) => {
  const [selectedQueue, setSelectedQueue] = useState('default');

  const filteredPosts = posts.filter(post => post.queueId === selectedQueue);
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (!a.scheduledTime) return 1;
    if (!b.scheduledTime) return -1;
    return a.scheduledTime.getTime() - b.scheduledTime.getTime();
  });

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <List className="h-5 w-5" />
          Queue
        </h2>
        <Select value={selectedQueue} onValueChange={setSelectedQueue}>
          <SelectTrigger className="w-[180px] neumorphic-inset border-0">
            <SelectValue placeholder="Select queue" />
          </SelectTrigger>
          <SelectContent>
            {queues.map((queue) => (
              <SelectItem key={queue.id} value={queue.id}>
                {queue.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
        {sortedPosts.map((post) => (
          <div
            key={post.id}
            className="p-4 rounded-lg neumorphic"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  post.status === 'scheduled' 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {post.status}
                </span>
                {post.scheduledTime && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(post.scheduledTime, 'PPP')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {sortedPosts.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No posts in queue
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueList;
