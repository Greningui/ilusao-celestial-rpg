import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Plus, Skull, Shield, Sparkles, Crown, Star, Gem } from 'lucide-react';

const BESTIARY_CATEGORIES = [
  { slug: 'comuns', label: 'Criaturas Comuns', icon: Skull },
  { slug: 'raras', label: 'Criaturas Raras', icon: Shield },
  { slug: 'epicas', label: 'Criaturas Épicas', icon: Sparkles },
  { slug: 'lendarias', label: 'Criaturas Lendárias', icon: Crown },
  { slug: 'miticas', label: 'Criaturas Míticas', icon: Star },
  { slug: 'reliquias', label: 'Criaturas Relíquias', icon: Gem },
];

export default function BestiaryListPage() {
  const { user, loading, isCreator, isAdmin } = useAuth();

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
            <h1 className="font-display text-xl font-bold text-primary gold-glow">Bestiário</h1>
          </div>
          {(isCreator || isAdmin) && (
            <Link to="/bestiary/create">
              <Button size="sm" gap="2">
                <Plus className="h-4 w-4" /> Criar Criatura
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BESTIARY_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} to={`/bestiary/${cat.slug}`}>
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
