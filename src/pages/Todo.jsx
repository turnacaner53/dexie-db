import { useState } from 'react';
import { db } from '../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const { todos } = db;

function Todo() {
  const [inputValue, setInputValue] = useState('');

  const allTodos = useLiveQuery(() => todos.toArray(), []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (inputValue === '') return;
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

  const resetDatabase = async () => {
    await todos.clear();
  };

  return (
    <div className='container mx-auto'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold my-6 text-sky-800'>Todo App</h1>
        <button
          onClick={() => resetDatabase()}
          className='h-12 bg-slate-300 w-12 text-center rounded-full border-red-700  hover:bg-slate-700 text-white font-bold py-2 px-4'
        >
          <FontAwesomeIcon icon={faTrash} className='text-red-700' />
        </button>
      </div>
      <form className='flex mb-4' onSubmit={handleAddTodo}>
        <input
          type='text'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className='border w-full border-gray-300 rounded px-4 py-2 mr-2'
        />
        <button
          onClick={handleAddTodo}
          className='bg-blue-500 w-48 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          <FontAwesomeIcon icon={faPlus} className='text-white mr-4' />
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
              <FontAwesomeIcon icon={faTrash} className='text-white' />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todo;
