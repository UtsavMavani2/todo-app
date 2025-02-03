const Todo = require("../models/Todo");

const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const createTodo = async (req, res) => {
  const { title, description } = req.body;

  try {
    const todo = new Todo({ title, description, user: req.user.id });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateTodo = async (req, res) => {
  const { title, description, completed } = req.body;

  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.completed = completed || todo.completed;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// const deleteTodo = async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (!todo) {
//       return res.status(404).json({ message: "Todo not found" });
//     }

//     if (todo.user.toString() !== req.user.id) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     await todo.remove();
//     res.json({ message: "Todo removed" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


const deleteTodo = async (req, res) => {
  try {
    // console.log("Deleting Todo ID:", req.params.id);
    // console.log("Authenticated User:", req.user);
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    // Check if the todo belongs to the authenticated user
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // await todo.remove();
    await Todo.findByIdAndDelete(req?.params?.id);
    res.json({ message: 'Todo removed', success: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };
