import { Card } from '@/components/ui/card';
import { Settings as SettingsIcon, Twitter, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useXAuth } from '@/context/XAuthContext';

const Settings = () => {
  const { isAuthenticated, login, logout, exchangeCodeForToken, user } = useXAuth();

  const handleConnectTwitter = async () => {
    try {
      const code = await login();
      await exchangeCodeForToken(code);
    } catch (error) {
      console.error('X Auth failed:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            System Configuration
          </span>
        </div>
      </div>

      <div className="grid gap-6">
        <Card className="neumorphic p-6 border-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-primary">Account Details</h2>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" className="neumorphic-inset border-0" placeholder="Your display name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" className="neumorphic-inset border-0" placeholder="your@email.com" />
              </div>
            </div>
            <Button className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent">
              Update Profile
            </Button>
          </div>
        </Card>

        <Card className="neumorphic p-6 border-0">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-primary">Twitter Integration</h2>
            </div>
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <img
                  src={user.profile_image_url}
                  alt="Profile"
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <p className="text-primary font-semibold">@{user.username}</p>
                  <p className="text-muted-foreground">Connected as {user.name}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Connect your Twitter account to enable posting.
              </p>
            )}
            <Button
              onClick={isAuthenticated ? logout : handleConnectTwitter}
              className="neumorphic rounded-full active:pressed text-accent hover:text-accent border-0 hover:bg-transparent"
            >
              <Twitter className="h-4 w-4 mr-2" />
              {isAuthenticated ? 'Disconnect Twitter Account' : 'Connect Twitter Account'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;