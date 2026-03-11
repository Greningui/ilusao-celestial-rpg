import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TechniqueFields, { emptyTechnique, TechniqueData } from '@/components/TechniqueFields';

export default function CreateJutsuPage() {
  const { user, loading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState(slug === 'taijutsu' ? 'Taijutsu' : slug === 'genjutsu' ? 'Genjutsu' : 'Ninjutsu');
  const [data, setData] = useState(emptyTechnique());
  const [techniques, setTechniques] = useState<TechniqueData[]>([]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const addTechnique = () => {
    if (techniques.length < 5) setTechniques([...techniques, emptyTechnique()]);
  };

  const updateTechnique = (i: number, t: TechniqueData) => {
    const copy = [...techniques]; copy[i] = t; setTechniques(copy);
  };

  const removeTechnique = (i: number) => setTechniques(techniques.filter((_, idx) => idx !== i));

  const handleSave = async () => {
    if (!data.name.trim()) { toast({ title: 'Erro', description: 'Nome é obrigatório', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const profile = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
      const createdByName = profile.data?.display_name || user.email || 'Anônimo';

      const { data: jutsu, error } = await supabase.from('jutsus').insert({
        category: slug!, type, name: data.name, lvl: data.lvl,
        damage: type === 'Genjutsu' ? null : data.damage,
        cost: data.cost, duration: data.duration, cooldown: data.cooldown,
        effect: data.effect, effect_damage: data.effect_damage || null,
        effect_duration: data.effect_duration || null, description: data.description,
        created_by: user.id, created_by_name: createdByName,
      }).select('id').single();
      if (error) throw error;

      if (type === 'Taijutsu' && techniques.length > 0) {
        const techs = techniques.map((t) => ({
          jutsu_id: jutsu.id, name: t.name, lvl: t.lvl, damage: t.damage,
          cost: t.cost, duration: t.duration, cooldown: t.cooldown,
          effect: t.effect, effect_damage: t.effect_damage || null,
          effect_duration: t.effect_duration || null, description: t.description,
        }));
        const { error: tErr } = await supabase.from('jutsu_techniques').insert(techs);
        if (tErr) throw tErr;
      }

      toast({ title: 'Jutsu criado!' });
      navigate(`/skills/${slug}`);
    } catch (e: any) { toast({ title: 'Erro', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={`/skills/${slug}`}><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Criar Jutsu</h1>
        </div>
      </header>
      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Tipo</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="border-primary/20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Ninjutsu">Ninjutsu</SelectItem>
                <SelectItem value="Taijutsu">Taijutsu</SelectItem>
                <SelectItem value="Genjutsu">Genjutsu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'Taijutsu' ? (
            <>
              <TechniqueFields data={data} onChange={setData} nameLabel="Nome do jutsu" hideDamage />
              <div className="border-t border-primary/20 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-primary">Técnicas ({techniques.length}/5)</h3>
                  {techniques.length < 5 && (
                    <Button variant="outline" size="sm" onClick={addTechnique}><Plus className="h-4 w-4 mr-1" /> Add Técnica</Button>
                  )}
                </div>
                {techniques.map((t, i) => (
                  <div key={i} className="border border-primary/10 rounded-lg p-3 mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground font-semibold">Técnica {i + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeTechnique(i)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <TechniqueFields data={t} onChange={(d) => updateTechnique(i, d)} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <TechniqueFields data={data} onChange={setData} nameLabel="Nome do jutsu" hideDamage={type === 'Genjutsu'} />
          )}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Salvar Jutsu
          </Button>
        </div>
      </main>
    </div>
  );
}
