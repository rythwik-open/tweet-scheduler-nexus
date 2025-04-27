import { format } from 'date-fns';
import { List, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface Post {
  id: string; // queueId_postId
  content: string;
  scheduledTime: string | null;
  status: 'draft' | 'scheduled' | 'queued' | 'Posted'; // Updated to match Schedule.tsx
  queueId: string;
  createdAt: string;
}

interface Queue {
  id: string;
  name: string;
}

interface QueueListProps {
  posts: Post[];
  queues: Queue[];
  sortDirection: 'newest' | 'oldest';
  onDeletePost: (postId: string) => void;
  selectedPostIds: string[];
  setSelectedPostIds: (ids: string[]) => void;
  isSelectMultipleEnabled: boolean;
}

const QueueList = ({ posts, sortDirection, onDeletePost, selectedPostIds, setSelectedPostIds, isSelectMultipleEnabled }: QueueListProps) => {
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    return sortDirection === 'newest' 
      ? dateB.getTime() - dateA.getTime()
      : dateA.getTime() - dateB.getTime();
  });

  const handleCheckboxChange = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPostIds([...selectedPostIds, postId]);
    } else {
      setSelectedPostIds(selectedPostIds.filter(id => id !== postId));
    }
  };

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
                <div className="flex items-center gap-2">
                  {isSelectMultipleEnabled && (
                    <Checkbox
                      checked={selectedPostIds.includes(post.id)}
                      onCheckedChange={(checked) => handleCheckboxChange(post.id, !!checked)}
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="neumorphic rounded-full active:pressed text-red-500 hover:text-red-500 hover:bg-transparent"
                    onClick={() => setDeletePostId(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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

      <Dialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletePostId(null)}
              className="neumorphic-inset"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deletePostId) onDeletePost(deletePostId);
                setDeletePostId(null);
              }}
              className="neumorphic rounded-full text-white bg-red-500 hover:bg-red-600"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QueueList;