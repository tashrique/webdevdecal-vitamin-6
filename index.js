const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

let todos = [];

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  
  // Validate task
  if (!task || task.trim() === '') {
    return res.status(400).json({ error: 'Task cannot be empty' });
  }

  const newTodo = {
    id: todos.length + 1,
    task: task.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;
  
  const todoIndex = todos.findIndex(t => t.id === parseInt(id));
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (task !== undefined) {
    if (task.trim() === '') {
      return res.status(400).json({ error: 'Task cannot be empty' });
    }
    todos[todoIndex].task = task.trim();
  }

  if (completed !== undefined) {
    todos[todoIndex].completed = completed;
  }

  res.json(todos[todoIndex]);
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = todos.length;
  
  todos = todos.filter(t => t.id !== parseInt(id));
  
  if (todos.length === initialLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  res.status(204).send();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}); 