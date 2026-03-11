import { useParams, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useItems } from '@/hooks/useItems';

const ITEM_CATEGORIES: Record<string, string> = {
  comuns: 'Itens Comuns',
  raros: 'Itens Raros',
  epicos: 'Itens Épicos',
  lendarios: 'Itens Lendários',
  reliquias: 'Itens Relíquias',
  'mantimentos-basicos': 'Mantimentos Básicos',
  'mantimentos-sofisticados': 'Mantimentos Sofisticados',
};

export default function ItemCategoryPage() {
  const { user, loading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const categoryName = ITEM_CATEGORIES[slug || ''] || 'Categoria';
  const { data: items = [], isLoading } = useItems(slug);

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
            <Link to="/items">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h1 className="font-display text-xl font-bold text-primary gold-glow">{categoryName}</h1>
            </div>
          </div>
          <Link to={`/items/${slug}/create`}>
            <Button size="sm" gap="2">
              <Plus className="h-4 w-4" /> Criar Item
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
          ) : items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">Nenhum item cadastrado ainda.</p>
              <Link to={`/items/${slug}/create`}>
                <Button className="mt-4" size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Criar primeiro item
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item: any) => (
                <div key={item.id} className="border border-primary/20 rounded-lg p-3 bg-card/50 hover:bg-card transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-semibold text-foreground">{item.name}</span>
                      {item.type && <p className="text-xs text-primary mt-1">{item.type}</p>}
                      {item.quantity && <p className="text-xs text-muted-foreground">Quantidade: {item.quantity}</p>}
                      {item.effect && <p className="text-xs text-muted-foreground">Efeito: {item.effect}</p>}
                    </div>
                    {item.rarity && <span className="text-xs text-primary font-semibold">{item.rarity}</span>}
                  </div>
                  {item.description && <p className="text-xs text-muted-foreground mt-2 italic">{item.description}</p>}
                  <p className="text-xs text-muted-foreground mt-2">Criado por: {item.created_by_name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
