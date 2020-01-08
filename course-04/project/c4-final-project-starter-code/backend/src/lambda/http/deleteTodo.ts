import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getToken } from '../../auth/utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    const jwtToken: string = getToken(event.headers.Authorization)

    try {
      await deleteTodo(todoId, jwtToken)

      return {
        statusCode: 200,
        body: ''
      }
    } catch (e) {
      return {
        statusCode: 500,
        body: 'An error occurred in our server. Please try again later'
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
