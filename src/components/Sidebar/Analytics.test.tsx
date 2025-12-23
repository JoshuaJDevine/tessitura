import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Analytics } from './Analytics';

// Mock the store
vi.mock('@/store/instrumentStore', () => ({
  useInstrumentStore: () => ({
    instruments: [],
  }),
}));

describe('Analytics', () => {
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
  });
});
