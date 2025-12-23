import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Analytics } from './Analytics';
import type { Instrument } from '@/types';

// Mock the store
const mockUseInstrumentStore = vi.fn();

vi.mock('@/store/instrumentStore', () => ({
  useInstrumentStore: () => mockUseInstrumentStore(),
}));

describe('Analytics', () => {
  beforeEach(() => {
    // Reset mock to empty state
    mockUseInstrumentStore.mockReturnValue({
      instruments: [],
    });
  });

  it('should render with correct spacing classes', () => {
    const { container } = render(<Analytics />);
    const wrapper = container.firstChild as HTMLElement;

    // Verify the component has the spacing classes
    expect(wrapper.className).toContain('border-t');
    expect(wrapper.className).toContain('mt-4');
    expect(wrapper.className).toContain('p-4');
    expect(wrapper.className).toContain('space-y-4');
  });

  it('should render analytics heading', () => {
    render(<Analytics />);
    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('should display zero counts when no instruments', () => {
    render(<Analytics />);

    // Check for stat cards
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('Used')).toBeInTheDocument();
    expect(screen.getByText('Never Used')).toBeInTheDocument();

    // Verify the counts are 0
    const cards = screen.getAllByText('0');
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  describe('with multiple instruments', () => {
    const mockInstruments: Instrument[] = [
      {
        id: 'inst-1',
        name: 'Test Synth',
        developer: 'Acme',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        position: { x: 0, y: 0 },
        pairings: [],
        color: '#8b5cf6',
        metadata: {
          createdAt: new Date('2024-01-01'),
          lastUsed: new Date('2024-01-10'),
          usageCount: 5,
        },
      },
      {
        id: 'inst-2',
        name: 'Test Drums',
        developer: 'Acme',
        host: 'VST3',
        category: 'Drums',
        tags: [],
        notes: '',
        position: { x: 100, y: 100 },
        pairings: [],
        color: '#ef4444',
        metadata: {
          createdAt: new Date('2024-01-01'),
          lastUsed: new Date('2024-01-15'),
          usageCount: 10,
        },
      },
      {
        id: 'inst-3',
        name: 'Test Orchestral',
        developer: 'Acme',
        host: 'Kontakt',
        category: 'Orchestral',
        tags: [],
        notes: '',
        position: { x: 200, y: 200 },
        pairings: [],
        color: '#3b82f6',
        metadata: {
          createdAt: new Date('2024-01-01'),
          usageCount: 0,
        },
      },
      {
        id: 'inst-4',
        name: 'Test Keys',
        developer: 'Acme',
        host: 'VST3',
        category: 'Keys',
        tags: [],
        notes: '',
        position: { x: 300, y: 300 },
        pairings: [],
        color: '#f59e0b',
        metadata: {
          createdAt: new Date('2024-01-01'),
          lastUsed: new Date('2024-01-05'),
          usageCount: 3,
        },
      },
      {
        id: 'inst-5',
        name: 'Test Effects',
        developer: 'Acme',
        host: 'VST3',
        category: 'Effects',
        tags: [],
        notes: '',
        position: { x: 400, y: 400 },
        pairings: [],
        color: '#10b981',
        metadata: {
          createdAt: new Date('2024-01-01'),
          lastUsed: new Date('2024-01-20'),
          usageCount: 15,
        },
      },
    ];

    beforeEach(() => {
      mockUseInstrumentStore.mockReturnValue({
        instruments: mockInstruments,
      });
    });

    it('should display correct total count', () => {
      render(<Analytics />);

      const totalSection = screen.getByText('Total').closest('div');
      expect(totalSection).toHaveTextContent('5');
    });

    it('should display correct used count', () => {
      render(<Analytics />);

      const usedSection = screen.getByText('Used').closest('div');
      expect(usedSection).toHaveTextContent('4');
    });

    it('should display correct never used count', () => {
      render(<Analytics />);

      const neverUsedSection = screen.getByText('Never Used').closest('div');
      expect(neverUsedSection).toHaveTextContent('1');
    });

    it('should show most used instruments', () => {
      render(<Analytics />);

      expect(screen.getByText('Most Used')).toBeInTheDocument();

      // Use getAllByText for duplicate names
      const effectsElements = screen.getAllByText('Test Effects');
      expect(effectsElements.length).toBeGreaterThan(0);

      expect(screen.getByText('15x')).toBeInTheDocument();

      const drumsElements = screen.getAllByText('Test Drums');
      expect(drumsElements.length).toBeGreaterThan(0);

      expect(screen.getByText('10x')).toBeInTheDocument();
    });

    it('should show least recently used instruments', () => {
      render(<Analytics />);

      expect(screen.getByText('Least Recently Used')).toBeInTheDocument();

      // Use getAllByText for duplicate names
      const keysElements = screen.getAllByText('Test Keys');
      expect(keysElements.length).toBeGreaterThan(0);
    });

    it('should display category breakdown', () => {
      render(<Analytics />);

      expect(screen.getByText('By Category')).toBeInTheDocument();
      expect(screen.getByText('Synth')).toBeInTheDocument();
      expect(screen.getByText('Drums')).toBeInTheDocument();
      expect(screen.getByText('Orchestral')).toBeInTheDocument();
      expect(screen.getByText('Keys')).toBeInTheDocument();
      expect(screen.getByText('Effects')).toBeInTheDocument();
    });

    it('should sort categories by count', () => {
      // Add more instruments in one category to test sorting
      const instrumentsWithDuplicateCategory: Instrument[] = [
        ...mockInstruments,
        {
          id: 'inst-6',
          name: 'Another Synth',
          developer: 'Acme',
          host: 'VST3',
          category: 'Synth',
          tags: [],
          notes: '',
          position: { x: 500, y: 500 },
          pairings: [],
          color: '#8b5cf6',
          metadata: {
            createdAt: new Date('2024-01-01'),
            usageCount: 0,
          },
        },
      ];

      mockUseInstrumentStore.mockReturnValue({
        instruments: instrumentsWithDuplicateCategory,
      });

      render(<Analytics />);

      // Synth category should have count of 2
      const synthCategory = screen.getByText('Synth').closest('div');
      expect(synthCategory).toHaveTextContent('2');
    });
  });

  describe('conditional sections', () => {
    it('should not show most used section when no instruments', () => {
      render(<Analytics />);

      expect(screen.queryByText('Most Used')).not.toBeInTheDocument();
    });

    it('should not show least recently used section when no instruments have been used', () => {
      const neverUsedInstruments: Instrument[] = [
        {
          id: 'inst-1',
          name: 'Never Used',
          developer: 'Acme',
          host: 'VST3',
          category: 'Synth',
          tags: [],
          notes: '',
          position: { x: 0, y: 0 },
          pairings: [],
          color: '#8b5cf6',
          metadata: {
            createdAt: new Date('2024-01-01'),
            usageCount: 0,
          },
        },
      ];

      mockUseInstrumentStore.mockReturnValue({
        instruments: neverUsedInstruments,
      });

      render(<Analytics />);

      expect(screen.queryByText('Least Recently Used')).not.toBeInTheDocument();
    });

    it('should show category breakdown even with one instrument', () => {
      const singleInstrument: Instrument[] = [
        {
          id: 'inst-1',
          name: 'Single Instrument',
          developer: 'Acme',
          host: 'VST3',
          category: 'Synth',
          tags: [],
          notes: '',
          position: { x: 0, y: 0 },
          pairings: [],
          color: '#8b5cf6',
          metadata: {
            createdAt: new Date('2024-01-01'),
            usageCount: 0,
          },
        },
      ];

      mockUseInstrumentStore.mockReturnValue({
        instruments: singleInstrument,
      });

      render(<Analytics />);

      expect(screen.getByText('By Category')).toBeInTheDocument();
      expect(screen.getByText('Synth')).toBeInTheDocument();
    });
  });

  describe('usage calculations', () => {
    it('should correctly identify instruments never used', () => {
      const mixedUsageInstruments: Instrument[] = [
        {
          id: 'inst-1',
          name: 'Used Once',
          developer: 'Acme',
          host: 'VST3',
          category: 'Synth',
          tags: [],
          notes: '',
          position: { x: 0, y: 0 },
          pairings: [],
          color: '#8b5cf6',
          metadata: {
            createdAt: new Date('2024-01-01'),
            lastUsed: new Date('2024-01-10'),
            usageCount: 1,
          },
        },
        {
          id: 'inst-2',
          name: 'Never Used 1',
          developer: 'Acme',
          host: 'VST3',
          category: 'Drums',
          tags: [],
          notes: '',
          position: { x: 100, y: 100 },
          pairings: [],
          color: '#ef4444',
          metadata: {
            createdAt: new Date('2024-01-01'),
            usageCount: 0,
          },
        },
        {
          id: 'inst-3',
          name: 'Never Used 2',
          developer: 'Acme',
          host: 'VST3',
          category: 'Keys',
          tags: [],
          notes: '',
          position: { x: 200, y: 200 },
          pairings: [],
          color: '#f59e0b',
          metadata: {
            createdAt: new Date('2024-01-01'),
            usageCount: 0,
          },
        },
      ];

      mockUseInstrumentStore.mockReturnValue({
        instruments: mixedUsageInstruments,
      });

      render(<Analytics />);

      const neverUsedSection = screen.getByText('Never Used').closest('div');
      expect(neverUsedSection).toHaveTextContent('2');
    });

    it('should limit most used to top 5', () => {
      const manyInstruments: Instrument[] = Array.from({ length: 10 }, (_, i) => ({
        id: `inst-${i}`,
        name: `Instrument ${i}`,
        developer: 'Acme',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        position: { x: i * 100, y: i * 100 },
        pairings: [],
        color: '#8b5cf6',
        metadata: {
          createdAt: new Date('2024-01-01'),
          lastUsed: new Date('2024-01-10'),
          usageCount: 10 - i, // Descending usage count
        },
      }));

      mockUseInstrumentStore.mockReturnValue({
        instruments: manyInstruments,
      });

      render(<Analytics />);

      // Should show top 5 most used
      const instrument0 = screen.getAllByText('Instrument 0');
      expect(instrument0.length).toBeGreaterThan(0);

      const instrument4 = screen.getAllByText('Instrument 4');
      expect(instrument4.length).toBeGreaterThan(0);

      // 6th item should not be in Most Used section (may be in category section)
      const mostUsedSection = screen.getByText('Most Used').closest('div');
      expect(mostUsedSection?.textContent).not.toContain('Instrument 5');
    });

    it('should limit least recently used to top 5', () => {
      const manyInstruments: Instrument[] = Array.from({ length: 10 }, (_, i) => ({
        id: `inst-${i}`,
        name: `Instrument ${i}`,
        developer: 'Acme',
        host: 'VST3',
        category: 'Synth',
        tags: [],
        notes: '',
        position: { x: i * 100, y: i * 100 },
        pairings: [],
        color: '#8b5cf6',
        metadata: {
          createdAt: new Date('2024-01-01'),
          lastUsed: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Each day older
          usageCount: 1,
        },
      }));

      mockUseInstrumentStore.mockReturnValue({
        instruments: manyInstruments,
      });

      render(<Analytics />);

      // Should show 5 least recently used (oldest ones)
      const instrument9 = screen.getAllByText('Instrument 9');
      expect(instrument9.length).toBeGreaterThan(0);

      const instrument5 = screen.getAllByText('Instrument 5');
      expect(instrument5.length).toBeGreaterThan(0);

      // Instrument 4 may appear in category section, so check that it's not in least recently used
      const leastRecentSection = screen.getByText('Least Recently Used').closest('div');
      expect(leastRecentSection?.textContent).not.toContain('Instrument 4');
    });
  });
});
