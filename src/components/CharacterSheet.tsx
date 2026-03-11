import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatBar } from '@/components/StatBar';
import { useAuth } from '@/hooks/useAuth';
import { useCreateCharacter, useUpdateCharacter, useDeleteCharacter } from '@/hooks/useCharacters';
import type { Character } from '@/hooks/useCharacters';
import { useToast } from '@/hooks/use-toast';
import { Save, Trash2, ArrowLeft, Loader2 } from 'lucide-react';

interface FieldProps {
  label: string;
  field: string;
  type?: string;
  value: string | number;
  canEdit: boolean;
  onChange: (field: string, value: string | number) => void;
}

function Field({ label, field, type = 'text', value, canEdit, onChange }: FieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {canEdit ? (
        <Input
          type={type}
          value={value}
          onChange={(e) => {
            if (type === 'number') {
              onChange(field, e.target.value === '' ? 0 : parseInt(e.target.value) || 0);
            } else {
              onChange(field, e.target.value);
            }
          }}
          className="h-8 text-sm"
        />
      ) : (
        <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
          {value || '—'}
        </p>
      )}
    </div>
  );
}

const RACAS = [
  'Humano', 'Fada', 'Homem-peixe', 'Demi-humano', 'Elfo', 'Goblin', 'Gigante',
  'Anão', 'Mimic', 'Zombie', 'Esqueleto', 'Vampiro', 'Orc', 'Namekuzeijin',
  'Lunargon', 'Demônio de gelo', 'Demônio', 'Dryad', 'Majin', 'Slime',
  'Maldição', 'ONI', 'Celestial', 'Quincy', 'Dracônico', 'Anjo', 'Shinigami',
  'Otsuksuki', 'Sayajin', 'Nefelin', 'Elemental', 'Anjo especial', 'Kitsune',
];

const CORES_SLIME = [
  'Azul', 'Verde', 'Rosa', 'Roxo', 'Verde Semi-transparente', 'Cinza',
];

const ELEMENTOS_ELEMENTAL = [
  'Fumaça', 'Fogo', 'Água', 'Gelo', 'Eletricidade', 'Terra', 'Luz', 'Natureza',
  'Magma', 'Crystal', 'Metal', 'Veneno', 'Psycho', 'Sombrio', 'Arcano', 'Plasma', 'Sangue',
];

const ELEMENTOS_INFO = [
  'Fumaça', 'Fogo', 'Água', 'Gelo', 'Eletricidade', 'Terra', 'Luz', 'Natureza',
  'Magma', 'Crystal', 'Metal', 'Veneno', 'Psycho', 'Arcano', 'Plasma', 'Sangue',
  'Tempo', 'Morte', 'Vazio',
];

const CLAS = [
  'Nenhum', 'Akimichi', 'Nara', 'Sarutobi', 'Hatake', 'Hyūga', 'Uzumaki',
  'Uchira', 'Senju', 'Gojo', 'Zenin', 'Kamo', 'Inumaki',
];

const CASAS_LINHAGEM_VAMPIRO = [
  'Banu Haquim', 'Brujah', 'Grangrel', 'Malkaviano', 'Ministério',
  'Ravino', 'Salubri', 'Tereador', 'Ventrue', 'Nosferatu',
];

const RACAS_SECUNDARIAS = [
  'Fada', 'Elfo', 'Goblin', 'Gigante', 'Anão', 'Mimic', 'Orc',
  'Namekuzeijin', 'Demônio de gelo', 'Demônio', 'Majin', 'Celestial',
  'Quincy', 'Anjo', 'Shinigami', 'Otsuksuki', 'Sayajin', 'Elemental', 'Kitsune',
];

