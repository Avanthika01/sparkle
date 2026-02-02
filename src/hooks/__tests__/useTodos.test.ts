import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../useTodos';

describe('useTodos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should start with empty todos', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.todos).toEqual([]);
    expect(result.current.stats.total).toBe(0);
  });

  describe('addTodo', () => {
    it('should add a new todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Test todo');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Test todo');
      expect(result.current.todos[0].completed).toBe(false);
    });

    it('should not add empty todos', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('');
        result.current.addTodo('   ');
      });

      expect(result.current.todos).toHaveLength(0);
    });

    it('should trim whitespace from todo text', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('  Test todo  ');
      });

      expect(result.current.todos[0].text).toBe('Test todo');
    });

    it('should add new todos at the beginning', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('First');
      });
      act(() => {
        result.current.addTodo('Second');
      });

      expect(result.current.todos[0].text).toBe('Second');
      expect(result.current.todos[1].text).toBe('First');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion status', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Test');
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.allTodos[0].completed).toBe(true);

      act(() => {
        result.current.toggleTodo(todoId);
      });

      expect(result.current.allTodos[0].completed).toBe(false);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('To delete');
      });

      const todoId = result.current.todos[0].id;

      act(() => {
        result.current.deleteTodo(todoId);
      });

      expect(result.current.todos).toHaveLength(0);
    });
  });

  describe('clearCompleted', () => {
    it('should remove all completed todos', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Keep this');
        result.current.addTodo('Delete this');
      });

      const deleteId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(deleteId);
      });

      act(() => {
        result.current.clearCompleted();
      });

      expect(result.current.allTodos).toHaveLength(1);
      expect(result.current.allTodos[0].text).toBe('Keep this');
    });
  });

  describe('filtering', () => {
    it('should filter active todos', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Active');
        result.current.addTodo('Completed');
      });

      const completedId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(completedId);
      });

      act(() => {
        result.current.setFilter('active');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Active');
    });

    it('should filter completed todos', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Active');
        result.current.addTodo('Completed');
      });

      const completedId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(completedId);
      });

      act(() => {
        result.current.setFilter('completed');
      });

      expect(result.current.todos).toHaveLength(1);
      expect(result.current.todos[0].text).toBe('Completed');
    });

    it('should show all todos with all filter', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('Active');
        result.current.addTodo('Completed');
      });

      const completedId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(completedId);
      });

      act(() => {
        result.current.setFilter('all');
      });

      expect(result.current.todos).toHaveLength(2);
    });
  });

  describe('stats', () => {
    it('should calculate correct stats', () => {
      const { result } = renderHook(() => useTodos());

      act(() => {
        result.current.addTodo('One');
        result.current.addTodo('Two');
        result.current.addTodo('Three');
      });

      const firstId = result.current.todos[0].id;

      act(() => {
        result.current.toggleTodo(firstId);
      });

      expect(result.current.stats.total).toBe(3);
      expect(result.current.stats.active).toBe(2);
      expect(result.current.stats.completed).toBe(1);
    });
  });
});
