import { cn } from '@/lib/utils';

interface StatBarProps {
  label: string;
  current: number;
  max: number;
  pt: number;
  colorClass: string;
  showMax?: boolean;
}

export function StatBar({ label, current, max, pt, colorClass, showMax = true }: StatBarProps) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-display font-semibold text-foreground">{label}</span>
        <span className="text-muted-foreground">
          {showMax ? `${current}/${max}` : current}
          <span className="ml-2 text-xs text-primary">PT: {pt}</span>
        </span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn('stat-bar h-full', colorClass)}
          style={{ width: `${showMax ? pct : 100}%` }}
        />
      </div>
    </div>
  );
}
