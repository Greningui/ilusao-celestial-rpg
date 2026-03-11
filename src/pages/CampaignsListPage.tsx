import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Loader2, Plus, Users, Scroll } from 'lucide-react';
import { useCampaigns } from '@/hooks/useCampaigns';

export default function CampaignsListPage() {
  const { user, loading, isMaster } = useAuth();
  const { data: campaigns = [], isLoading } = useCampaigns('open');

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

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
            <Scroll className="h-6 w-6 text-primary" />
            <h1 className="font-display text-xl font-bold text-primary gold-glow">Campanhas</h1>
          </div>
          {isMaster && (
            <Link to="/campaigns/create">
              <Button size="sm" gap="2">
                <Plus className="h-4 w-4" /> Criar Campanha
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Scroll className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Nenhuma campanha disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((campaign: any) => (
                <Link key={campaign.id} to={`/campaigns/${campaign.id}`}>
                  <div className="border border-primary/20 rounded-lg p-4 bg-card/50 hover:bg-card transition-colors h-full">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-foreground text-lg">{campaign.name}</h3>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {campaign.status === 'open' ? 'Aberta' : 'Fechada'}
                      </span>
                    </div>
                    {campaign.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{campaign.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {campaign.current_players}/{campaign.max_players} players
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4" />
                        {campaign.master_name}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
