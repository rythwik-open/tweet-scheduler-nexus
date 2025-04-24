
import { Card } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
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

      <Card className="neumorphic p-6 border-0">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-primary">General Settings</h2>
          <p className="text-muted-foreground">Configure your application settings here.</p>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
