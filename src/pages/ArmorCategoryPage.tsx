import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useArmors } from '@/hooks/useArmors';

const ARMOR_CATEGORIES: Record<string, string> = {
  comuns: 'Armaduras Comuns',
  raras: 'Armaduras Raras',
  epicas: 'Armaduras Épicas',
  lendarias: 'Armaduras Lendárias',
  miticas: 'Armaduras Míticas',
  reliquias: 'Armaduras Relíquias',
};

export default function ArmorCategoryPage() {
  const { user, loading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const categoryName = ARMOR_CATEGORIES[slug || ''] || 'Categoria';
  const { data: armors = [], isLoading } = useArmors(slug);

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
            <Link to="/armors">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h1 className="font-display text-xl font-bold text-primary gold-glow">{categoryName}</h1>
            </div>
          </div>
          <Link to={`/armors/${slug}/create`}>
            <Button size="sm" gap="2">
              <Plus className="h-4 w-4" /> Criar Armadura
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : armors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Nenhuma armadura cadastrada ainda.</p>
              <Link to={`/armors/${slug}/create`}>
                <Button className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Criar primeira armadura
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {armors.map((armor: any) => (
                <div key={armor.id} className="border border-primary/20 rounded-lg p-3 bg-card/50 hover:bg-card transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-semibold text-foreground">{armor.name}</span>
                      {armor.type && <p className="text-xs text-primary mt-1">{armor.type}</p>}
                      {armor.defense && <p className="text-xs text-muted-foreground">Defesa: {armor.defense}</p>}
                      {armor.special_effect && <p className="text-xs text-muted-foreground">Efeito: {armor.special_effect}</p>}
                    </div>
                    {armor.rarity && <span className="text-xs text-primary font-semibold">{armor.rarity}</span>}
                  </div>
                  {armor.description && <p className="text-xs text-muted-foreground mt-2 italic">{armor.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Criado por: {armor.created_by_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
