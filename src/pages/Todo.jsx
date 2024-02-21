import { useState } from 'react';
import { db } from '../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';

const { todos } = db;

function Todo() {
  const [inputValue, setInputValue] = useState('');

  const allTodos = useLiveQuery(() => todos.toArray(), []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    const newTodo = { task: inputValue, completed: false, date: new Date() };

    await todos.add(newTodo);
    setInputValue('');
  };

  const handleDeleteTodo = async (id) => {
    todos.delete(id);
  };

  const toggleComplete = async (id, e) => {
    await todos.update(id, { completed: !!e.target.checked });
  };

  return (
    <div className='container mx-auto'>
      <h1 className='text-2xl font-bold my-6 text-sky-800'>Todo App</h1>
      <form className='flex mb-4' onSubmit={handleAddTodo}>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className='border w-full border-gray-300 rounded px-4 py-2 mr-2'
        />
        <button
          onClick={handleAddTodo}
          className='bg-blue-500 w-32 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Add Todo
        </button>
      </form>
      {allTodos?.length === 0 && (
        <div
          className='bg-blue-100 border rounded-lg border-b border-blue-500 text-blue-700 px-4 py-3'
          role='alert'
        >
          <p className='font-bold'>No Todos added yet!</p>
          <p className='text-sm'>use the form above to add a new task.</p>
        </div>
      )}

      <ul>
        {allTodos?.map(({ id, completed, task, date }) => (
          <li
            key={id}
            className='flex justify-between items-center mb-2 border-b-2 hover:bg-slate-200'
          >
            <input
              type='checkbox'
              checked={completed}
              onChange={(e) => toggleComplete(id, e)}
              className='form-checkbox h-5 w-5 text-blue-500'
            />
            <p className={`mx-4 flex-1 ${completed ? 'line-through' : 'none'}`}>{task}</p>
            <p className='px-4 font-thin text-slate-600'>{new Date(date).toLocaleString()}</p>
            <button
              onClick={() => handleDeleteTodo(id)}
              className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
