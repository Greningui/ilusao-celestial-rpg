import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Loader2, Flame, Droplets, Snowflake, Zap, Mountain, Sun, Leaf, Skull, Sparkles, Swords, Wind, Heart, Clock, CircleDot, Eye, Brain, Moon, Gem, Beaker, Target, Waves, BookOpen, Star, Ghost, Crosshair, HandMetal, Wand2 } from 'lucide-react';

const SKILL_CATEGORIES = [
  { slug: 'fumaca', label: 'Habilidades de Fumaça', icon: Wind },
  { slug: 'fogo', label: 'Habilidades de Fogo', icon: Flame },
  { slug: 'agua', label: 'Habilidades de Água', icon: Droplets },
  { slug: 'gelo', label: 'Habilidades de Gelo', icon: Snowflake },
  { slug: 'eletricidade', label: 'Habilidades de Eletricidade', icon: Zap },
  { slug: 'terra', label: 'Habilidades de Terra', icon: Mountain },
  { slug: 'luz', label: 'Habilidades de Luz', icon: Sun },
  { slug: 'natureza', label: 'Habilidades de Natureza', icon: Leaf },
  { slug: 'magma', label: 'Habilidades de Magma', icon: Flame },
  { slug: 'crystal', label: 'Habilidades de Crystal', icon: Gem },
  { slug: 'metal', label: 'Habilidades de Metal', icon: Shield },
  { slug: 'veneno', label: 'Habilidades de Veneno', icon: Beaker },
  { slug: 'psycho', label: 'Habilidades de Psycho', icon: Brain },
  { slug: 'sombrio', label: 'Habilidades de Sombrio', icon: Moon },
  { slug: 'arcano', label: 'Habilidades de Arcano', icon: Sparkles },
  { slug: 'plasma', label: 'Habilidades de Plasma', icon: Zap },
  { slug: 'sangue', label: 'Habilidades de Sangue', icon: Heart },
  { slug: 'tempo', label: 'Habilidades de Tempo', icon: Clock },
  { slug: 'morte', label: 'Habilidades de Morte', icon: Skull },
  { slug: 'vazio', label: 'Habilidades de Vazio', icon: CircleDot },
  { slug: 'ninjutsu', label: 'Ninjutsu', icon: Target },
  { slug: 'taijutsu', label: 'Taijutsu', icon: HandMetal },
  { slug: 'genjutsu', label: 'Genjutsu', icon: Eye },
  { slug: 'tecnicas-amaldicoadas', label: 'Técnicas Amaldiçoadas', icon: Ghost },
  { slug: 'tecnicas-inatas', label: 'Técnicas Inatas', icon: Star },
  { slug: 'individualidades', label: 'Individualidades', icon: Wand2 },
  { slug: 'individualidades-demoniacas', label: 'Individualidades Demoníacas', icon: Skull },
  { slug: 'respiracao', label: 'Respiração', icon: Wind },
];

export { SKILL_CATEGORIES };

export default function SkillsListPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-primary/20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/menu">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="font-display text-xl font-bold text-primary gold-glow">Lista de Habilidades</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-6">
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SKILL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.slug} to={`/skills/${cat.slug}`}>
                <Button variant="outline" className="w-full h-12 justify-start gap-3 border-primary/20 text-foreground hover:bg-primary/10">
                  <Icon className="h-5 w-5 text-primary shrink-0" />
                  {cat.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
