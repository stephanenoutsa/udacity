import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId, getToken } from '../auth/utils'

const todoAccess = new TodoAccess()

export const getAllTodos = async (): Promise<TodoItem[]> => {
  return todoAccess.getAllTodos()
}

export const createTodo = async (
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> => {
  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    todoId: itemId,
    userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    createdAt: new Date().toISOString()
  })
}

export const updateTodo = async (
  todoId: string,
  updateTodoRequest: UpdateTodoRequest,
  jwtToken: string
): Promise<TodoItem> => {
  const userId = parseUserId(jwtToken)

  return await todoAccess.updateTodo({
    todoId,
    userId,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done,
    createdAt: new Date().toISOString()
  })
}

export const deleteTodo = async (
  todoId: string,
  jwtToken: string
): Promise<string> => {
  const userId = parseUserId(jwtToken)

  return await todoAccess.deleteTodo(todoId, userId)
}

export const generateUploadUrl = async (todoId: string): Promise<string> => {
  return await todoAccess.generateUploadUrl(todoId)
}
