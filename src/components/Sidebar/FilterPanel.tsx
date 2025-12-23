import { useUIStore } from '@/store/uiStore';
import { useInstrumentStore } from '@/store/instrumentStore';
import { Category, Host } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES: Category[] = [
  'Orchestral',
  'Synth',
  'Drums',
  'Effects',
  'Keys',
  'World',
  'Vocal',
  'Other',
];
const HOSTS: Host[] = ['Kontakt', 'Standalone', 'VST3', 'AU', 'Soundbox', 'SINE', 'Opus', 'Other'];

export function FilterPanel() {
  const {
    searchQuery,
    selectedTags,
    selectedCategories,
    selectedHosts,
    setSearchQuery,
    toggleTag,
    toggleCategory,
    toggleHost,
    clearFilters,
    setSuggestedInstrument,
  } = useUIStore();

  const { instruments } = useInstrumentStore();

  // Get all unique tags from instruments
  const allTags = Array.from(new Set(instruments.flatMap((inst) => inst.tags))).sort();

  const hasActiveFilters =
    searchQuery ||
    selectedTags.length > 0 ||
    selectedCategories.length > 0 ||
    selectedHosts.length > 0;

  // Random suggestion algorithm
  const getRandomSuggestion = () => {
    if (instruments.length === 0) return;

    const weights = instruments.map((inst) => {
      let score = 1;
      if (inst.tags.includes('Hidden Gem')) score *= 3;
      if (!inst.metadata.lastUsed) score *= 5;
      const daysSinceUsed = inst.metadata.lastUsed
        ? (Date.now() - inst.metadata.lastUsed.getTime()) / (1000 * 60 * 60 * 24)
        : 999;
      score *= Math.min(daysSinceUsed / 30, 10);
      return { id: inst.id, score };
    });

    const totalWeight = weights.reduce((sum, w) => sum + w.score, 0);
    let random = Math.random() * totalWeight;

    for (const { id, score } of weights) {
      random -= score;
      if (random <= 0) {
        setSuggestedInstrument(id);
        // Scroll to node after a brief delay
        setTimeout(() => {
          const node = document.querySelector(`[data-id="${id}"]`);
          node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }
    }
  };

  return (
    <div className="flex h-full flex-col space-y-4 border-r bg-card p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search instruments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Categories</Label>
        <div className="space-y-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`cat-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <Label htmlFor={`cat-${category}`} className="text-sm font-normal cursor-pointer">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Hosts</Label>
        <div className="space-y-2">
          {HOSTS.map((host) => (
            <div key={host} className="flex items-center space-x-2">
              <Checkbox
                id={`host-${host}`}
                checked={selectedHosts.includes(host)}
                onCheckedChange={() => toggleHost(host)}
              />
              <Label htmlFor={`host-${host}`} className="text-sm font-normal cursor-pointer">
                {host}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer transition-colors',
                selectedTags.includes(tag) && 'bg-primary text-primary-foreground'
              )}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="space-y-2">
          <Label>Active Filters</Label>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery('')} />
              </Badge>
            )}
            {selectedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleTag(tag)} />
              </Badge>
            ))}
            {selectedCategories.map((cat) => (
              <Badge key={cat} variant="secondary" className="gap-1">
                {cat}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
              </Badge>
            ))}
            {selectedHosts.map((host) => (
              <Badge key={host} variant="secondary" className="gap-1">
                {host}
                <X className="h-3 w-3 cursor-pointer" onClick={() => toggleHost(host)} />
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-4">
        <Button variant="outline" className="w-full" onClick={getRandomSuggestion}>
          <Sparkles className="mr-2 h-4 w-4" />
          Surprise Me
        </Button>
      </div>
    </div>
  );
}
