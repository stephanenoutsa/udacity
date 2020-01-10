import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'
import { getToken } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('update-todo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.todoId
      const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

      const jwtToken: string = getToken(event.headers.Authorization)

      await updateTodo(todoId, updatedTodo, jwtToken)

      return {
        statusCode: 200,
        body: ''
      }
    } catch (e) {
      logger.error('Error', { error: e.message })

      return {
        statusCode: 500,
        body: e.message
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
