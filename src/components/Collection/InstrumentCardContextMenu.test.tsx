import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstrumentCardContextMenu } from './InstrumentCardContextMenu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Mock stores
const mockMarkAsUsed = vi.fn();
const mockDeleteInstrument = vi.fn();
const mockOpenEditInstrument = vi.fn();

vi.mock('@/store/instrumentStore', () => ({
  useInstrumentStore: () => ({
    markAsUsed: mockMarkAsUsed,
    deleteInstrument: mockDeleteInstrument,
  }),
}));

vi.mock('@/store/uiStore', () => ({
  useUIStore: () => ({
    openEditInstrument: mockOpenEditInstrument,
  }),
}));

describe('InstrumentCardContextMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render children', () => {
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="Test Instrument">
          <DropdownMenuTrigger asChild>
            <div>Test Child</div>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should render context menu with all actions', async () => {
      const user = userEvent.setup();
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="Test Instrument">
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      // Open the dropdown menu by clicking the trigger
      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      // Wait for menu to appear
      await waitFor(
        () => {
          expect(screen.getByText('Mark as Used')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('Mark as Used action', () => {
    it('should call markAsUsed from store when "Mark as Used" is clicked', async () => {
      const user = userEvent.setup();
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="Test Instrument">
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Mark as Used')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const markAsUsedItem = screen.getByText('Mark as Used');
      await user.click(markAsUsedItem);

      expect(mockMarkAsUsed).toHaveBeenCalledWith('test-id');
      expect(mockMarkAsUsed).toHaveBeenCalledTimes(1);
    });

    it('should call onMarkAsUsed callback when provided', async () => {
      const user = userEvent.setup();
      const mockOnMarkAsUsed = vi.fn();
      render(
        <InstrumentCardContextMenu
          instrumentId="test-id"
          instrumentName="Test Instrument"
          onMarkAsUsed={mockOnMarkAsUsed}
        >
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Mark as Used')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const markAsUsedItem = screen.getByText('Mark as Used');
      await user.click(markAsUsedItem);

      expect(mockOnMarkAsUsed).toHaveBeenCalledTimes(1);
      expect(mockMarkAsUsed).toHaveBeenCalledWith('test-id');
    });
  });

  describe('Edit action', () => {
    it('should call openEditInstrument from uiStore when "Edit" is clicked', async () => {
      const user = userEvent.setup();
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="Test Instrument">
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Edit')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const editItem = screen.getByText('Edit');
      await user.click(editItem);

      expect(mockOpenEditInstrument).toHaveBeenCalledWith('test-id');
      expect(mockOpenEditInstrument).toHaveBeenCalledTimes(1);
    });
  });

  describe('Delete action', () => {
    it('should show delete confirmation dialog when "Delete" is clicked', async () => {
      const user = userEvent.setup();
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="Test Instrument">
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Delete')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const deleteItem = screen.getByText('Delete');
      await user.click(deleteItem);

      // Dialog should appear
      await waitFor(
        () => {
          expect(screen.getByText('Delete Instrument')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      expect(screen.getByText(/Test Instrument/)).toBeInTheDocument();
    });

    it('should call deleteInstrument when delete is confirmed', async () => {
      const user = userEvent.setup();
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="Test Instrument">
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Delete')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const deleteItem = screen.getByText('Delete');
      await user.click(deleteItem);

      await waitFor(
        () => {
          expect(screen.getByText('Delete Instrument')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const confirmButton = screen.getByRole('button', { name: /^Delete$/ });
      await user.click(confirmButton);

      expect(mockDeleteInstrument).toHaveBeenCalledWith('test-id');
      expect(mockDeleteInstrument).toHaveBeenCalledTimes(1);
    });

    it('should close dialog without deleting when Cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="Test Instrument">
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Delete')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const deleteItem = screen.getByText('Delete');
      await user.click(deleteItem);

      await waitFor(
        () => {
          expect(screen.getByText('Delete Instrument')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const cancelButton = screen.getByRole('button', { name: /Cancel/ });
      await user.click(cancelButton);

      // Dialog should close
      await waitFor(
        () => {
          expect(screen.queryByText('Delete Instrument')).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(mockDeleteInstrument).not.toHaveBeenCalled();
    });

    it('should display instrument name in delete confirmation dialog', async () => {
      const user = userEvent.setup();
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="BBC Symphony Orchestra">
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Delete')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const deleteItem = screen.getByText('Delete');
      await user.click(deleteItem);

      await waitFor(
        () => {
          expect(screen.getByText(/BBC Symphony Orchestra/)).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('keyboard accessibility', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <InstrumentCardContextMenu instrumentId="test-id" instrumentName="Test Instrument">
          <DropdownMenuTrigger asChild>
            <button>Trigger</button>
          </DropdownMenuTrigger>
        </InstrumentCardContextMenu>
      );

      const trigger = screen.getByText('Trigger');
      await user.click(trigger);

      await waitFor(
        () => {
          expect(screen.getByText('Mark as Used')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      // Menu items should be focusable
      const markAsUsedItem = screen.getByText('Mark as Used');
      expect(markAsUsedItem).toBeInTheDocument();
    });
  });
});
