import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Skull, Plus, Loader2, Trash2, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useBestiary, useDeleteBestiaryCreature } from '@/hooks/useBestiary';
import { useToast } from '@/hooks/use-toast';

const BESTIARY_CATEGORIES: Record<string, string> = {
  comuns: 'Criaturas Comuns',
  raras: 'Criaturas Raras',
  epicas: 'Criaturas Épicas',
  lendarias: 'Criaturas Lendárias',
  miticas: 'Criaturas Míticas',
  reliquias: 'Criaturas Relíquias',
};

export default function BestiaryCategoryPage() {
  const { user, loading, isCreator, isAdmin } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const categoryName = BESTIARY_CATEGORIES[slug || ''] || 'Categoria';
  const { data: creatures = [], isLoading } = useBestiary(slug);
  const deleteCreature = useDeleteBestiaryCreature();
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const handleDelete = async (id: string) => {
    try {
      await deleteCreature.mutateAsync(id);
      toast({ title: 'Criatura deletada!' });
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/bestiary">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Skull className="h-5 w-5 text-primary" />
              <h1 className="font-display text-xl font-bold text-primary gold-glow">{categoryName}</h1>
            </div>
          </div>
          {(isCreator || isAdmin) && (
            <Link to={`/bestiary/${slug}/create`}>
              <Button size="sm" gap="2">
                <Plus className="h-4 w-4" /> Criar Criatura
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : creatures.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Skull className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Nenhuma criatura cadastrada ainda.</p>
              {(isCreator || isAdmin) && (
                <Link to={`/bestiary/${slug}/create`}>
                  <Button className="mt-4" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Criar primeira criatura
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {creatures.map((creature: any) => (
                <div key={creature.id} className="border border-primary/20 rounded-lg p-3 bg-card/50 hover:bg-card transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-semibold text-foreground">{creature.name}</span>
                      {creature.type && <p className="text-xs text-primary mt-1">{creature.type}</p>}
                      {creature.hp && <p className="text-xs text-muted-foreground">HP: {creature.hp}</p>}
                      {creature.attack && <p className="text-xs text-muted-foreground">Ataque: {creature.attack}</p>}
                      {creature.defense && <p className="text-xs text-muted-foreground">Defesa: {creature.defense}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {creature.rarity && <span className="text-xs text-primary font-semibold">{creature.rarity}</span>}
                      {(isCreator || isAdmin) && (creature.created_by === user.id || isAdmin) && (
                        <div className="flex gap-1">
                          <Link to={`/bestiary/${slug}/edit/${creature.id}`}>
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(creature.id)}
                            disabled={deleteCreature.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  {creature.description && <p className="text-xs text-muted-foreground mt-2 italic">{creature.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Criado por: {creature.created_by_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
