import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const EFFECTS = [
  'nenhum', 'envenenamento', 'queimadura', 'congelamento',
  'paralisia', 'entoxicado', 'sangramento', 'cegueira',
];

const EFFECTS_WITH_DAMAGE = ['envenenamento', 'queimadura', 'congelamento', 'entoxicado', 'sangramento'];
const EFFECTS_WITH_DURATION = ['envenenamento', 'queimadura', 'congelamento', 'paralisia', 'entoxicado', 'sangramento', 'cegueira'];

interface TechniqueData {
  name: string;
  lvl: string;
  damage: string;
  cost: string;
  duration: string;
  cooldown: string;
  effect: string;
  effect_damage: string;
  effect_duration: string;
  description: string;
}

interface TechniqueFieldsProps {
  data: TechniqueData;
  onChange: (data: TechniqueData) => void;
  nameLabel?: string;
  hideDamage?: boolean;
  prefix?: string;
}

export const emptyTechnique = (): TechniqueData => ({
  name: '', lvl: '', damage: '', cost: '', duration: '',
  cooldown: '', effect: 'nenhum', effect_damage: '', effect_duration: '', description: '',
});

export type { TechniqueData };

export default function TechniqueFields({ data, onChange, nameLabel = 'Nome da técnica', hideDamage = false, prefix = '' }: TechniqueFieldsProps) {
  const update = (field: keyof TechniqueData, value: string) => {
    const newData = { ...data, [field]: value };
    if (field === 'effect') {
      if (!EFFECTS_WITH_DAMAGE.includes(value)) newData.effect_damage = '';
      if (!EFFECTS_WITH_DURATION.includes(value)) newData.effect_duration = '';
    }
    onChange(newData);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">{nameLabel}</Label>
        <Input value={data.name} onChange={(e) => update('name', e.target.value)} className="border-primary/20" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">LvL</Label>
          <Input value={data.lvl} onChange={(e) => update('lvl', e.target.value)} className="border-primary/20" />
        </div>
        {!hideDamage && (
          <div>
            <Label className="text-xs text-muted-foreground">Dano</Label>
            <Input value={data.damage} onChange={(e) => update('damage', e.target.value)} className="border-primary/20" />
          </div>
        )}
        <div>
          <Label className="text-xs text-muted-foreground">Custo</Label>
          <Input value={data.cost} onChange={(e) => update('cost', e.target.value)} className="border-primary/20" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Duração</Label>
          <Input value={data.duration} onChange={(e) => update('duration', e.target.value)} className="border-primary/20" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Recarga</Label>
          <Input value={data.cooldown} onChange={(e) => update('cooldown', e.target.value)} className="border-primary/20" />
        </div>
      </div>
      <div>
        <Label className="text-xs text-muted-foreground">Efeitos</Label>
        <Select value={data.effect} onValueChange={(v) => update('effect', v)}>
          <SelectTrigger className="border-primary/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EFFECTS.map((e) => (
              <SelectItem key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {EFFECTS_WITH_DAMAGE.includes(data.effect) && (
        <div>
          <Label className="text-xs text-muted-foreground">Dano do efeito</Label>
          <Input value={data.effect_damage} onChange={(e) => update('effect_damage', e.target.value)} className="border-primary/20" />
        </div>
      )}
      {EFFECTS_WITH_DURATION.includes(data.effect) && (
        <div>
          <Label className="text-xs text-muted-foreground">Duração do efeito</Label>
          <Input value={data.effect_duration} onChange={(e) => update('effect_duration', e.target.value)} className="border-primary/20" />
        </div>
      )}
      <div>
        <Label className="text-xs text-muted-foreground">Descrição</Label>
        <Textarea value={data.description} onChange={(e) => update('description', e.target.value)} className="border-primary/20 min-h-[80px]" />
      </div>
    </div>
  );
}
