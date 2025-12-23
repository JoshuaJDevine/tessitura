import { useInstrumentStore } from '@/store/instrumentStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Clock, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export function Analytics() {
  const { instruments } = useInstrumentStore();

  const stats = useMemo(() => {
    const now = Date.now(); // Capture current time once
    const total = instruments.length;
    const used = instruments.filter((inst) => inst.metadata.usageCount > 0).length;
    const neverUsed = instruments.filter((inst) => !inst.metadata.lastUsed).length;

    const mostUsed = [...instruments]
      .sort((a, b) => b.metadata.usageCount - a.metadata.usageCount)
      .slice(0, 5);

    const leastUsed = [...instruments]
      .filter((inst) => inst.metadata.lastUsed)
      .map((inst) => ({
        ...inst,
        lastUsedDaysAgo: Math.floor(
          (now - inst.metadata.lastUsed!.getTime()) / (1000 * 60 * 60 * 24)
        ),
      }))
      .sort((a, b) => b.lastUsedDaysAgo - a.lastUsedDaysAgo)
      .slice(0, 5);

    const byCategory = instruments.reduce(
      (acc, inst) => {
        acc[inst.category] = (acc[inst.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      used,
      neverUsed,
      mostUsed,
      leastUsed,
      byCategory,
    };
  }, [instruments]);

  return (
    <div className="space-y-4 border-t mt-4 p-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        <h3 className="font-semibold">Analytics</h3>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Used</p>
          <p className="text-2xl font-bold">{stats.used}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground">Never Used</p>
          <p className="text-2xl font-bold">{stats.neverUsed}</p>
        </Card>
      </div>

      {stats.mostUsed.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <p className="text-sm font-medium">Most Used</p>
          </div>
          <div className="space-y-1">
            {stats.mostUsed.map((inst) => (
              <div key={inst.id} className="flex items-center justify-between text-xs">
                <span className="truncate">{inst.name}</span>
                <Badge variant="secondary">{inst.metadata.usageCount}x</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.leastUsed.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <p className="text-sm font-medium">Least Recently Used</p>
          </div>
          <div className="space-y-1">
            {stats.leastUsed.map((inst) => {
              const daysAgo = inst.lastUsedDaysAgo || 0;
              return (
                <div key={inst.id} className="flex items-center justify-between text-xs">
                  <span className="truncate">{inst.name}</span>
                  <Badge variant="outline">{daysAgo}d ago</Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-sm font-medium">By Category</p>
        <div className="space-y-1">
          {Object.entries(stats.byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([category, count]) => (
              <div key={category} className="flex items-center justify-between text-xs">
                <span>{category}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
