import React, { useState, useEffect } from 'react';
import { Calendar, Upload, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import PostScheduler from '@/components/schedule/PostScheduler';
import QueueList from '@/components/schedule/QueueList';
import { useAuth } from 'react-oidc-context';

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
  frequency: string;
  timeOfDay: string;
}

const Schedule = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  // State hooks
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState('');
  const [queues, setQueues] = useState<Queue[]>([
    { id: 'default', name: 'Default Queue', frequency: 'daily', timeOfDay: '09:00' }
  ]);
  const [selectedQueue, setSelectedQueue] = useState('default');
  const [newQueueName, setNewQueueName] = useState('');
  const [newQueueFrequency, setNewQueueFrequency] = useState('daily');
  const [newQueueTime, setNewQueueTime] = useState('09:00');
  const [queueFilter, setQueueFilter] = useState('all');
  const [isPosting, setIsPosting] = useState(false);

  // Ensure that the user is loaded
  useEffect(() => {
    if (user) {
      setIsUserLoaded(true);
    }
  }, [user]);

  // Early return after all hooks
  if (!auth || !isUserLoaded) {
    return (
      <div className="loading-state">
        <p>Loading user data...</p>
      </div>
    );
  }

  const handlePostNow = async () => {
    if (!content.trim()) return;
    if (!user?.profile?.sub) {
      console.error('User not authenticated.');
      return;
    }

    const postsArray = content.split('\n\n').filter(text => text.trim());
    const id = crypto.randomUUID();

    setIsPosting(true);

    for (const postContent of postsArray) {
      try {
        const response = await fetch('https://zhewfn3l0l.execute-api.ap-south-1.amazonaws.com/addToQueue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.profile.sub,
            content: postContent.trim(),
            scheduledTime: null,
            queueId: selectedQueue,
          }),
        });

        if (!response.ok) {
          console.error('Failed to add to queue:', postContent);
        } else {
          setPosts(prev => [
            ...prev,
            {
              id,
              content: postContent.trim(),
              scheduledTime: null,
              status: 'draft',
              queueId: selectedQueue,
            }
          ]);
        }
      } catch (error) {
        console.error('Error adding to queue:', error);
      }
    }

    setIsPosting(false);
    setContent('');
  };

  const handleAddQueue = () => {
    if (!newQueueName.trim()) return;

    const newQueue = {
      id: crypto.randomUUID(),
      name: newQueueName.trim(),
      frequency: newQueueFrequency,
      timeOfDay: newQueueTime,
    };

    setQueues(prev => [...prev, newQueue]);
    setSelectedQueue(newQueue.id);
    setNewQueueName('');
    setNewQueueFrequency('daily');
    setNewQueueTime('09:00');
  };

  const handleSchedulePost = async (scheduledTime: Date, queueId: string) => {
    if (!content.trim()) return;
    if (!user?.profile?.sub) {
      console.error('User not authenticated.');
      return;
    }

    const postsArray = content.split('\n\n').filter(text => text.trim());
    const id = crypto.randomUUID();

    setIsPosting(true);

    for (const postContent of postsArray) {
      try {
        const response = await fetch('https://zhewfn3l0l.execute-api.ap-south-1.amazonaws.com/addToQueue', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.profile.sub,
            content: postContent.trim(),
            scheduledTime: scheduledTime.toISOString(),
            queueId,
          }),
        });

        if (!response.ok) {
          console.error('Failed to schedule post:', postContent);
        } else {
          setPosts(prev => [
            ...prev,
            {
              id,
              content: postContent.trim(),
              scheduledTime: scheduledTime.toISOString(),
              status: 'scheduled',
              queueId,
            }
          ]);
        }
      } catch (error) {
        console.error('Error scheduling post:', error);
      }
    }

    setIsPosting(false);
    setContent('');
  };

  const filteredPosts = queueFilter === 'all'
    ? posts
    : posts.filter(post => post.queueId === queueFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Schedule</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left side: Create Posts */}
        <Card className="neumorphic p-6 border-0">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">Create Posts</h2>

            <Select value={selectedQueue} onValueChange={setSelectedQueue}>
              <SelectTrigger className="neumorphic-inset border-0">
                <SelectValue placeholder="Select queue" />
              </SelectTrigger>
              <SelectContent>
                {queues.map(queue => (
                  <SelectItem key={queue.id} value={queue.id}>
                    {queue.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Enter your post content here...\nUse double line breaks to separate multiple posts."
              className="min-h-[200px] text-foreground neumorphic-inset border-0"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex gap-3">
              <Button
                onClick={handlePostNow}
                disabled={isPosting}
                className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent"
              >
                <Upload className="h-4 w-4" />
                {isPosting ? 'Adding...' : 'Add to Queue'}
              </Button>
              <PostScheduler
                content={content}
                selectedQueue={selectedQueue}
                onSchedule={handleSchedulePost}
              />
            </div>
          </div>
        </Card>

        {/* Right side: Queues */}
        <Card className="neumorphic p-6 border-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-primary">Queues</h2>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent h-8 px-3">
                  <Plus className="h-4 w-4" />
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
                  <Select value={newQueueFrequency} onValueChange={setNewQueueFrequency}>
                    <SelectTrigger className="neumorphic-inset border-0">
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="time"
                    value={newQueueTime}
                    onChange={(e) => setNewQueueTime(e.target.value)}
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

          <div className="space-y-3">
            {queues.map(queue => {
              const postCount = posts.filter(post => post.queueId === queue.id).length;
              return (
                <div key={queue.id} className="flex justify-between items-center p-3 neumorphic-inset rounded-lg">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {queue.name}
                      {postCount > 0 && (
                        <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                          {postCount}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{queue.frequency} at {queue.timeOfDay}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Full-width Posts list */}
      <Card className="neumorphic p-6 border-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Posts</h2>

          <Select value={queueFilter} onValueChange={setQueueFilter}>
            <SelectTrigger className="w-[180px] neumorphic-inset border-0">
              <SelectValue placeholder="Filter by queue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Queues</SelectItem>
              {queues.map(queue => (
                <SelectItem key={queue.id} value={queue.id}>
                  {queue.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No posts yet. Start by creating a new post!
          </div>
        ) : (
          <QueueList posts={filteredPosts} queues={queues} />
        )}
      </Card>
    </div>
  );
};

export default Schedule;