const AWS = require("aws-sdk");
const AWSXRay = require("aws-xray-sdk");
import { DocumentClient } from "aws-sdk/clients/dynamodb";

import { createLogger } from "../utils/logger";
import { Artwork } from "../models/Artwork";

const logger = createLogger("artwork-access");

const XAWS = AWSXRay.captureAWS(AWS);

export class ArtworkAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({ signatureVersion: "v4" }),
    private readonly artworksTable = process.env.ARTWORKS_TABLE,
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly indexName = process.env.USER_ID_INDEX
  ) {
    //
  }

  async getAllArtworks(userId: string): Promise<Artwork[]> {
    logger.info("Getting all artwork items");

    const result = await this.docClient
      .query({
        TableName: this.artworksTable,
        IndexName: this.indexName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        },
        ScanIndexForward: false
      })
      .promise();

    const items = result.Items;

    return items as Artwork[];
  }

  async createArtwork(artwork: Artwork): Promise<Artwork> {
    logger.info(`Creating an artwork with ID ${artwork.artworkId}`);

    const newItem = {
      ...artwork,
      attachmentUrl: `https://${this.bucketName}.s3.amazonaws.com/${artwork.artworkId}`
    };

    await this.docClient
      .put({
        TableName: this.artworksTable,
        Item: newItem
      })
      .promise();

    return artwork;
  }

  async updateArtwork(artwork: Artwork): Promise<Artwork> {
    logger.info(`Updating an artwork with ID ${artwork.artworkId}`);

    const updateExpression = "set title = :title, description = :description";

    await this.docClient
      .update({
        TableName: this.artworksTable,
        Key: {
          userId: artwork.userId,
          artworkId: artwork.artworkId
        },
        UpdateExpression: updateExpression,
        ConditionExpression: "artworkId = :artworkId",
        ExpressionAttributeValues: {
          ":title": artwork.title,
          ":description": artwork.description,
          ":artworkId": artwork.artworkId
        },
        ReturnValues: "UPDATED_NEW"
      })
      .promise();

    return artwork;
  }

  async deleteArtwork(artworkId: string, userId: string): Promise<string> {
    logger.info(`Deleting an artwork with ID ${artworkId}`);

    await this.docClient
      .delete({
        TableName: this.artworksTable,
        Key: {
          userId,
          artworkId
        },
        ConditionExpression: "artworkId = :artworkId",
        ExpressionAttributeValues: {
          ":artworkId": artworkId
        }
      })
      .promise();

    return userId;
  }

  async generateUploadUrl(artworkId: string): Promise<string> {
    logger.info("Generating upload Url");

    return this.s3.getSignedUrl("putObject", {
      Bucket: this.bucketName,
      Key: artworkId,
      Expires: parseInt(this.urlExpiration)
    });
  }
}

const createDynamoDBClient = () => {
  if (process.env.IS_OFFLINE) {
    logger.info("Creating a local DynamoDB instance");

    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000"
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
};
