import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import uuid from 'uuid'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const docClient = new AWS.DynamoDB.DocumentClient()

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION)

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event:', event)

    const groupId = event.pathParameters.groupId

    const validGroupId = await groupExists(groupId)

    if (!validGroupId) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: 'Group does not exist'
        })
      }
    }

    const imageId = uuid.v4()

    const parsedBody = JSON.parse(event.body)

    const newItem = {
      groupId,
      imageId,
      ...parsedBody,
      imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`,
      timestamp: new Date().toISOString()
    }

    await docClient
      .put({
        TableName: imagesTable,
        Item: newItem
      })
      .promise()

    const uploadUrl = await getUploadUrl(imageId)

    return {
      statusCode: 201,
      body: JSON.stringify({
        newItem,
        uploadUrl
      })
    }
  }
)

const groupExists = async (groupId: string) => {
  const result = await docClient
    .get({
      TableName: groupsTable,
      Key: {
        id: groupId
      }
    })
    .promise()

  console.log('Group:', result)

  return !!result.Item
}

const getUploadUrl = async (imageId: string) => {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}

handler.use(
  cors({
    credentials: true
  })
)
