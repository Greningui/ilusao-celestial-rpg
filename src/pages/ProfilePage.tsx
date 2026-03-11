import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save, Upload, Mail, Phone, User, Bell, History, LogOut } from 'lucide-react';
import { useProfile, useUpdateProfile, useNotificationPreferences, useUpdateNotificationPreferences, useActivityLog, useUploadProfilePicture } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const { data: profile, isLoading: profileLoading } = useProfile(user?.id);
  const { data: preferences } = useNotificationPreferences(user?.id);
  const { data: activityLog = [] } = useActivityLog(user?.id);
  const updateProfile = useUpdateProfile();
  const updatePreferences = useUpdateNotificationPreferences();
  const uploadPicture = useUploadProfilePicture();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'activity'>('profile');
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    email: user?.email || '',
    phone_number: profile?.phone_number || '',
    bio: profile?.bio || '',
  });

  const [notifPrefs, setNotifPrefs] = useState({
    email_notifications: preferences?.email_notifications ?? true,
    sms_notifications: preferences?.sms_notifications ?? true,
    campaign_updates: preferences?.campaign_updates ?? true,
    friend_requests: preferences?.friend_requests ?? true,
    system_updates: preferences?.system_updates ?? true,
  });

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({
        user_id: user.id,
        display_name: formData.display_name,
        phone_number: formData.phone_number,
        bio: formData.bio,
      });
      toast({ title: 'Perfil atualizado com sucesso!' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      await updatePreferences.mutateAsync({
        user_id: user.id,
        ...notifPrefs,
      });
      toast({ title: 'Preferências atualizadas!' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const handleUploadPicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadPicture.mutateAsync({ userId: user.id, file });
      toast({ title: 'Foto atualizada com sucesso!' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const formatPhoneNumber = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length !== 11) return phone;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/menu">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <User className="h-5 w-5 text-primary" />
            <h1 className="font-display text-xl font-bold text-primary gold-glow">Meu Perfil</h1>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-primary/20">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <User className="h-4 w-4 inline mr-2" />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Notificações
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <History className="h-4 w-4 inline mr-2" />
              Atividade
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {profile?.profile_picture_url ? (
                      <img src={profile.profile_picture_url} alt="Perfil" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-primary" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <Button size="sm" variant="outline" asChild>
                      <span>
                        <Upload className="h-4 w-4 mr-2" />
                        Alterar Foto
                      </span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPicture}
                      disabled={uploadPicture.isPending}
                      className="hidden"
                    />
                  </label>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Nome do Jogador</Label>
                    <Input
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      className="border-primary/20"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      type="email"
                      value={formData.email}
                      disabled
                      className="border-primary/20 bg-secondary/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Email não pode ser alterado aqui</p>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefone / WhatsApp
                    </Label>
                    <Input
                      value={formData.phone_number}
                      onChange={(e) => setFormData({ ...formData, phone_number: formatPhoneNumber(e.target.value) })}
                      placeholder="(11) 99999-9999"
                      className="border-primary/20"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Bio</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Conte um pouco sobre você..."
                      className="border-primary/20 min-h-[100px]"
                    />
                  </div>

                  <Button type="submit" disabled={updateProfile.isPending} className="w-full">
                    {updateProfile.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Salvar Alterações
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Preferências de Notificações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/5">
                    <input
                      type="checkbox"
                      checked={notifPrefs.email_notifications}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, email_notifications: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-sm">Notificações por Email</p>
                      <p className="text-xs text-muted-foreground">Receba atualizações por email</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/5">
                    <input
                      type="checkbox"
                      checked={notifPrefs.sms_notifications}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, sms_notifications: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-sm">Notificações por SMS/WhatsApp</p>
                      <p className="text-xs text-muted-foreground">Receba mensagens no seu telefone</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/5">
                    <input
                      type="checkbox"
                      checked={notifPrefs.campaign_updates}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, campaign_updates: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-sm">Atualizações de Campanhas</p>
                      <p className="text-xs text-muted-foreground">Notificações sobre suas campanhas</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/5">
                    <input
                      type="checkbox"
                      checked={notifPrefs.friend_requests}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, friend_requests: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-sm">Solicitações de Amizade</p>
                      <p className="text-xs text-muted-foreground">Notificações de novos amigos</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-primary/20 rounded-lg cursor-pointer hover:bg-primary/5">
                    <input
                      type="checkbox"
                      checked={notifPrefs.system_updates}
                      onChange={(e) => setNotifPrefs({ ...notifPrefs, system_updates: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-sm">Atualizações do Sistema</p>
                      <p className="text-xs text-muted-foreground">Notificações de manutenção e novidades</p>
                    </div>
                  </label>
                </div>

                <Button onClick={handleUpdatePreferences} disabled={updatePreferences.isPending} className="w-full">
                  {updatePreferences.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Preferências
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Histórico de Atividades</CardTitle>
              </CardHeader>
              <CardContent>
                {activityLog.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhuma atividade registrada</p>
                ) : (
                  <div className="space-y-2">
                    {activityLog.map((activity: any) => (
                      <div key={activity.id} className="border border-primary/20 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{activity.action}</p>
                            {activity.description && (
                              <p className="text-xs text-muted-foreground">{activity.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString('pt-BR', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