const ANIMAIS_AQUATICOS = [
  'Tubarão-branco', 'Tubarão-baleia', 'Tubarão-martelo', 'Tubarão-tigre', 'Tubarão-frade',
  'Raia-manta', 'Raia-morcego', 'Peixe-guitarra', 'Peixe-palhaço', 'Peixe-papagaio',
  'Baiacu', 'Cavalo-marinho', 'Garoupa', 'Dourado', 'Barracuda', 'Peixe-cirurgião',
  'Crocodilo-de-água-salgada', 'Atum', 'Espadarte', 'Polvo', 'Lula', 'Choco',
  'Caranguejo', 'Lagosta', 'Camarão', 'Estrela-do-mar', 'Tartaruga-de-pente',
  'Tartaruga-cabeçuda', 'Baleia-azul', 'Baleia Jubarte', 'Baleia Comum', 'Orca',
  'Golfinho', 'Narval', 'Beluga', 'Toninha', 'Foca', 'Leão-marinho', 'Lobo-marinho',
  'Elefante-marinho', 'Morsa', 'Peixe-boi', 'Dugongo', 'Lontra-marinha', 'Lontra-felina',
];

const ANIMAIS_TERRESTRES = [
  'Leão/Leoa', 'Tigre-indochina', 'Tigre-de-cáspio', 'Tigre-bengala', 'Pantera-negra',
  'Onça-pintada', 'Guepardo', 'Puma', 'Leopardo-das-neves', 'Gato-doméstico', 'Jaguar',
  'Lobo-Cinzento', 'Lobo-do-ártico', 'Lobo-da-colúmbia', 'Border-collie', 'Chihuahua',
  'Buldoge-inglês', 'Dálmata', 'Pinscher-miniatura', 'Shih-tzu', 'Pug', 'Shiba',
  'Husky-siberiano', 'Doberman', 'Pastor-alemão', 'Rottweiler', 'Malamute-do-alasca',
  'São-Bernardo', 'Cavalo', 'Cabra', 'Bode', 'Ovelha', 'Touro', 'Vaca',
  'Urso-polar', 'Urso-pardo', 'Urso-negro-americano', 'Coelho', 'Preguiça', 'Coala',
  'Girafa', 'Elefante-africano-da-savana', 'Elefante-africano-da-floresta', 'Gazela',
  'Veado', 'Alce', 'Galinha/Galo', 'Hipopótamo', 'Rinoceronte', 'Periquito-australiano',
  'Cegonha-bico-de-sapo', 'Airio crestado', 'Tucano', 'Arara', 'Águia Harpia',
  'Gavião', 'Falcão-peregrino', 'Gorila', 'Macaco', 'Garça', 'Pinguim', 'Pato',
];

const RACAS_ANTERIORES = [
  'Humano', 'Fada', 'Homem-peixe', 'Demi-humano', 'Elfo', 'Goblin', 'Gigante',
  'Anão', 'Orc', 'Quincy', 'Dracônico', 'Otsuksuki', 'Sayajin',
];

interface RaceFieldProps {
  value: string;
  secondaryValue: string;
  animalValue: string;
  corValue: string;
  elementoValue: string;
  casaLinhagemValue: string;
  canEdit: boolean;
  onChange: (field: string, value: string | number) => void;
}

