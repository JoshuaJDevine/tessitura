import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DirectoryScanner } from './DirectoryScanner';

// Mock the store
vi.mock('@/store/instrumentStore', () => ({
  useInstrumentStore: () => ({
    addInstrument: vi.fn(),
  }),
}));

describe('DirectoryScanner', () => {
  it('should render with correct spacing classes', () => {
    const { container } = render(<DirectoryScanner />);
    const wrapper = container.firstChild as HTMLElement;

    // Verify the component has the spacing classes
    expect(wrapper.className).toContain('border-t');
    expect(wrapper.className).toContain('mt-4');
    expect(wrapper.className).toContain('p-4');
  });

  it('should render the scan directory button', () => {
    render(<DirectoryScanner />);
    expect(screen.getByText('Scan Directory')).toBeInTheDocument();
  });

  it('should disable button when electronAPI is not available', () => {
    render(<DirectoryScanner />);
    const button = screen.getByRole('button', { name: /scan directory/i });
    expect(button).toBeDisabled();
  });
});
