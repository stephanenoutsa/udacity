import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { SaveArtworkRequest } from "../../requests/SaveArtworkRequest";
import { createArtwork } from "../../businessLogic/artworks";
import { getToken } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("create-artwork");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newArtwork: SaveArtworkRequest = JSON.parse(event.body);
      const jwtToken: string = getToken(event.headers.Authorization);

      const newItem = await createArtwork(newArtwork, jwtToken);

      return {
        statusCode: 201,
        body: JSON.stringify({
          newItem
        })
      };
    } catch (e) {
      logger.error("Error: " + e.message);

      return {
        statusCode: 500,
        body: e.message
      };
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
);
