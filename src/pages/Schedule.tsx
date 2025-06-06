import React, { useState, useEffect } from 'react';
import { Calendar, Upload, Plus, ArrowUpDown, Trash2, CheckSquare } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import PostScheduler from '@/components/schedule/PostScheduler';
import QueueList from '@/components/schedule/QueueList';
import { useAuth } from 'react-oidc-context';

interface Post {
  id: string; // queueId_postId
  content: string;
  scheduledTime: string | null;
  status: 'draft' | 'scheduled' | 'queued' | 'Posted';
  queueId: string;
  createdAt: string;
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
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'newest' | 'oldest'>('oldest'); // Changed to 'oldest'
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isSelectMultipleEnabled, setIsSelectMultipleEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      setIsUserLoaded(true);
    }
  }, [user]);

  const fetchPosts = async () => {
    if (!user?.profile?.sub || !isUserLoaded) return;
    setIsLoadingPosts(true);
    setFetchError(null);
    try {
      const response = await fetch('https://zhewfn3l0l.execute-api.ap-south-1.amazonaws.com/getQueue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.profile.sub }),
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
        setSelectedPostIds([]); // Clear selection on refresh
      } else {
        setFetchError('Failed to load posts');
      }
    } catch (error) {
      setFetchError('Error loading posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user, isUserLoaded]);

  const handlePostNow = async () => {
    if (!content.trim()) return;
    if (!user?.profile?.sub) {
      console.error('User not authenticated.');
      return;
    }

    const postsArray = content.split('\n\n').filter(text => text.trim());
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
          await fetchPosts();
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
          await fetchPosts();
        }
      } catch (error) {
        console.error('Error scheduling post:', error);
      }
    }

    setIsPosting(false);
    setContent('');
  };

  const handleDeletePost = async (postId: string) => {
    if (!user?.profile?.sub) {
      console.error('User not authenticated.');
      return;
    }

    try {
      const response = await fetch('https://zhewfn3l0l.execute-api.ap-south-1.amazonaws.com/deletePost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.profile.sub,
          postId, // queueId_postId
        }),
      });

      if (response.ok) {
        await fetchPosts();
      } else {
        console.error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (!user?.profile?.sub || selectedPostIds.length === 0) return;

    try {
      for (const postId of selectedPostIds) {
        const response = await fetch('https://zhewfn3l0l.execute-api.ap-south-1.amazonaws.com/deletePost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.profile.sub,
            postId, // queueId_postId
          }),
        });

        if (!response.ok) {
          console.error(`Failed to delete post: ${postId}`);
        }
      }
      await fetchPosts();
    } catch (error) {
      console.error('Error during bulk delete:', error);
    } finally {
      setIsBulkDeleteOpen(false);
    }
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'newest' ? 'oldest' : 'newest'));
  };

  const toggleSelectMultiple = () => {
    setIsSelectMultipleEnabled(prev => !prev);
    setSelectedPostIds([]); // Clear selection when toggling
  };

  const filteredPosts = queueFilter === 'all'
    ? posts.filter(post => post.status.toLowerCase() !== 'posted')
    : posts.filter(post => post.queueId === queueFilter && post.status.toLowerCase() !== 'posted');

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Schedule</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
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
                {isPosting ? 'Posting...' : 'Post Now'}
              </Button>
              <PostScheduler
                content={content}
                selectedQueue={selectedQueue}
                onSchedule={handleSchedulePost}
              />
            </div>
          </div>
        </Card>

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
              const postCount = posts.filter(post => post.queueId === queue.id && post.status.toLowerCase() !== 'posted').length;
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

      <Card className="neumorphic p-6 border-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-primary">Posts</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleSelectMultiple}
              className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent h-8 px-3"
              title={isSelectMultipleEnabled ? 'Disable multiple selection' : 'Enable multiple selection'}
            >
              <CheckSquare className="h-4 w-4 mr-1" />
              {isSelectMultipleEnabled ? 'Disable Select' : 'Select Multiple'}
            </Button>
            {isSelectMultipleEnabled && selectedPostIds.length > 0 && (
              <Button
                onClick={() => setIsBulkDeleteOpen(true)}
                className="neumorphic rounded-full active:pressed text-red-500 hover:text-red-500 border-0 hover:bg-transparent h-8 px-3"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            )}
            <Button
              onClick={toggleSortDirection}
              className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent h-8 w-8 p-0"
              title={sortDirection === 'newest' ? 'Sort oldest to newest' : 'Sort newest to oldest'}
            >
              <ArrowUpDown className={`h-4 w-4 ${sortDirection === 'newest' ? 'rotate-0' : 'rotate-180'}`} />
            </Button>
            <span className="text-sm text-muted-foreground">
              {sortDirection === 'newest' ? 'Newest First' : 'Oldest First'}
            </span>
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
        </div>

        {isLoadingPosts ? (
          <div className="text-center text-muted-foreground py-10">
            Loading posts...
          </div>
        ) : fetchError ? (
          <div className="text-center text-red-500 py-10">
            {fetchError}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No posts yet. Start by creating a new post!
          </div>
        ) : (
          <QueueList
            posts={filteredPosts}
            queues={queues}
            sortDirection={sortDirection}
            onDeletePost={handleDeletePost}
            selectedPostIds={selectedPostIds}
            setSelectedPostIds={setSelectedPostIds}
            isSelectMultipleEnabled={isSelectMultipleEnabled}
          />
        )}
      </Card>

      <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Posts</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedPostIds.length} selected post(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBulkDeleteOpen(false)}
              className="neumorphic-inset"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
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

export default Schedule;