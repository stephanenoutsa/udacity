import { SNSHandler, SNSEvent, S3EventRecord } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import Jimp from 'jimp/es'

const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

const imagesBucketName = process.env.IMAGES_S3_BUCKET
const thumbnailsBucketName = process.env.THUMBNAILS_S3_BUCKET

export const handler: SNSHandler = async (event: SNSEvent) => {
  console.log('Processing SNS event:', JSON.stringify(event))

  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message

    console.log('Processing S3 event:', s3EventStr)

    const s3Event = JSON.parse(s3EventStr)

    for (const record of s3Event.Records) {
      // "record" is an instance of S3EventRecord
      await processImage(record)
    }
  }
}

const processImage = async (record: S3EventRecord) => {
  const key = record.s3.object.key

  // Download image with specified key from images bucket
  const response = await s3
    .getObject({
      Bucket: imagesBucketName,
      Key: key
    })
    .promise()

  const body: Buffer = response.Body

  // Read the image with the Jimp library
  const image = await Jimp.read(body)

  // Resize the image maintaining the ratio between the image's width and height
  image.resize(150, Jimp.AUTO)

  // Convert the image to a buffer that we can write to a different bucket
  const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)

  // Write image to thumbnails bucket
  await s3
    .putObject({
      Bucket: thumbnailsBucketName,
      Key: `${key}.jpeg`,
      Body: convertedBuffer
    })
    .promise()
}
