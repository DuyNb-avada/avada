import {
  getAll as getListTodo,
  getOne as getOneTodo,
  deleteOne as deleteTodo,
  add as addTodo,
  update as updateTodo,
  action as actionTodoes,
} from "../../database/repository/todoRepository.js";

/**
 * Get all todos with optional limit and order.
 * @param {Object} ctx
 * @returns {Promise<void>}
 */
async function getTodoes(ctx) {
  const { limit, order } = ctx.query;
  try {
    const todos = await getListTodo(limit, order);
    ctx.body = { data: todos };
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
}

/**
 * Get a single todo by ID.
 * @param {Object} ctx
 * @returns {Promise<void>}
 */
async function getTodo(ctx) {
  const { id } = ctx.params;
  const { fields } = ctx.query;
  try {
    const currentTodo = await getOneTodo(id);
    if (!currentTodo) {
      ctx.status = 404;
      ctx.body = { success: false, error: "Todo Not Found with that id!" };
      return;
    }

    if (!fields) {
      ctx.body = { data: currentTodo };
      return;
    }
    const fieldsArray = fields.split(",");
    const filteredTodo = {};
    fieldsArray.forEach((field) => {
      if (currentTodo.hasOwnProperty(field)) {
        filteredTodo[field] = currentTodo[field];
      }
    });
    ctx.body = filteredTodo;
  } catch (e) {
    ctx.status = 500;
    ctx.body = { success: false, error: e.message };
  }
}

/**
 * Add a new todo.
 * @param {Object} ctx
 * @returns {Promise<void>}
 */
async function save(ctx) {
  const postData = ctx.request.body;
  try {
    const data = await addTodo(postData);
    ctx.status = 200;
    ctx.body = { success: true, data: data };
  } catch (e) {
    ctx.status = 500;
    ctx.body = { success: false, error: e.message };
  }
  return true;
}

/**
 * Update an existing todo.
 * @param {Object} ctx
 * @returns {Promise<void>}
 */
async function update(ctx) {
  const { id } = ctx.params;
  const postData = ctx.request.body;

  try {
    const updated = await updateTodo(id, postData);
    if (!updated) {
      ctx.status = 404;
      ctx.body = { success: false, error: "Todo Not Found with that id!" };
      return;
    }
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (e) {
    ctx.status = 500;
    ctx.body = { success: false, error: e.message };
  }
}

/**
 * Delete a todo by ID.
 * @param {Object} ctx\
 * @returns {Promise<void>}
 */
async function deleteOne(ctx) {
  const { id } = ctx.params;
  try {
    const deleted = await deleteTodo(id);
    if (!deleted) {
      ctx.status = 404;
      ctx.body = { success: false, error: "Todo Not Found with that id!" };
      return;
    }
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (e) {
    ctx.status = 500;
    ctx.body = { success: false, error: e.message };
  }
}

/**
 * Get all todos show the name list
 * @param {Object} ctx
 */
async function listNameTodo(ctx) {
  try {
    const { limit, order } = ctx.query;
    const todos = getListTodo(limit, order);
    await ctx.render("pages/todo", { todos });
  } catch (e) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      error: e.message,
    };
  }
}

/**
 * Bulk action
 * @param {Object} ctx
 */
async function bulkActionTodo(ctx) {
  const postData = JSON.parse(ctx.request.body);
  try {
    await actionTodoes(postData);
    ctx.status = 200;
    ctx.body = { success: true };
  } catch (e) {
    ctx.status = 500;
    ctx.body = { success: false, error: e.message };
  }
}

export { getTodoes, getTodo, save, update, deleteOne, listNameTodo, bulkActionTodo };
