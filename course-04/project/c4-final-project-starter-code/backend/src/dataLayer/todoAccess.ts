import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
  ) {
    //
  }

  async getAllTodos(): Promise<TodoItem[]> {
    console.log('Getting all todo items')

    const result = await this.docClient
      .scan({
        TableName: this.todosTable
      })
      .promise()

    const items = result.Items

    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    console.log(`Creating a todo with ID ${todo.todoId}`)

    const newItem = {
      ...todo,
      attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${todo.todoId}`
    }

    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: newItem
      })
      .promise()

    return todo
  }

  async updateTodo(todo: TodoItem): Promise<TodoItem> {
    console.log(`Updating a todo with ID ${todo.todoId}`)

    const updateExpression =
      'set name = :name, dueDate = :dueDate, done = :done'

    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId: todo.todoId
        },
        UpdateExpression: updateExpression,
        ConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':name': todo.name,
          ':dueDate': todo.dueDate,
          ':done': todo.done,
          ':userId': todo.userId
        },
        ReturnValues: 'UPDATED_NEW'
      })
      .promise()

    return todo
  }

  async deleteTodo(todoId: string, userId: string): Promise<string> {
    console.log(`Deleting a todo with ID ${todoId}`)

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId: todoId
        },
        ConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return todoId
  }

  async generateUploadUrl(todoId: string): Promise<string> {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: todoId,
      Expires: this.urlExpiration
    })
  }
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')

    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