function RaceField({ value, secondaryValue, animalValue, corValue, elementoValue, casaLinhagemValue, canEdit, onChange }: RaceFieldProps) {
  const handleRaceChange = (v: string) => {
    onChange('raca', v);
    if (v !== 'Humano' && v !== 'Zombie' && v !== 'Esqueleto') {
      onChange('raca_secundaria', '');
    }
    if (v !== 'Homem-peixe' && v !== 'Demi-humano') {
      onChange('animal', '');
    }
    if (v !== 'Slime') {
      onChange('cor', '');
    }
    if (v !== 'Elemental') {
      onChange('elemento', '');
    }
    if (v !== 'Vampiro') {
      onChange('casa_linhagem', '');
    }
  };

  const handleRacaAnteriorChange = (v: string) => {
    onChange('raca_secundaria', v);
    if (v !== 'Homem-peixe' && v !== 'Demi-humano') {
      onChange('animal', '');
    }
  };

  const isZombieOrEsqueleto = value === 'Zombie' || value === 'Esqueleto';
  const showAnimal = value === 'Homem-peixe' || value === 'Demi-humano' ||
    (isZombieOrEsqueleto && (secondaryValue === 'Homem-peixe' || secondaryValue === 'Demi-humano'));
  const showSecundariaFromAnterior = isZombieOrEsqueleto && secondaryValue === 'Humano';
  const showCor = value === 'Slime';
  const showElemento = value === 'Elemental';
  const showCasaLinhagem = value === 'Vampiro';
  const animalList = (value === 'Homem-peixe' || secondaryValue === 'Homem-peixe')
    ? ANIMAIS_AQUATICOS : ANIMAIS_TERRESTRES;

  return (
    <>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Raça</Label>
        {canEdit ? (
          <Select value={value} onValueChange={handleRaceChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Selecione a raça" />
            </SelectTrigger>
            <SelectContent>
              {RACAS.map((raca) => (
                <SelectItem key={raca} value={raca}>{raca}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
            {value || '—'}
          </p>
        )}
      </div>
      {value === 'Humano' && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Raça Secundária</Label>
          {canEdit ? (
            <Select value={secondaryValue} onValueChange={(v) => onChange('raca_secundaria', v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecione a raça secundária" />
              </SelectTrigger>
              <SelectContent>
                {RACAS_SECUNDARIAS.map((raca) => (
                  <SelectItem key={raca} value={raca}>{raca}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
              {secondaryValue || '—'}
            </p>
          )}
        </div>
      )}
      {isZombieOrEsqueleto && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Raça Anterior</Label>
          {canEdit ? (
            <Select value={secondaryValue} onValueChange={handleRacaAnteriorChange}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecione a raça anterior" />
              </SelectTrigger>
              <SelectContent>
                {RACAS_ANTERIORES.map((raca) => (
                  <SelectItem key={raca} value={raca}>{raca}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
              {secondaryValue || '—'}
            </p>
          )}
        </div>
      )}
      {showSecundariaFromAnterior && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Raça Secundária</Label>
          {canEdit ? (
            <Select value={animalValue} onValueChange={(v) => onChange('animal', v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecione a raça secundária" />
              </SelectTrigger>
              <SelectContent>
                {RACAS_SECUNDARIAS.map((raca) => (
                  <SelectItem key={raca} value={raca}>{raca}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
              {animalValue || '—'}
            </p>
          )}
        </div>
      )}
      {showAnimal && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Animal</Label>
          {canEdit ? (
            <Select value={animalValue} onValueChange={(v) => onChange('animal', v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecione o animal" />
              </SelectTrigger>
              <SelectContent>
                {animalList.map((animal) => (
                  <SelectItem key={animal} value={animal}>{animal}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
              {animalValue || '—'}
            </p>
          )}
        </div>
      )}
      {showCor && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Cor</Label>
          {canEdit ? (
            <Select value={corValue} onValueChange={(v) => onChange('cor', v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecione a cor" />
              </SelectTrigger>
              <SelectContent>
                {CORES_SLIME.map((cor) => (
                  <SelectItem key={cor} value={cor}>{cor}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
              {corValue || '—'}
            </p>
          )}
        </div>
      )}
      {showElemento && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Elemento</Label>
          {canEdit ? (
            <Select value={elementoValue} onValueChange={(v) => onChange('elemento', v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecione o elemento" />
              </SelectTrigger>
              <SelectContent>
                {ELEMENTOS_ELEMENTAL.map((el) => (
                  <SelectItem key={el} value={el}>{el}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
              {elementoValue || '—'}
            </p>
          )}
        </div>
      )}
      {showCasaLinhagem && (
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Casa de Linhagem</Label>
          {canEdit ? (
            <Select value={casaLinhagemValue} onValueChange={(v) => onChange('casa_linhagem', v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Selecione a casa de linhagem" />
              </SelectTrigger>
              <SelectContent>
                {CASAS_LINHAGEM_VAMPIRO.map((casa) => (
                  <SelectItem key={casa} value={casa}>{casa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
              {casaLinhagemValue || '—'}
            </p>
          )}
        </div>
      )}
    </>
  );
}


interface TextAreaFieldProps {
  label: string;
  field: string;
  value: string;
  canEdit: boolean;
  onChange: (field: string, value: string) => void;
}

function TextAreaField({ label, field, value, canEdit, onChange }: TextAreaFieldProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {canEdit ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="text-sm min-h-[60px]"
        />
      ) : (
        <p className="text-sm py-2 px-2 bg-secondary rounded min-h-[60px] whitespace-pre-wrap">
          {value || '—'}
        </p>
      )}
    </div>
  );
}

interface CharacterSheetProps {
  character?: Character | null;
  isNew?: boolean;
  targetOwnerId?: string;
  backPath?: string;
}

export function CharacterSheet({ character, isNew, targetOwnerId, backPath }: CharacterSheetProps) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const createMutation = useCreateCharacter();
  const updateMutation = useUpdateCharacter();
  const deleteMutation = useDeleteCharacter();
  const canEdit = isAdmin;

  const [form, setForm] = useState({
    nome: '', raca: '', raca_secundaria: '', animal: '', cla: '', atributos_bonus: '',
    hp_atual: 100, hp_max: 100, hp_pt: 0,
    rf: 5, rf_pt: 0, rm: 5, rm_pt: 0,
    pf: 5, pf_pt: 0, pm: 5, pm_pt: 0,
    vel: 5, vel_pt: 0, int_stat: 5, int_pt: 0,
    mana_atual: 100, mana_max: 100, mana_pt: 0,
    lvl: 1, pt_disponivel: 6,
    caldas: '', vinculos: '', contatos: '', contagem_sangue_atual: 0, contagem_sangue_max: 0,
    elemento: '', classe: '', especialidade: '', rank: '', casa_linhagem: '',
    poderes: '', armas: '', armaduras: '', mantimentos: '', outros: '',
  });

  useEffect(() => {
    if (character) {
      setForm({
        nome: character.nome || '',
        raca: character.raca || '',
        raca_secundaria: (character as any).raca_secundaria || '',
        animal: (character as any).animal || '',
        cla: character.cla || '',
        atributos_bonus: character.atributos_bonus || '',
        hp_atual: character.hp_atual ?? 100,
        hp_max: character.hp_max ?? 100,
        hp_pt: character.hp_pt ?? 0,
        rf: character.rf ?? 5, rf_pt: character.rf_pt ?? 0,
        rm: character.rm ?? 5, rm_pt: character.rm_pt ?? 0,
        pf: character.pf ?? 5, pf_pt: character.pf_pt ?? 0,
        pm: character.pm ?? 5, pm_pt: character.pm_pt ?? 0,
        vel: character.vel ?? 5, vel_pt: character.vel_pt ?? 0,
        int_stat: character.int_stat ?? 5, int_pt: character.int_pt ?? 0,
        mana_atual: character.mana_atual ?? 100,
        mana_max: character.mana_max ?? 100,
        mana_pt: character.mana_pt ?? 0,
        lvl: character.lvl ?? 1,
        pt_disponivel: character.pt_disponivel ?? 6,
        caldas: character.caldas || '',
        vinculos: character.vinculos || '',
        contatos: character.contatos || '',
        contagem_sangue_atual: (character as any).contagem_sangue_atual ?? 0,
        contagem_sangue_max: (character as any).contagem_sangue_max ?? 0,
        elemento: character.elemento || '',
        classe: character.classe || '',
        especialidade: character.especialidade || '',
        rank: character.rank || '',
        casa_linhagem: (character as any).casa_linhagem || '',
        poderes: character.poderes || '',
        armas: character.armas || '',
        armaduras: character.armaduras || '',
        mantimentos: character.mantimentos || '',
        outros: character.outros || '',
      });
    }
  }, [character]);

  const handleFieldChange = useCallback((key: string, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = async () => {
    if (!form.nome.trim()) {
      toast({ title: 'Erro', description: 'Nome do personagem é obrigatório', variant: 'destructive' });
      return;
    }

    try {
      if (isNew) {
        await createMutation.mutateAsync({ ...form, owner_id: targetOwnerId || user!.id });
        toast({ title: 'Personagem criado!' });
        navigate(backPath || '/dashboard');
      } else if (character) {
        await updateMutation.mutateAsync({ id: character.id, ...form });
        toast({ title: 'Ficha atualizada!' });
      }
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!character) return;
    if (!confirm('Tem certeza que deseja excluir esta ficha?')) return;
    try {
      await deleteMutation.mutateAsync(character.id);
      toast({ title: 'Ficha excluída' });
      navigate(backPath || '/dashboard');
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;

  const f = (field: string) => (form as any)[field];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(backPath || '/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        {canEdit && (
          <div className="flex gap-2">
            {!isNew && (
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleteMutation.isPending}>
                <Trash2 className="mr-1 h-4 w-4" /> Excluir
              </Button>
            )}
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />}
              {isNew ? 'Criar' : 'Salvar'}
            </Button>
          </div>
        )}
      </div>

      {/* Character Name & Info */}
      <Card className="card-glow border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-2xl text-primary gold-glow">
            {isNew ? 'Nova Ficha' : form.nome || 'Sem Nome'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Nome" field="nome" value={f('nome')} canEdit={canEdit} onChange={handleFieldChange} />
            <RaceField value={f('raca') as string} secondaryValue={f('raca_secundaria') as string} animalValue={f('animal') as string} corValue={f('cor') as string} elementoValue={f('elemento') as string} casaLinhagemValue={f('casa_linhagem') as string} canEdit={canEdit} onChange={handleFieldChange} />
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Clã</Label>
              {canEdit ? (
                <Select value={f('cla') as string} onValueChange={(v) => handleFieldChange('cla', v)}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Selecione o clã" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLAS.map((cla) => (
                      <SelectItem key={cla} value={cla}>{cla}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
                  {f('cla') || '—'}
                </p>
              )}
            </div>
            <Field label="Atributos Bônus" field="atributos_bonus" value={f('atributos_bonus')} canEdit={canEdit} onChange={handleFieldChange} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="poderes">Poderes</TabsTrigger>
          <TabsTrigger value="inventario">Inventário</TabsTrigger>
        </TabsList>

        {/* STATUS TAB */}
        <TabsContent value="status">
          <Card className="card-glow border-primary/20">
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Field label="LVL" field="lvl" type="number" value={f('lvl')} canEdit={canEdit} onChange={handleFieldChange} />
                <Field label="PT Disponível" field="pt_disponivel" type="number" value={f('pt_disponivel')} canEdit={canEdit} onChange={handleFieldChange} />
                <Field label="Classe" field="classe" value={f('classe')} canEdit={canEdit} onChange={handleFieldChange} />
                <Field label="Rank" field="rank" value={f('rank')} canEdit={canEdit} onChange={handleFieldChange} />
              </div>

              <div className="space-y-4">
                {canEdit ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 items-end">
                      <Field label="HP Atual" field="hp_atual" type="number" value={f('hp_atual')} canEdit={canEdit} onChange={handleFieldChange} />
                      <Field label="HP Máx" field="hp_max" type="number" value={f('hp_max')} canEdit={canEdit} onChange={handleFieldChange} />
                      <Field label="HP PT" field="hp_pt" type="number" value={f('hp_pt')} canEdit={canEdit} onChange={handleFieldChange} />
                    </div>
                    <div className="grid grid-cols-3 gap-2 items-end">
                      <Field label="MANA Atual" field="mana_atual" type="number" value={f('mana_atual')} canEdit={canEdit} onChange={handleFieldChange} />
                      <Field label="MANA Máx" field="mana_max" type="number" value={f('mana_max')} canEdit={canEdit} onChange={handleFieldChange} />
                      <Field label="MANA PT" field="mana_pt" type="number" value={f('mana_pt')} canEdit={canEdit} onChange={handleFieldChange} />
                    </div>
                    {[
                      { label: 'RF', field: 'rf' },
                      { label: 'RM', field: 'rm' },
                      { label: 'PF', field: 'pf' },
                      { label: 'PM', field: 'pm' },
                      { label: 'VEL', field: 'vel' },
                      { label: 'INT', field: 'int_stat' },
                    ].map(({ label, field }) => (
                      <div key={field} className="grid grid-cols-2 gap-2 items-end">
                        <Field label={label} field={field} type="number" value={f(field)} canEdit={canEdit} onChange={handleFieldChange} />
                        <Field label={`${label} PT`} field={`${field.replace('_stat', '')}_pt`} type="number" value={f(`${field.replace('_stat', '')}_pt`)} canEdit={canEdit} onChange={handleFieldChange} />
                      </div>
                    ))}
                    {form.raca === 'Dracônico' && (
                      <div className="grid grid-cols-2 gap-2 items-end">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">DB. Escama</Label>
                          <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center h-8">
                            {form.rf}
                          </p>
                        </div>
                        <div />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <StatBar label="HP" current={form.hp_atual} max={form.hp_max} pt={form.hp_pt} colorClass="bg-stat-hp" />
                    <StatBar label="MANA" current={form.mana_atual} max={form.mana_max} pt={form.mana_pt} colorClass="bg-stat-mana" />
                    <StatBar label="RF" current={form.rf} max={100} pt={form.rf_pt} colorClass="bg-stat-rf" showMax={false} />
                    <StatBar label="RM" current={form.rm} max={100} pt={form.rm_pt} colorClass="bg-stat-rm" showMax={false} />
                    <StatBar label="PF" current={form.pf} max={100} pt={form.pf_pt} colorClass="bg-stat-pf" showMax={false} />
                    <StatBar label="PM" current={form.pm} max={100} pt={form.pm_pt} colorClass="bg-stat-pm" showMax={false} />
                    <StatBar label="VEL" current={form.vel} max={100} pt={form.vel_pt} colorClass="bg-stat-vel" showMax={false} />
                    <StatBar label="INT" current={form.int_stat} max={100} pt={form.int_pt} colorClass="bg-stat-int" showMax={false} />
                    {form.raca === 'Dracônico' && (
                      <StatBar label="DB. Escama" current={form.rf} max={100} pt={0} colorClass="bg-stat-rf" showMax={false} />
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INFO TAB */}
        <TabsContent value="info">
          <Card className="card-glow border-primary/20">
            <CardContent className="pt-6 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Elemento</Label>
                  {canEdit ? (
                    <Select value={f('elemento') as string} onValueChange={(v) => handleFieldChange('elemento', v)}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Selecione o elemento" />
                      </SelectTrigger>
                      <SelectContent>
                        {ELEMENTOS_INFO.map((el) => (
                          <SelectItem key={el} value={el}>{el}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
                      {f('elemento') || '—'}
                    </p>
                  )}
                </div>
                <Field label="Especialidade" field="especialidade" value={f('especialidade')} canEdit={canEdit} onChange={handleFieldChange} />
                {form.raca === 'Vampiro' && (
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Contagem de Sangue</Label>
                    {canEdit ? (
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Atual" field="contagem_sangue_atual" type="number" value={f('contagem_sangue_atual')} canEdit={canEdit} onChange={handleFieldChange} />
                        <Field label="Máx" field="contagem_sangue_max" type="number" value={f('contagem_sangue_max')} canEdit={canEdit} onChange={handleFieldChange} />
                      </div>
                    ) : (
                      <p className="text-sm py-1 px-2 bg-secondary rounded min-h-[2rem] flex items-center">
                        {f('contagem_sangue_atual')} / {f('contagem_sangue_max')}
                      </p>
                    )}
                  </div>
                )}
                {form.raca === 'Kitsune' && (
                  <Field label="Caldas" field="caldas" value={f('caldas')} canEdit={canEdit} onChange={handleFieldChange} />
                )}
              </div>
              {form.raca === 'Kitsune' && (
                <TextAreaField label="Vínculos" field="vinculos" value={f('vinculos')} canEdit={canEdit} onChange={handleFieldChange} />
              )}
              <TextAreaField label="Contratos" field="contatos" value={f('contatos')} canEdit={canEdit} onChange={handleFieldChange} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* PODERES TAB */}
        <TabsContent value="poderes">
          <Card className="card-glow border-primary/20">
            <CardContent className="pt-6">
              <TextAreaField label="Poderes" field="poderes" value={f('poderes')} canEdit={canEdit} onChange={handleFieldChange} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* INVENTÁRIO TAB */}
        <TabsContent value="inventario">
          <Card className="card-glow border-primary/20">
            <CardContent className="pt-6 space-y-3">
              <TextAreaField label="Armas" field="armas" value={f('armas')} canEdit={canEdit} onChange={handleFieldChange} />
              <TextAreaField label="Armaduras" field="armaduras" value={f('armaduras')} canEdit={canEdit} onChange={handleFieldChange} />
              <TextAreaField label="Mantimentos" field="mantimentos" value={f('mantimentos')} canEdit={canEdit} onChange={handleFieldChange} />
              <TextAreaField label="Outros" field="outros" value={f('outros')} canEdit={canEdit} onChange={handleFieldChange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
