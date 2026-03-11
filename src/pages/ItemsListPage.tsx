import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Package, Sparkles, Crown, Gem, Star, Apple, UtensilsCrossed } from 'lucide-react';

const ITEM_CATEGORIES = [
  { slug: 'comuns', label: 'Itens Comuns', icon: Package },
  { slug: 'raros', label: 'Itens Raros', icon: Sparkles },
  { slug: 'epicos', label: 'Itens Épicos', icon: Star },
  { slug: 'lendarios', label: 'Itens Lendários', icon: Crown },
  { slug: 'reliquias', label: 'Itens Relíquias', icon: Gem },
  { slug: 'mantimentos-basicos', label: 'Mantimentos Básicos', icon: Apple },
  { slug: 'mantimentos-sofisticados', label: 'Mantimentos Sofisticados', icon: UtensilsCrossed },
];

export default function ItemsListPage() {
  const { user, loading } = useAuth();

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
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/menu">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Itens e Mantimentos</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ITEM_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} to={`/items/${cat.slug}`}>
                <Button variant="outline" className="w-full h-12 justify-start gap-3 border-primary/20 text-foreground hover:bg-primary/10">
                  <Icon className="h-5 w-5 text-primary shrink-0" />
                  {cat.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
