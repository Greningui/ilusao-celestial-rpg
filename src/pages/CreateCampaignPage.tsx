import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCreateCampaign } from '@/hooks/useCampaigns';

export default function CreateCampaignPage() {
  const { user, loading, isMaster } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCampaign = useCreateCampaign();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    max_players: 5,
  });

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || !isMaster) return <Navigate to="/campaigns" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: 'Erro', description: 'Nome da campanha é obrigatório', variant: 'destructive' });
      return;
    }

    try {
      const profile = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
      await createCampaign.mutateAsync({
        name: formData.name,
        description: formData.description,
        master_id: user.id,
        master_name: profile.data?.display_name || user.email || 'Mestre',
        max_players: formData.max_players,
        status: 'open',
      });
      toast({ title: 'Campanha criada com sucesso!' });
      navigate('/campaigns');
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/campaigns">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Criar Campanha</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Nome da Campanha</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-primary/20"
                placeholder="Ex: A Jornada do Dragão"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-primary/20 min-h-[100px]"
                placeholder="Descreva a campanha..."
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Limite de Players</Label>
              <Input
                type="number"
                min="1"
                max="20"
                value={formData.max_players}
                onChange={(e) => setFormData({ ...formData, max_players: parseInt(e.target.value) })}
                className="border-primary/20"
              />
            </div>

            <Button type="submit" disabled={createCampaign.isPending} className="w-full">
              {createCampaign.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Criar Campanha
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
