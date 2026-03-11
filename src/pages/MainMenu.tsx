import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, Sword, LogOut, Crown, Loader2, ScrollText, BookOpen, Swords, ShieldCheck, Package, Scroll, Skull, User } from 'lucide-react';

export default function MainMenu() {
  const { user, loading, isAdmin, isMaster, isCreator, signOut, role } = useAuth();

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
      {/* Header */}
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Menu */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div>
            <h2 className="font-display text-3xl font-bold text-primary gold-glow mb-2">Menu Principal</h2>
            <p className="text-muted-foreground">Escolha uma opção para continuar</p>
          </div>

          <div className="space-y-3">
            <Link to="/dashboard" className="block">
              <Button className="w-full h-14 text-lg gap-3" size="lg">
                <ScrollText className="h-5 w-5" />
                Minhas Fichas
              </Button>
            </Link>

            <Link to="/skills" className="block">
              <Button className="w-full h-14 text-lg gap-3" size="lg" variant="secondary">
                <BookOpen className="h-5 w-5" />
                Lista de Habilidades
              </Button>
            </Link>

            <Link to="/weapons" className="block">
              <Button className="w-full h-14 text-lg gap-3" size="lg" variant="secondary">
                <Swords className="h-5 w-5" />
                Lista de Armas
              </Button>
            </Link>

            <Link to="/armors" className="block">
              <Button className="w-full h-14 text-lg gap-3" size="lg" variant="secondary">
                <ShieldCheck className="h-5 w-5" />
                Lista de Armaduras
              </Button>
            </Link>

            <Link to="/items" className="block">
              <Button className="w-full h-14 text-lg gap-3" size="lg" variant="secondary">
                <Package className="h-5 w-5" />
                Itens e Mantimentos
              </Button>
            </Link>

            <Link to="/campaigns" className="block">
              <Button className="w-full h-14 text-lg gap-3" size="lg" variant="secondary">
                <Scroll className="h-5 w-5" />
                Campanhas
              </Button>
            </Link>

            {(isCreator || isAdmin) && (
              <Link to="/bestiary" className="block">
                <Button className="w-full h-14 text-lg gap-3" size="lg" variant="secondary">
                  <Skull className="h-5 w-5" />
                  Bestiário
                </Button>
              </Link>
            )}

            <Link to="/profile" className="block">
              <Button className="w-full h-14 text-lg gap-3" size="lg" variant="secondary">
                <User className="h-5 w-5" />
                Meu Perfil
              </Button>
            </Link>

            {isAdmin && (
              <Link to="/admin" className="block">
                <Button variant="outline" className="w-full h-14 text-lg gap-3 border-primary/30 text-primary hover:bg-primary/10" size="lg">
                  <Shield className="h-5 w-5" />
                  Painel ADM
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
