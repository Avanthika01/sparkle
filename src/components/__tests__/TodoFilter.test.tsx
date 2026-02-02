import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoFilter } from '../TodoFilter';

describe('TodoFilter', () => {
  const defaultProps = {
    currentFilter: 'all' as const,
    onFilterChange: vi.fn(),
    stats: { total: 5, active: 3, completed: 2 },
    onClearCompleted: vi.fn(),
  };

  it('should render item count', () => {
    render(<TodoFilter {...defaultProps} />);

    expect(screen.getByText('3 items left')).toBeInTheDocument();
  });

  it('should render singular form for 1 item', () => {
    render(
      <TodoFilter
        {...defaultProps}
        stats={{ ...defaultProps.stats, active: 1 }}
      />
    );

    expect(screen.getByText('1 item left')).toBeInTheDocument();
  });

  it('should render all filter buttons', () => {
    render(<TodoFilter {...defaultProps} />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Active' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Completed' })
    ).toBeInTheDocument();
  });

  it('should mark current filter as active', () => {
    render(<TodoFilter {...defaultProps} currentFilter="active" />);

    expect(screen.getByRole('button', { name: 'Active' })).toHaveClass(
      'active'
    );
    expect(screen.getByRole('button', { name: 'All' })).not.toHaveClass(
      'active'
    );
  });

  it('should call onFilterChange when filter button is clicked', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<TodoFilter {...defaultProps} onFilterChange={onFilterChange} />);

    await user.click(screen.getByRole('button', { name: 'Active' }));

    expect(onFilterChange).toHaveBeenCalledWith('active');
  });

  it('should render clear completed button when there are completed items', () => {
    render(<TodoFilter {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /clear completed/i })
    ).toBeInTheDocument();
  });

  it('should not render clear completed button when no completed items', () => {
    render(
      <TodoFilter
        {...defaultProps}
        stats={{ total: 3, active: 3, completed: 0 }}
      />
    );

    expect(
      screen.queryByRole('button', { name: /clear completed/i })
    ).not.toBeInTheDocument();
  });

  it('should call onClearCompleted when clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClearCompleted = vi.fn();
    render(
      <TodoFilter {...defaultProps} onClearCompleted={onClearCompleted} />
    );

    await user.click(screen.getByRole('button', { name: /clear completed/i }));

    expect(onClearCompleted).toHaveBeenCalled();
  });

  it('should have accessible aria-pressed attribute', () => {
    render(<TodoFilter {...defaultProps} currentFilter="completed" />);

    expect(screen.getByRole('button', { name: 'Completed' })).toHaveAttribute(
      'aria-pressed',
      'true'
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });

  it('should have accessible group role', () => {
    render(<TodoFilter {...defaultProps} />);

    expect(
      screen.getByRole('group', { name: /filter todos/i })
    ).toBeInTheDocument();
  });
});
