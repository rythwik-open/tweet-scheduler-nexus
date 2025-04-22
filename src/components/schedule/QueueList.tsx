
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

interface Post {
  id: string;
  content: string;
  scheduledTime: Date | null;
  status: 'draft' | 'scheduled';
}

interface QueueListProps {
  posts: Post[];
}

const QueueList = ({ posts }: QueueListProps) => {
  const sortedPosts = [...posts].sort((a, b) => {
    if (!a.scheduledTime) return 1;
    if (!b.scheduledTime) return -1;
    return a.scheduledTime.getTime() - b.scheduledTime.getTime();
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-primary">Queue</h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {sortedPosts.map((post) => (
          <Card key={post.id} className="neumorphic p-4">
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
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No posts in queue
          </div>
        )}
      </div>
    </div>
  );
};

export default QueueList;
