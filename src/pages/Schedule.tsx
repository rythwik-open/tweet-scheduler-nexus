import { useState } from 'react';
import { Calendar, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import PostScheduler from '@/components/schedule/PostScheduler';
import QueueList from '@/components/schedule/QueueList';
import TimeConfigList from '@/components/schedule/TimeConfigList';

interface Post {
  id: string;
  content: string;
  scheduledTime: Date | null;
  status: 'draft' | 'scheduled';
}

const Schedule = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');

  const handlePostNow = () => {
    if (!content.trim()) return;

    const newPosts = content.split('\n\n').filter(text => text.trim()).map(text => ({
      id: crypto.randomUUID(),
      content: text.trim(),
      scheduledTime: null,
      status: 'draft' as const
    }));

    setPosts(prev => [...prev, ...newPosts]);
    setContent('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Schedule</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Queue: {posts.length} posts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-6">
        <div className="space-y-4">
          <Card className="neumorphic p-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-primary">Create Posts</h2>
              <Textarea
                placeholder="Enter your post content here... 
Use double line breaks to separate multiple posts for bulk upload."
                className="min-h-[200px] text-foreground"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex gap-3">
                <Button 
                  onClick={handlePostNow}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Post Now
                </Button>
                <PostScheduler
                  content={content}
                  onSchedule={(scheduledTime) => {
                    if (!content.trim()) return;
                    
                    const newPosts = content.split('\n\n')
                      .filter(text => text.trim())
                      .map(text => ({
                        id: crypto.randomUUID(),
                        content: text.trim(),
                        scheduledTime,
                        status: 'scheduled' as const
                      }));

                    setPosts(prev => [...prev, ...newPosts]);
                    setContent('');
                  }}
                />
              </div>
            </div>
          </Card>
          
          <TimeConfigList />
        </div>

        <div className="h-full">
          <Card className="neumorphic h-full">
            <QueueList posts={posts} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
