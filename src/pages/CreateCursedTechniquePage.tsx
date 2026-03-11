import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TechniqueFields, { emptyTechnique } from '@/components/TechniqueFields';

export default function CreateCursedTechniquePage() {
  const { user, loading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState(slug === 'tecnicas-inatas' ? 'inata' : 'amaldiçoada');
  const [data, setData] = useState(emptyTechnique());

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleSave = async () => {
    if (!data.name.trim()) { toast({ title: 'Erro', description: 'Nome é obrigatório', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const profile = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
      const { error } = await supabase.from('cursed_techniques').insert({
        category: slug!, type, name: data.name, lvl: data.lvl, damage: data.damage,
        cost: data.cost, duration: data.duration, cooldown: data.cooldown,
        effect: data.effect, effect_damage: data.effect_damage || null,
        effect_duration: data.effect_duration || null, description: data.description,
        created_by: user.id, created_by_name: profile.data?.display_name || user.email || 'Anônimo',
      });
      if (error) throw error;
      toast({ title: 'Técnica criada!' });
      navigate(`/skills/${slug}`);
    } catch (e: any) { toast({ title: 'Erro', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={`/skills/${slug}`}><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Criar Técnica</h1>
        </div>
      </header>
      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="border-primary/20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="inata">Inata</SelectItem>
                <SelectItem value="amaldiçoada">Amaldiçoada</SelectItem>
                <SelectItem value="expansão">Expansão</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TechniqueFields data={data} onChange={setData} nameLabel="Nome da técnica" />
          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Salvar Técnica
          </Button>
        </div>
      </main>
    </div>
  );
}
