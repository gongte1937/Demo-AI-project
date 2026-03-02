import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Download, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useThemeStore } from '@/stores/useThemeStore';
import { useIdeaStore } from '@/stores/useIdeaStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { exportAsJSON, exportAsCSV } from '@/utils/export';
import { toast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { ideas, clearIdeas } = useIdeaStore();
  const {
    user,
    updateProfile,
    logout,
    loading: authLoading,
  } = useAuthStore();
  const [confirmClear, setConfirmClear] = useState(false);
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');

  const isDark = theme === 'dark';

  useEffect(() => {
    setNickname(user?.nickname ?? '');
    setAvatar(user?.avatar ?? '');
  }, [user]);

  function handleExportJSON() {
    exportAsJSON(ideas);
    toast({ title: 'Exported as JSON' });
  }

  function handleExportCSV() {
    exportAsCSV(ideas);
    toast({ title: 'Exported as CSV' });
  }

  function handleClearData() {
    // In a real app this would call the API to delete all ideas.
    // For the mock: reload the page to reset in-memory store.
    window.location.reload();
  }

  async function handleSaveProfile() {
    try {
      await updateProfile({
        nickname: nickname.trim() || undefined,
        avatar: avatar.trim() || undefined,
      });
      toast({ title: 'Profile updated' });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not save profile';
      toast({
        variant: 'destructive',
        title: 'Save failed',
        description: message,
      });
    }
  }

  async function handleLogout() {
    await logout();
    clearIdeas();
    navigate('/login', { replace: true });
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <header className="px-4 h-14 flex items-center border-b border-border shrink-0">
        <h1 className="font-semibold">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">

        {/* Account */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Account
          </h2>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user?.email ?? ''} readOnly />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Your display name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="outline" onClick={handleSaveProfile} disabled={authLoading}>
                {authLoading ? 'Saving…' : 'Save Profile'}
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Appearance */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Appearance
          </h2>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
              <div>
                <Label className="font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">{isDark ? 'Currently dark' : 'Currently light'}</p>
              </div>
            </div>
            <Switch checked={isDark} onCheckedChange={toggleTheme} />
          </div>
        </section>

        <Separator />

        {/* Recording */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recording
          </h2>
          <div className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div>
              <Label className="font-medium">Maximum duration</Label>
              <p className="text-xs text-muted-foreground mt-0.5">5 minutes per recording</p>
            </div>
            <Separator />
            <div>
              <Label className="font-medium">Format</Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                WebM (Chrome/Firefox) · OGG (fallback)
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* Data */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Data
          </h2>

          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="p-4">
              <p className="text-sm font-medium">
                {ideas.length} idea{ideas.length !== 1 ? 's' : ''} stored
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                All data is stored locally in this session
              </p>
            </div>

            <div className="p-4 flex flex-col gap-3">
              <Label className="font-medium">Export data</Label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportJSON} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  JSON
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex-1 gap-2">
                  <Download className="h-4 w-4" />
                  CSV
                </Button>
              </div>
            </div>

            <div className="p-4">
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 className="h-4 w-4" />
                Clear all data
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Permanently deletes all ideas. This can't be undone.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* About */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">About</h2>
          <div className="rounded-xl border border-border bg-card p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Echolater</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Version 0.1.0 · Voice idea recording tool
            </p>
            <p className="text-xs text-muted-foreground">
              Currently running with mock data. Connect a backend to persist ideas across sessions.
            </p>
          </div>
        </section>

      </div>

      {/* Confirm clear dialog */}
      <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all data?</DialogTitle>
            <DialogDescription>
              This will permanently delete all {ideas.length} idea{ideas.length !== 1 ? 's' : ''}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <Button variant="outline" onClick={() => setConfirmClear(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleClearData}>Clear Everything</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
