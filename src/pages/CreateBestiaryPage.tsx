import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCreateBestiaryCreature } from '@/hooks/useBestiary';

const BESTIARY_CATEGORIES: Record<string, string> = {
  comuns: 'Criaturas Comuns',
  raras: 'Criaturas Raras',
  epicas: 'Criaturas Épicas',
  lendarias: 'Criaturas Lendárias',
  miticas: 'Criaturas Míticas',
  reliquias: 'Criaturas Relíquias',
};

const RARITIES = ['Comum', 'Raro', 'Épico', 'Lendário', 'Mítico', 'Relíquia'];

export default function CreateBestiaryPage() {
  const { user, loading, isCreator, isAdmin } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createCreature = useCreateBestiaryCreature();

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    rarity: 'Comum',
    hp: '',
    defense: '',
    attack: '',
    special_ability: '',
    description: '',
  });

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || (!isCreator && !isAdmin)) return <Navigate to="/bestiary" replace />;

  const categoryName = BESTIARY_CATEGORIES[slug || ''] || 'Categoria';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: 'Erro', description: 'Nome da criatura é obrigatório', variant: 'destructive' });
      return;
    }

    try {
      const profile = await supabase.from('profiles').select('display_name').eq('user_id', user.id).single();
      await createCreature.mutateAsync({
        category: slug!,
        name: formData.name,
        type: formData.type,
        rarity: formData.rarity,
        hp: formData.hp,
        defense: formData.defense,
        attack: formData.attack,
        special_ability: formData.special_ability,
        description: formData.description,
        created_by: user.id,
        created_by_name: profile.data?.display_name || user.email || 'Criador',
      });
      toast({ title: 'Criatura criada com sucesso!' });
      navigate(`/bestiary/${slug}`);
    } catch (e: any) {
      toast({ title: 'Erro', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={`/bestiary/${slug}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Criar Criatura</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-lg mx-auto">
          <p className="text-sm text-muted-foreground mb-4">{categoryName}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Nome da Criatura</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-primary/20"
                placeholder="Ex: Dragão Antigo"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Tipo</Label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="border-primary/20"
                  placeholder="Ex: Dragão"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Raridade</Label>
                <Select value={formData.rarity} onValueChange={(v) => setFormData({ ...formData, rarity: v })}>
                  <SelectTrigger className="border-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RARITIES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">HP</Label>
                <Input
                  value={formData.hp}
                  onChange={(e) => setFormData({ ...formData, hp: e.target.value })}
                  className="border-primary/20"
                  placeholder="Ex: 100"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Defesa</Label>
                <Input
                  value={formData.defense}
                  onChange={(e) => setFormData({ ...formData, defense: e.target.value })}
                  className="border-primary/20"
                  placeholder="Ex: 15"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Ataque</Label>
                <Input
                  value={formData.attack}
                  onChange={(e) => setFormData({ ...formData, attack: e.target.value })}
                  className="border-primary/20"
                  placeholder="Ex: 20"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Habilidade Especial</Label>
              <Input
                value={formData.special_ability}
                onChange={(e) => setFormData({ ...formData, special_ability: e.target.value })}
                className="border-primary/20"
                placeholder="Ex: Bafo de fogo"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="border-primary/20 min-h-[100px]"
                placeholder="Descreva a criatura..."
              />
            </div>

            <Button type="submit" disabled={createCreature.isPending} className="w-full">
              {createCreature.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Salvar Criatura
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
