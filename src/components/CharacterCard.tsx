import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Character } from '@/hooks/useCharacters';
import { Shield, Swords, Zap } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  basePath?: string;
}

export function CharacterCard({ character, basePath }: CharacterCardProps) {
  const linkTo = basePath ? `${basePath}/character/${character.id}` : `/character/${character.id}`;
  return (
    <Link to={linkTo}>
      <Card className="card-glow border-primary/20 hover:border-primary/40 transition-all duration-300 cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg text-primary group-hover:gold-glow transition-all">
              {character.nome}
            </CardTitle>
            <span className="text-xs font-display text-muted-foreground bg-secondary px-2 py-1 rounded">
              LVL {character.lvl}
            </span>
          </div>
          <div className="flex gap-2 text-xs text-muted-foreground">
            {character.raca && <span>{character.raca}</span>}
            {character.classe && <span>• {character.classe}</span>}
            {character.rank && <span>• {character.rank}</span>}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-stat-hp" />
              <span>{character.hp_atual}/{character.hp_max}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-stat-mana" />
              <span>{character.mana_atual}/{character.mana_max}</span>
            </div>
            <div className="flex items-center gap-1">
              <Swords className="h-3 w-3 text-stat-pf" />
              <span>PF {character.pf}</span>
            </div>
          </div>
          {/* Mini HP bar */}
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-stat-hp transition-all"
              style={{ width: `${character.hp_max ? ((character.hp_atual ?? 0) / character.hp_max) * 100 : 0}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
