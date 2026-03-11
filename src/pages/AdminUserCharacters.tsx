import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCharacters } from '@/hooks/useCharacters';
import { CharacterCard } from '@/components/CharacterCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, Plus, Shield, Sword, User } from 'lucide-react';

export default function AdminUserCharacters() {
  const { userId } = useParams();
  const { isAdmin, loading } = useAuth();
  const { data: characters, isLoading } = useCharacters(userId);

  const { data: profile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', userId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const displayName = profile?.display_name || 'Usuário';

  return (
    <div className="min-h-screen">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/admin">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <User className="h-6 w-6 text-primary" />
          <h1 className="font-display text-xl font-bold text-primary gold-glow">
            Fichas de {displayName}
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold">Personagens</h2>
          <Link to={`/admin/user/${userId}/character/new`}>
            <Button size="sm">
              <Plus className="mr-1 h-4 w-4" /> Nova Ficha
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !characters?.length ? (
          <div className="text-center py-20 text-muted-foreground">
            <Sword className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="font-display text-lg">Nenhuma ficha encontrada para este usuário</p>
            <Link to={`/admin/user/${userId}/character/new`}>
              <Button className="mt-4" size="sm">
                <Plus className="mr-1 h-4 w-4" /> Criar primeira ficha
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((char) => (
              <CharacterCard key={char.id} character={char} basePath={`/admin/user/${userId}`} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
