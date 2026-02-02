import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import './App.css';

function App() {
  const {
    todos,
    filter,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    setFilter,
    clearCompleted,
  } = useTodos();

  return (
    <div className="app">
      <header className="app-header">
        <h1>✨ Sparkle</h1>
        <p className="tagline">A sparkling todo app</p>
      </header>
      <main className="todo-container">
        <TodoInput onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        {stats.total > 0 && (
          <TodoFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            stats={stats}
            onClearCompleted={clearCompleted}
          />
        )}
      </main>
      <footer className="app-footer">
        <p>
          Built with React + TypeScript |{' '}
          <span className="env-badge">{import.meta.env.MODE}</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
