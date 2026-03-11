import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Plus } from 'lucide-react';
import { SKILL_CATEGORIES } from './SkillsListPage';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const ELEMENTAL_SLUGS = [
  'fumaca', 'fogo', 'agua', 'gelo', 'eletricidade', 'terra', 'luz', 'natureza',
  'magma', 'crystal', 'metal', 'veneno', 'psycho', 'sombrio', 'arcano', 'plasma',
  'sangue', 'tempo', 'morte', 'vazio',
];
const JUTSU_SLUGS = ['ninjutsu', 'taijutsu', 'genjutsu'];
const CURSED_SLUGS = ['tecnicas-amaldicoadas', 'tecnicas-inatas'];
const INDIV_SLUGS = ['individualidades', 'individualidades-demoniacas'];

function getCreateRoute(slug: string) {
  if (ELEMENTAL_SLUGS.includes(slug)) return `/skills/${slug}/create-skill`;
  if (JUTSU_SLUGS.includes(slug)) return `/skills/${slug}/create-jutsu`;
  if (CURSED_SLUGS.includes(slug)) return `/skills/${slug}/create-technique`;
  if (INDIV_SLUGS.includes(slug)) return `/skills/${slug}/create-individuality`;
  if (slug === 'respiracao') return `/skills/respiracao/create-breathing`;
  return null;
}

function getCreateLabel(slug: string) {
  if (ELEMENTAL_SLUGS.includes(slug)) return 'Criar Habilidade';
  if (JUTSU_SLUGS.includes(slug)) return 'Criar Jutsu';
  if (CURSED_SLUGS.includes(slug)) return 'Criar Técnica';
  if (INDIV_SLUGS.includes(slug)) return 'Criar Individualidade';
  if (slug === 'respiracao') return 'Criar Respiração';
  return null;
}

export default function SkillCategoryPage() {
  const { user, loading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const category = SKILL_CATEGORIES.find((c) => c.slug === slug);
  const createRoute = getCreateRoute(slug || '');
  const createLabel = getCreateLabel(slug || '');

  // Fetch items based on category type
  const { data: items = [] } = useQuery({
    queryKey: ['skill-items', slug],
    queryFn: async () => {
      if (!slug) return [];
      if (ELEMENTAL_SLUGS.includes(slug)) {
        const { data } = await supabase.from('skills').select('*').eq('category', slug).order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({ id: d.id, name: d.name, lvl: d.lvl, createdBy: d.created_by_name }));
      }
      if (JUTSU_SLUGS.includes(slug)) {
        const { data } = await supabase.from('jutsus').select('*').eq('category', slug).order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({ id: d.id, name: d.name, lvl: d.lvl, type: d.type, createdBy: d.created_by_name }));
      }
      if (CURSED_SLUGS.includes(slug)) {
        const { data } = await supabase.from('cursed_techniques').select('*').eq('category', slug).order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({ id: d.id, name: d.name, lvl: d.lvl, type: d.type, createdBy: d.created_by_name }));
      }
      if (INDIV_SLUGS.includes(slug)) {
        const { data } = await supabase.from('individualities').select('*').eq('category', slug).order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({ id: d.id, name: d.name, type: d.type, createdBy: d.created_by_name }));
      }
      if (slug === 'respiracao') {
        const { data } = await supabase.from('breathings').select('*').order('created_at', { ascending: false });
        return (data || []).map((d: any) => ({ id: d.id, name: d.name, lvl: d.lvl, createdBy: d.created_by_name }));
      }
      return [];
    },
    enabled: !!user,
  });

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/skills"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">{category?.label || 'Habilidades'}</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {createRoute && (
            <Link to={createRoute}>
              <Button className="w-full mb-4 gap-2"><Plus className="h-4 w-4" /> {createLabel}</Button>
            </Link>
          )}

          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Nenhum item cadastrado ainda.</p>
              <p className="text-sm mt-2">Use o botão acima para criar.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((item: any) => (
                <div key={item.id} className="border border-primary/20 rounded-lg p-3 bg-card/50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground">{item.name}</span>
                    {item.lvl && <span className="text-xs text-muted-foreground">LvL {item.lvl}</span>}
                  </div>
                  {item.type && <span className="text-xs text-primary">{item.type}</span>}
                  <p className="text-xs text-muted-foreground mt-1">Criado por: {item.createdBy}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
