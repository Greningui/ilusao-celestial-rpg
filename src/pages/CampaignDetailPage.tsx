import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Plus, Check, X, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCampaign, useCampaignInscriptions, useUpdateInscription, useDeleteInscription, useUpdateCampaign } from '@/hooks/useCampaigns';
import { useToast } from '@/hooks/use-toast';

export default function CampaignDetailPage() {
  const { user, loading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: campaign, isLoading: campaignLoading } = useCampaign(id);
  const { data: inscriptions = [], isLoading: inscriptionsLoading } = useCampaignInscriptions(id);
  const updateInscription = useUpdateInscription();
  const deleteInscription = useDeleteInscription();
  const updateCampaign = useUpdateCampaign();
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  if (loading || campaignLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !campaign) return <Navigate to="/campaigns" replace />;

  const isMaster = campaign.master_id === user.id;
  const isAccepted = inscriptions.find((i: any) => i.player_id === user.id && i.status === 'accepted');
  const isPending = inscriptions.find((i: any) => i.player_id === user.id && i.status === 'pending');

  const handleAcceptPlayer = async (inscriptionId: string) => {
    try {
      await updateInscription.mutateAsync({
        id: inscriptionId,
        status: 'accepted',
        responded_at: new Date().toISOString(),
      });
      toast({ title: 'Player aceito!' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const handleRejectPlayer = async (inscriptionId: string) => {
    try {
      await deleteInscription.mutateAsync(inscriptionId);
      toast({ title: 'Solicitação rejeitada' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const handleEndCampaign = async () => {
    try {
      await updateCampaign.mutateAsync({
        id: campaign.id,
        status: 'closed',
        ended_at: new Date().toISOString(),
      });
      toast({ title: 'Campanha encerrada!' });
      navigate('/campaigns');
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const handleLeaveCampaign = async () => {
    try {
      const inscription = inscriptions.find((i: any) => i.player_id === user.id);
      if (inscription) {
        await deleteInscription.mutateAsync(inscription.id);
        toast({ title: 'Você saiu da campanha' });
        navigate('/campaigns');
      }
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const handleRequestJoin = async () => {
    try {
      const { data: inscription } = await supabase.from('campaign_inscriptions').insert({
        campaign_id: campaign.id,
        player_id: user.id,
        player_name: user.email,
        status: 'pending',
      }).select().single();
      toast({ title: 'Solicitação enviada!' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  const acceptedPlayers = inscriptions.filter((i: any) => i.status === 'accepted');
  const pendingRequests = inscriptions.filter((i: any) => i.status === 'pending');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/campaigns">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="font-display text-xl font-bold text-primary gold-glow">{campaign.name}</h1>
          </div>
          {isAccepted && !isMaster && (
            <Button variant="outline" size="sm" onClick={handleLeaveCampaign}>
              <LogOut className="h-4 w-4 mr-2" /> Sair da Campanha
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Campaign Info */}
          <div className="border border-primary/20 rounded-lg p-4 bg-card/50">
            <h2 className="font-semibold text-lg mb-2">Informações da Campanha</h2>
            {campaign.description && <p className="text-sm text-muted-foreground mb-3">{campaign.description}</p>}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Mestre:</span>
                <p className="font-semibold">{campaign.master_name}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Players:</span>
                <p className="font-semibold">{acceptedPlayers.length}/{campaign.max_players}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-semibold">{campaign.status === 'open' ? 'Aberta' : 'Fechada'}</p>
              </div>
            </div>
          </div>

          {/* Join/Leave Section */}
          {!isMaster && !isAccepted && !isPending && campaign.status === 'open' && (
            <Button onClick={handleRequestJoin} className="w-full">
              <Plus className="h-4 w-4 mr-2" /> Participar da Campanha
            </Button>
          )}

          {isPending && !isMaster && (
            <div className="border border-yellow-500/20 rounded-lg p-4 bg-yellow-500/10">
              <p className="text-sm text-yellow-600">Sua solicitação está pendente de aprovação do mestre.</p>
            </div>
          )}

          {/* Master Management */}
          {isMaster && (
            <>
              {pendingRequests.length > 0 && (
                <div className="border border-primary/20 rounded-lg p-4 bg-card/50">
                  <h3 className="font-semibold mb-3">Solicitações Pendentes ({pendingRequests.length})</h3>
                  <div className="space-y-2">
                    {pendingRequests.map((inscription: any) => (
                      <div key={inscription.id} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
                        <span className="text-sm">{inscription.player_name}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcceptPlayer(inscription.id)}
                            disabled={updateInscription.isPending}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectPlayer(inscription.id)}
                            disabled={deleteInscription.isPending}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-primary/20 rounded-lg p-4 bg-card/50">
                <h3 className="font-semibold mb-3">Players Aceitos ({acceptedPlayers.length}/{campaign.max_players})</h3>
                <div className="space-y-2">
                  {acceptedPlayers.map((inscription: any) => (
                    <div key={inscription.id} className="p-2 bg-secondary/50 rounded text-sm">
                      {inscription.player_name}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowEndConfirm(true)}
                disabled={campaign.status === 'closed'}
              >
                Encerrar Campanha
              </Button>

              {showEndConfirm && (
                <div className="border border-red-500/20 rounded-lg p-4 bg-red-500/10">
                  <p className="text-sm mb-3">Tem certeza que deseja encerrar a campanha?</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={handleEndCampaign}>
                      Sim, encerrar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowEndConfirm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
