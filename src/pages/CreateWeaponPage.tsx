import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import EquipmentFields, { emptyEquipment } from '@/components/EquipmentFields';

const WEAPON_CATEGORIES: Record<string, string> = {
  comuns: 'Armas Comuns',
  raras: 'Armas Raras',
  epicas: 'Armas Épicas',
  lendarias: 'Armas Lendárias',
  miticas: 'Armas Míticas',
  reliquias: 'Armas Relíquias',
};

export default function CreateWeaponPage() {
  const { user, loading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState(emptyEquipment());

  const categoryName = WEAPON_CATEGORIES[slug || ''] || 'Categoria';

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSave = async () => {
    if (!data.name.trim()) {
      toast({ title: 'Erro', description: 'Nome é obrigatório', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const profile = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
      const { error } = await supabase.from('weapons').insert({
        category: slug!,
        name: data.name,
        type: data.type,
        rarity: data.rarity,
        damage: data.damage,
        weight: data.weight,
        special_effect: data.special_effect,
        description: data.description,
        created_by: user.id,
        created_by_name: profile.data?.display_name || user.email || 'Anônimo',
      });
      if (error) throw error;
      toast({ title: 'Arma criada com sucesso!' });
      navigate(`/weapons/${slug}`);
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={`/weapons/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Criar Arma</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          <p className="text-sm text-muted-foreground">{categoryName}</p>
          <EquipmentFields data={data} onChange={setData} nameLabel="Nome da arma" showDamage />
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Salvar Arma
          </Button>
        </div>
      </main>
    </div>
  );
}
