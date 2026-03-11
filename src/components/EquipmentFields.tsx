import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RARITIES = ['Comum', 'Raro', 'Épico', 'Lendário', 'Mítico', 'Relíquia'];

interface EquipmentData {
  name: string;
  type: string;
  rarity: string;
  damage?: string;
  defense?: string;
  weight: string;
  special_effect: string;
  description: string;
}

interface EquipmentFieldsProps {
  data: EquipmentData;
  onChange: (data: EquipmentData) => void;
  nameLabel?: string;
  showDamage?: boolean;
  showDefense?: boolean;
  showQuantity?: boolean;
}

export const emptyEquipment = (): EquipmentData => ({
  name: '',
  type: '',
  rarity: 'Comum',
  weight: '',
  special_effect: '',
  description: '',
});

export type { EquipmentData };

export default function EquipmentFields({
  data,
  onChange,
  nameLabel = 'Nome do item',
  showDamage = false,
  showDefense = false,
}: EquipmentFieldsProps) {
  const update = (field: keyof EquipmentData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-xs text-muted-foreground">{nameLabel}</Label>
        <Input value={data.name} onChange={(e) => update('name', e.target.value)} className="border-primary/20" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs text-muted-foreground">Tipo</Label>
          <Input value={data.type} onChange={(e) => update('type', e.target.value)} className="border-primary/20" />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Raridade</Label>
          <Select value={data.rarity} onValueChange={(v) => update('rarity', v)}>
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

      <div className="grid grid-cols-2 gap-3">
        {showDamage && (
          <div>
            <Label className="text-xs text-muted-foreground">Dano</Label>
            <Input
              value={data.damage || ''}
              onChange={(e) => update('damage', e.target.value)}
              className="border-primary/20"
            />
          </div>
        )}
        {showDefense && (
          <div>
            <Label className="text-xs text-muted-foreground">Defesa</Label>
            <Input
              value={data.defense || ''}
              onChange={(e) => update('defense', e.target.value)}
              className="border-primary/20"
            />
          </div>
        )}
        <div>
          <Label className="text-xs text-muted-foreground">Peso</Label>
          <Input value={data.weight} onChange={(e) => update('weight', e.target.value)} className="border-primary/20" />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Efeito Especial</Label>
        <Input
          value={data.special_effect}
          onChange={(e) => update('special_effect', e.target.value)}
          className="border-primary/20"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Descrição</Label>
        <Textarea
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          className="border-primary/20 min-h-[80px]"
        />
      </div>
    </div>
  );
}
