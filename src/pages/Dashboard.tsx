import { useAuth } from '@/hooks/useAuth';
import { useCharacters } from '@/hooks/useCharacters';
import { CharacterCard } from '@/components/CharacterCard';
import { Button } from '@/components/ui/button';
import { Link, Navigate } from 'react-router-dom';
import { Plus, LogOut, Shield, Sword, Loader2, Crown, ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const { user, loading, isAdmin, signOut, role } = useAuth();
  const { data: characters, isLoading } = useCharacters(user?.id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/menu">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="font-display text-xl font-bold text-primary gold-glow">Ilusão Celestial</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isAdmin ? (
                <Crown className="h-4 w-4 text-primary" />
              ) : (
                <Sword className="h-4 w-4" />
              )}
            <span className="hidden sm:inline">{isAdmin ? 'ADM' : 'Player'}</span>
            </div>
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                  <Shield className="mr-1 h-4 w-4" /> Painel ADM
                </Button>
              </Link>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">Fichas de Personagem</h2>
          {isAdmin && (
            <Link to="/character/new">
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" /> Nova Ficha
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !characters?.length ? (
          <div className="text-center py-20 text-muted-foreground">
            <Sword className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-display text-lg">Nenhuma ficha encontrada</p>
            {isAdmin && (
              <Link to="/character/new">
                <Button className="mt-4" size="sm">
                  <Plus className="mr-1 h-4 w-4" /> Criar primeira ficha
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
