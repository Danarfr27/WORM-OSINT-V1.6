import { useState } from 'react';
import { X, Eye, EyeOff, Save, RefreshCw, Key, Cpu } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MODEL_OPTIONS = [
  { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro' },
  { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
];

export function SettingsPanel() {
  const { settings, updateSettings, isSettingsOpen, setIsSettingsOpen } = useSettings();
  const [showApiKey, setShowApiKey] = useState(false);
  const [localApiKey, setLocalApiKey] = useState(settings.apiKey);
  const [localModelId, setLocalModelId] = useState(settings.modelId);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (!isSettingsOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    updateSettings({
      apiKey: localApiKey,
      modelId: localModelId,
    });
    
    setIsSaving(false);
    setSaveMessage('Settings saved successfully');
    
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleReload = () => {
    setLocalApiKey(settings.apiKey);
    setLocalModelId(settings.modelId);
    setSaveMessage('Settings reloaded from storage');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={() => setIsSettingsOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-worm-bg-secondary border border-worm-accent/30 rounded-card shadow-panel glow-cyan animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-worm-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-worm-accent/10 rounded-lg">
              <Key className="w-5 h-5 text-worm-accent" />
            </div>
            <div>
              <h2 className="font-heading font-semibold text-lg text-worm-text-primary">
                Configuration
              </h2>
              <p className="text-xs text-worm-text-secondary font-mono">
                Manage API settings and model preferences
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 text-worm-text-secondary hover:text-worm-accent hover:bg-worm-accent/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-worm-text-secondary">
                <Key className="w-4 h-4" />
                API Key
              </Label>
              <span className="text-xs text-worm-accent/70 font-mono">
                Loaded from ENV
              </span>
            </div>
            <div className="relative">
              <Input
                type={showApiKey ? 'text' : 'password'}
                value={localApiKey}
                onChange={(e) => setLocalApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="pr-12 bg-worm-bg-primary border-worm-accent/30 text-worm-text-primary placeholder:text-worm-text-secondary/50 focus:border-worm-accent focus:ring-worm-accent/20 font-mono"
              />
              <button
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-worm-text-secondary hover:text-worm-accent transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-worm-text-secondary/70">
              Current: <span className="font-mono text-worm-accent/50">********</span> (from Vercel ENV)
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-worm-text-secondary">
              <Cpu className="w-4 h-4" />
              Model ID
            </Label>
            <Select value={localModelId} onValueChange={setLocalModelId}>
              <SelectTrigger className="bg-worm-bg-primary border-worm-accent/30 text-worm-text-primary focus:ring-worm-accent/20">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent className="bg-worm-bg-secondary border-worm-accent/30">
                {MODEL_OPTIONS.map((model) => (
                  <SelectItem
                    key={model.value}
                    value={model.value}
                    className="text-worm-text-primary hover:bg-worm-accent/10 focus:bg-worm-accent/10 focus:text-worm-accent"
                  >
                    {model.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-worm-text-secondary/70">
              Selected model will be used for all search queries
            </p>
          </div>

          {/* Status Message */}
          {saveMessage && (
            <div className="p-3 bg-worm-accent/10 border border-worm-accent/30 rounded-lg">
              <p className="text-sm text-worm-accent font-mono text-center">{saveMessage}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleReload}
              variant="outline"
              className="flex-1 border-worm-accent/30 text-worm-text-secondary hover:bg-worm-accent/10 hover:text-worm-accent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-worm-accent/20 text-worm-accent border border-worm-accent/50 hover:bg-worm-accent/30 btn-glow"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-worm-accent/10 bg-worm-bg-primary/50 rounded-b-card">
          <p className="text-xs text-worm-text-secondary/50 text-center font-mono">
            Changes are stored locally in your browser
          </p>
        </div>
      </div>
    </div>
  );
}
