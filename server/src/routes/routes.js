import Router from 'koa-router';
import * as todoHandler from '../handlers/todo/todoHandlers.js';
import todoInputMiddleware from '../middleware/todoInputMiddleware.js';

const router = new Router();

router.get('/todos', todoHandler.listNameTodo);
router.get('/api/todos', todoHandler.getTodoes);
router.get('/api/todos/:id', todoHandler.getTodo);
router.post('/api/todos', todoHandler.save);
router.post('/api/todos/all', todoHandler.bulkActionTodo);
router.put('/api/todos/:id', todoHandler.update);
router.delete('/api/todos/:id', todoHandler.deleteOne);

export default router;
