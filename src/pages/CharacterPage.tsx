import { useParams } from 'react-router-dom';
import { useCharacter } from '@/hooks/useCharacters';
import { CharacterSheet } from '@/components/CharacterSheet';
import { Loader2 } from 'lucide-react';

export default function CharacterPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { data: character, isLoading } = useCharacter(isNew ? undefined : id);

  if (!isNew && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <CharacterSheet character={isNew ? null : character} isNew={isNew} />;
}
