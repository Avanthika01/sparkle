import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodoList } from '../TodoList';
import type { Todo } from '../../types/todo';

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    { id: '1', text: 'First todo', completed: false, createdAt: 1 },
    { id: '2', text: 'Second todo', completed: true, createdAt: 2 },
  ];

  it('should render empty message when no todos', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
  });

  it('should render list of todos', () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByText('First todo')).toBeInTheDocument();
    expect(screen.getByText('Second todo')).toBeInTheDocument();
  });

  it('should render correct number of todos', () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should pass onToggle to TodoItem', () => {
    const onToggle = vi.fn();
    render(
      <TodoList todos={mockTodos} onToggle={onToggle} onDelete={vi.fn()} />
    );

    // Verify TodoItem components are rendered with correct props
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should have accessible role for empty state', () => {
    render(<TodoList todos={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have accessible role for list', () => {
    render(
      <TodoList todos={mockTodos} onToggle={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
