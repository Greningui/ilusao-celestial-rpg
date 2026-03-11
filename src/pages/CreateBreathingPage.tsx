import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import TechniqueFields, { emptyTechnique, TechniqueData } from '@/components/TechniqueFields';

export default function CreateBreathingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [lvl, setLvl] = useState('');
  const [formsCount, setFormsCount] = useState(1);
  const [forms, setForms] = useState<TechniqueData[]>([emptyTechnique()]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const handleFormsCountChange = (val: string) => {
    const n = parseInt(val);
    setFormsCount(n);
    const newForms = [...forms];
    while (newForms.length < n) newForms.push(emptyTechnique());
    setForms(newForms.slice(0, n));
  };

  const updateForm = (i: number, t: TechniqueData) => {
    const copy = [...forms]; copy[i] = t; setForms(copy);
  };

  const handleSave = async () => {
    if (!name.trim()) { toast({ title: 'Erro', description: 'Nome é obrigatório', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const profile = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
      const createdByName = profile.data?.display_name || user.email || 'Anônimo';

      const { data: breathing, error } = await supabase.from('breathings').insert({
        name, lvl, forms_count: formsCount,
        created_by: user.id, created_by_name: createdByName,
      }).select('id').single();
      if (error) throw error;

      const formsData = forms.map((f, i) => ({
        breathing_id: breathing.id, form_number: i + 1,
        name: f.name, lvl: f.lvl, damage: f.damage, cost: f.cost,
        duration: f.duration, cooldown: f.cooldown, effect: f.effect,
        effect_damage: f.effect_damage || null, effect_duration: f.effect_duration || null,
        description: f.description,
      }));
      const { error: fErr } = await supabase.from('breathing_forms').insert(formsData);
      if (fErr) throw fErr;

      toast({ title: 'Respiração criada!' });
      navigate('/skills/respiracao');
    } catch (e: any) { toast({ title: 'Erro', description: e.message, variant: 'destructive' }); }
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/skills/respiracao"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Criar Respiração</h1>
        </div>
      </header>
      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Nome da respiração</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="border-primary/20" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">LvL</Label>
              <Input value={lvl} onChange={(e) => setLvl(e.target.value)} className="border-primary/20" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Formas</Label>
              <Select value={String(formsCount)} onValueChange={handleFormsCountChange}>
                <SelectTrigger className="border-primary/20"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 13 }, (_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {forms.map((f, i) => (
            <div key={i} className="border border-primary/10 rounded-lg p-3">
              <h3 className="text-xs text-primary font-semibold mb-2">Forma {i + 1}</h3>
              <TechniqueFields data={f} onChange={(d) => updateForm(i, d)} />
            </div>
          ))}

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />} Salvar Respiração
          </Button>
        </div>
      </main>
    </div>
  );
}
