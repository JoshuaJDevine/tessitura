import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InstrumentCard } from './InstrumentCard';
import { Instrument } from '@/types';

// Mock the CSS module
vi.mock('./InstrumentCard.module.css', () => ({
  default: {
    card: 'card',
    cardSelected: 'cardSelected',
    gradientSynth: 'gradientSynth',
    gradientEffect: 'gradientEffect',
    gradientOrchestral: 'gradientOrchestral',
    gradientDrum: 'gradientDrum',
    gradientKeys: 'gradientKeys',
    gradientWorld: 'gradientWorld',
    gradientVocal: 'gradientVocal',
    gradientOther: 'gradientOther',
  },
}));

const createMockInstrument = (overrides?: Partial<Instrument>): Instrument => ({
  id: 'test-id-1',
  name: 'Test Synth',
  developer: 'Test Developer',
  host: 'VST3',
  category: 'Synth',
  tags: ['electronic', 'bass'],
  notes: 'Test notes',
  position: { x: 0, y: 0 },
  pairings: [],
  color: '#8b5cf6',
  metadata: {
    createdAt: new Date('2024-01-01'),
    usageCount: 0,
  },
  ...overrides,
});

describe('InstrumentCard', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    mockOnSelect.mockClear();
  });

  describe('rendering', () => {
    it('should render instrument name', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Test Synth')).toBeInTheDocument();
    });

    it('should render developer name', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Test Developer')).toBeInTheDocument();
    });

    it('should render category badge', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('Synth')).toBeInTheDocument();
    });

    it('should render host badge', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      expect(screen.getByText('VST3')).toBeInTheDocument();
    });

    it('should apply correct gradient class for Synth category', () => {
      const instrument = createMockInstrument({ category: 'Synth' });
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = container.querySelector('.gradientSynth');
      expect(card).toBeInTheDocument();
    });

    it('should apply correct gradient class for Effects category', () => {
      const instrument = createMockInstrument({ category: 'Effects' });
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = container.querySelector('.gradientEffect');
      expect(card).toBeInTheDocument();
    });

    it('should apply correct gradient class for Orchestral category', () => {
      const instrument = createMockInstrument({ category: 'Orchestral' });
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = container.querySelector('.gradientOrchestral');
      expect(card).toBeInTheDocument();
    });

    it('should apply correct gradient class for Drums category', () => {
      const instrument = createMockInstrument({ category: 'Drums' });
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = container.querySelector('.gradientDrum');
      expect(card).toBeInTheDocument();
    });

    it('should apply gradientOther for unknown category', () => {
      const instrument = createMockInstrument({ category: 'Other' });
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = container.querySelector('.gradientOther');
      expect(card).toBeInTheDocument();
    });
  });

  describe('view density', () => {
    it('should apply spacious dimensions when viewDensity is spacious', () => {
      const instrument = createMockInstrument();
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('w-[250px]');
      expect(card.className).toContain('h-[350px]');
    });

    it('should apply compact dimensions when viewDensity is compact', () => {
      const instrument = createMockInstrument();
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="compact"
          onSelect={mockOnSelect}
        />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('w-[200px]');
      expect(card.className).toContain('h-[280px]');
    });

    it('should apply compact text size when viewDensity is compact', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="compact"
          onSelect={mockOnSelect}
        />
      );

      const nameElement = screen.getByText('Test Synth');
      expect(nameElement.className).toContain('text-lg');
    });

    it('should apply spacious text size when viewDensity is spacious', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const nameElement = screen.getByText('Test Synth');
      expect(nameElement.className).toContain('text-xl');
    });
  });

  describe('selection', () => {
    it('should call onSelect when card is clicked', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      fireEvent.click(card);

      expect(mockOnSelect).toHaveBeenCalledWith('test-id-1');
      expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });

    it('should apply selected styling when isSelected is true', () => {
      const instrument = createMockInstrument();
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={true}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('cardSelected');
    });

    it('should not apply selected styling when isSelected is false', () => {
      const instrument = createMockInstrument();
      const { container } = render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = container.firstChild as HTMLElement;
      expect(card.className).not.toContain('cardSelected');
    });

    it('should have aria-selected attribute set to true when selected', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={true}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-selected', 'true');
    });

    it('should have aria-selected attribute set to false when not selected', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('keyboard navigation', () => {
    it('should call onSelect when Enter key is pressed', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Enter' });

      expect(mockOnSelect).toHaveBeenCalledWith('test-id-1');
    });

    it('should call onSelect when Space key is pressed', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: ' ' });

      expect(mockOnSelect).toHaveBeenCalledWith('test-id-1');
    });

    it('should prevent default behavior when Enter is pressed', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      fireEvent(card, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default behavior when Space is pressed', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      fireEvent(card, event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should not call onSelect when other keys are pressed', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      fireEvent.keyDown(card, { key: 'Tab' });
      fireEvent.keyDown(card, { key: 'ArrowDown' });

      expect(mockOnSelect).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have role="button"', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });

    it('should have tabIndex={0} for keyboard navigation', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabIndex', '0');
    });

    it('should have descriptive aria-label', () => {
      const instrument = createMockInstrument({
        name: 'BBC Symphony',
        developer: 'Spitfire Audio',
      });
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-label', 'BBC Symphony by Spitfire Audio');
    });

    it('should have aria-selected attribute', () => {
      const instrument = createMockInstrument();
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('aria-selected');
    });
  });

  describe('edge cases', () => {
    it('should handle instruments with empty name', () => {
      const instrument = createMockInstrument({ name: '' });
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });

    it('should handle instruments with empty developer', () => {
      const instrument = createMockInstrument({ developer: '' });
      render(
        <InstrumentCard
          instrument={instrument}
          isSelected={false}
          viewDensity="spacious"
          onSelect={mockOnSelect}
        />
      );

      const card = screen.getByRole('button');
      expect(card).toBeInTheDocument();
    });

    it('should handle all category types', () => {
      const categories: Instrument['category'][] = [
        'Synth',
        'Effects',
        'Orchestral',
        'Drums',
        'Keys',
        'World',
        'Vocal',
        'Other',
      ];

      categories.forEach((category) => {
        const instrument = createMockInstrument({ category });
        const { unmount } = render(
          <InstrumentCard
            instrument={instrument}
            isSelected={false}
            viewDensity="spacious"
            onSelect={mockOnSelect}
          />
        );
        expect(screen.getByText(category)).toBeInTheDocument();
        unmount();
      });
    });

    it('should handle all host types', () => {
      const hosts: Instrument['host'][] = [
        'Kontakt',
        'Standalone',
        'VST3',
        'AU',
        'Soundbox',
        'SINE',
        'Opus',
        'Other',
      ];

      hosts.forEach((host) => {
        const instrument = createMockInstrument({ host });
        const { unmount } = render(
          <InstrumentCard
            instrument={instrument}
            isSelected={false}
            viewDensity="spacious"
            onSelect={mockOnSelect}
          />
        );
        expect(screen.getByText(host)).toBeInTheDocument();
        unmount();
      });
    });
  });
});
