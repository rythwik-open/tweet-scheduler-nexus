import { format } from 'date-fns';
import { List } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  scheduledTime: string | null;
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

const QueueList = ({ posts }: QueueListProps) => {
  const sortedPosts = [...posts].sort((a, b) => {
    if (!a.scheduledTime) return 1;
    if (!b.scheduledTime) return -1;
    const dateA = new Date(a.scheduledTime);
    const dateB = new Date(b.scheduledTime);
    // Handle invalid dates (fallback to original behavior)
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5" />
        <h2 className="text-lg font-semibold text-primary">Queue</h2>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
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
                      {format(new Date(post.scheduledTime), 'PPP')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No posts in queue
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueList;