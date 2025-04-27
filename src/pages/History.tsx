import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowUp } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { Tweet } from 'react-tweet';

// Define the Post interface to match the Lambda response
interface Post {
  createdAt: string;
  content: string;
  link: string;
  status: string;
}

const History = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const [isUserLoaded, setIsUserLoaded] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastKey, setLastKey] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Mock user stats (replace with actual data if available)
  const userStats = {
    totalTweets: posts.length,
    joinedDate: 'January 2024',
  };

  // Check if the user is authenticated and set the user-loaded state
  useEffect(() => {
    if (user) {
      setIsUserLoaded(true);
    }
  }, [user]);

  // Fetch posted tweets from the Lambda API
  const fetchPostedTweets = async (key: any = null, append = false) => {
    if (!user?.profile?.sub || !isUserLoaded || !hasMore || isLoading) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch('https://zhewfn3l0l.execute-api.ap-south-1.amazonaws.com/getPosted', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.profile.sub,
          limit: 10,
          lastKey: key,
        }),
      });
      if (response.ok) {
        const { items, lastKey: newLastKey } = await response.json();
        if (append) {
          setPosts(prev => {
            const updatedPosts = [...prev, ...items];
            // Always sort by newest first, consistent with the original behavior
            return updatedPosts.sort((a: Post, b: Post) => {
              const dateA = new Date(a.createdAt);
              const dateB = new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            });
          });
        } else {
          const sortedItems = items.sort((a: Post, b: Post) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime(); // Newest first
          });
          setPosts(sortedItems);
        }
        setLastKey(newLastKey);
        setHasMore(!!newLastKey && items.length > 0);
      } else {
        setFetchError('Failed to load posted tweets');
        setHasMore(false);
      }
    } catch (error) {
      setFetchError('Error loading posted tweets');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tweets when the user is loaded
  useEffect(() => {
    if (isUserLoaded && user?.profile?.sub) {
      fetchPostedTweets(null, false);
    }
  }, [user, isUserLoaded]);

  // Set up the IntersectionObserver for infinite scrolling
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !isLoading) {
      console.log('IntersectionObserver triggered, fetching more posts...');
      fetchPostedTweets(lastKey, true);
    }
  }, [hasMore, isLoading, lastKey]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [handleObserver]);

  // Show/hide "Back to Top" button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Function to extract tweet ID from link
  const extractTweetId = (link: string): string | null => {
    try {
      const url = new URL(link);
      const pathParts = url.pathname.split('/');
      const tweetId = pathParts[pathParts.length - 1];
      return /^\d+$/.test(tweetId) ? tweetId : null;
    } catch (error) {
      console.error(`Invalid URL format for link: ${link}`, error);
      return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-primary">Tweet History</h1>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Showing all posted tweets
            </span>
          </div>
        </div>
      </div>

      {/* User Stats Section */}
      <Card className="neumorphic p-6 border-0">
        <h2 className="text-lg font-semibold text-primary">Your Stats</h2>
        <div className="mt-2 space-y-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Total Tweets Posted:</span> {userStats.totalTweets}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Joined:</span> {userStats.joinedDate}
          </p>
        </div>
      </Card>

      {/* Tweet List (Single Column) */}
      <Card className="border-0 p-0">
        {isLoading && posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            Loading posted tweets...
          </div>
        ) : fetchError ? (
          <div className="text-center text-red-500 py-10">
            {fetchError}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-muted-foreground py-10">
            No tweets have been posted yet
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => {
              const tweetId = extractTweetId(post.link);
              return (
                <div key={`${post.createdAt}-${index}`} className="space-y-4">
                  <div className="neumorphic p-4 rounded-lg flex flex-col justify-between items-center h-[400px] w-[500px] mx-auto">
                    <div className="h-[340px] w-[450px] overflow-auto">
                      {tweetId ? (
                        <Tweet id={tweetId} />
                      ) : (
                        <div className="h-full flex flex-col justify-center items-center text-center p-4">
                          <p className="text-muted-foreground mb-2">
                            Unable to embed tweet
                          </p>
                          <a
                            href={post.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View on Twitter
                          </a>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mt-2">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {/* Divider between tweets (not shown after the last tweet) */}
                  {index < posts.length - 1 && (
                    <hr className="border-t w-[500px] mx-auto" />
                  )}
                </div>
              );
            })}
            {hasMore && (
              <div ref={loadMoreRef} className="h-10">
                {isLoading && (
                  <div className="text-center text-muted-foreground py-4">
                    Loading more tweets...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="text-center text-muted-foreground py-4">
            No more tweets to load
          </div>
        )}
      </Card>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent p-3"
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
};

export default History;