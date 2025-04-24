
import { useState } from 'react';
import { Calendar, Upload, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PostScheduler from '@/components/schedule/PostScheduler';
import QueueList from '@/components/schedule/QueueList';
import TimeConfigList from '@/components/schedule/TimeConfigList';

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

const Schedule = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [queues, setQueues] = useState<Queue[]>([
    { id: 'default', name: 'Default Queue' }
  ]);
  const [selectedQueue, setSelectedQueue] = useState('default');
  const [newQueueName, setNewQueueName] = useState('');

  const handlePostNow = () => {
    if (!content.trim()) return;

    const newPosts = content.split('\n\n').filter(text => text.trim()).map(text => ({
      id: crypto.randomUUID(),
      content: text.trim(),
      scheduledTime: null,
      status: 'draft' as const,
      queueId: selectedQueue
    }));

    setPosts(prev => [...prev, ...newPosts]);
    setContent('');
  };

  const handleAddQueue = () => {
    if (!newQueueName.trim()) return;
    
    const newQueue = {
      id: crypto.randomUUID(),
      name: newQueueName.trim()
    };
    
    setQueues(prev => [...prev, newQueue]);
    setNewQueueName('');
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
          <Card className="neumorphic p-6 border-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">Create Posts</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent">
                      <Plus className="h-4 w-4" />
                      New Queue
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Queue</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <Input
                        placeholder="Queue name"
                        value={newQueueName}
                        onChange={(e) => setNewQueueName(e.target.value)}
                        className="neumorphic-inset border-0"
                      />
                      <Button 
                        onClick={handleAddQueue}
                        className="w-full neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent"
                      >
                        Create Queue
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <Select value={selectedQueue} onValueChange={setSelectedQueue}>
                <SelectTrigger className="neumorphic-inset border-0">
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

              <Textarea
                placeholder="Enter your post content here... 
Use double line breaks to separate multiple posts for bulk upload."
                className="min-h-[200px] text-foreground neumorphic-inset border-0"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex gap-3">
                <Button 
                  onClick={handlePostNow}
                  className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent"
                >
                  <Upload className="h-4 w-4" />
                  Post Now
                </Button>
                <PostScheduler
                  content={content}
                  selectedQueue={selectedQueue}
                  onSchedule={(scheduledTime, queueId) => {
                    if (!content.trim()) return;
                    
                    const newPosts = content.split('\n\n')
                      .filter(text => text.trim())
                      .map(text => ({
                        id: crypto.randomUUID(),
                        content: text.trim(),
                        scheduledTime,
                        status: 'scheduled' as const,
                        queueId
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
          <Card className="neumorphic h-full border-0">
            <QueueList posts={posts} queues={queues} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
