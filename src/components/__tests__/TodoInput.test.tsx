import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoInput } from '../TodoInput';

describe('TodoInput', () => {
  it('should render input and button', () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(
      screen.getByPlaceholderText('What needs to be done?')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add todo/i })
    ).toBeInTheDocument();
  });

  it('should call onAdd with input value on submit', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add todo/i }));

    expect(onAdd).toHaveBeenCalledWith('New todo');
  });

  it('should clear input after submit', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New todo');
    await user.click(screen.getByRole('button', { name: /add todo/i }));

    expect(input).toHaveValue('');
  });

  it('should disable button when input is empty', () => {
    render(<TodoInput onAdd={vi.fn()} />);

    expect(screen.getByRole('button', { name: /add todo/i })).toBeDisabled();
  });

  it('should enable button when input has text', async () => {
    const user = userEvent.setup();
    render(<TodoInput onAdd={vi.fn()} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'test');

    expect(screen.getByRole('button', { name: /add todo/i })).toBeEnabled();
  });

  it('should submit on Enter key', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New todo{Enter}');

    expect(onAdd).toHaveBeenCalledWith('New todo');
  });

  it('should not submit empty or whitespace-only input', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<TodoInput onAdd={onAdd} />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, '   {Enter}');

    expect(onAdd).not.toHaveBeenCalled();
  });
});
