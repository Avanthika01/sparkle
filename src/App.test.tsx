import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render the app header', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /sparkle/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/a sparkling todo app/i)).toBeInTheDocument();
  });

  it('should render the todo input', () => {
    render(<App />);

    expect(
      screen.getByPlaceholderText('What needs to be done?')
    ).toBeInTheDocument();
  });

  it('should add a new todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New todo item');
    await user.click(screen.getByRole('button', { name: /add todo/i }));

    expect(screen.getByText('New todo item')).toBeInTheDocument();
  });

  it('should show filter controls after adding todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    // No filter before adding todos
    expect(screen.queryByText(/items left/i)).not.toBeInTheDocument();

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'New todo{Enter}');

    // Filter visible after adding
    expect(screen.getByText(/1 item left/i)).toBeInTheDocument();
  });

  it('should complete and filter todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Add todos
    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'First{Enter}');
    await user.type(input, 'Second{Enter}');

    // Complete first todo
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    // Filter by active
    await user.click(screen.getByRole('button', { name: 'Active' }));
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.queryByText('Second')).not.toBeInTheDocument();

    // Filter by completed
    await user.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.queryByText('First')).not.toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  it('should delete a todo', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'To delete{Enter}');

    expect(screen.getByText('To delete')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(screen.queryByText('To delete')).not.toBeInTheDocument();
  });

  it('should clear completed todos', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('What needs to be done?');
    await user.type(input, 'Keep this{Enter}');
    await user.type(input, 'Clear this{Enter}');

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[0]);

    await user.click(screen.getByRole('button', { name: /clear completed/i }));

    expect(screen.getByText('Keep this')).toBeInTheDocument();
    expect(screen.queryByText('Clear this')).not.toBeInTheDocument();
  });

  it('should show environment badge', () => {
    render(<App />);

    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(<App />);

    expect(
      screen.getByText(/built with react \+ typescript/i)
    ).toBeInTheDocument();
  });
});
