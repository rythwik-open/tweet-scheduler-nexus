
import { useState } from 'react';
import { Clock, Plus, Pen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TimeConfig {
  id: string;
  time: string;
  isActive: boolean;
}

const TimeConfigList = () => {
  const [configs, setConfigs] = useState<TimeConfig[]>([]);
  const [newTime, setNewTime] = useState('');
  const [editingConfig, setEditingConfig] = useState<TimeConfig | null>(null);

  const handleAddConfig = () => {
    if (!newTime) return;
    
    const newConfig: TimeConfig = {
      id: crypto.randomUUID(),
      time: newTime,
      isActive: true,
    };
    
    setConfigs(prev => [...prev, newConfig]);
    setNewTime('');
  };

  const handleEditConfig = (config: TimeConfig) => {
    if (!editingConfig?.time) return;
    
    setConfigs(prev => 
      prev.map(c => 
        c.id === config.id 
          ? { ...c, time: editingConfig.time }
          : c
      )
    );
    setEditingConfig(null);
  };

  return (
    <Card className="neumorphic p-6 border-0">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Scheduling Configuration
        </h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full neumorphic rounded-full active:pressed">
              <Plus className="h-4 w-4" />
              Add Time Trigger
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Time Trigger</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="neumorphic-inset"
                />
              </div>
              <Button onClick={handleAddConfig} className="w-full neumorphic rounded-full active:pressed">
                Add Time
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-2">
          {configs.map((config) => (
            <div
              key={config.id}
              className="flex items-center justify-between p-2 rounded-lg neumorphic"
            >
              <span className="text-sm">{config.time}</span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="neumorphic rounded-full active:pressed">
                    <Pen className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Time Trigger</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-time">Time</Label>
                      <Input
                        id="edit-time"
                        type="time"
                        value={editingConfig?.time || config.time}
                        onChange={(e) => 
                          setEditingConfig({
                            ...config,
                            time: e.target.value
                          })
                        }
                        className="neumorphic-inset"
                      />
                    </div>
                    <Button 
                      onClick={() => handleEditConfig(config)} 
                      className="w-full neumorphic rounded-full active:pressed"
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TimeConfigList;
