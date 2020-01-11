import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { deleteArtwork } from "../../businessLogic/artworks";
import { getToken } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("delete-artwork");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const artworkId = event.pathParameters.artworkId;

    const jwtToken: string = getToken(event.headers.Authorization);

    try {
      await deleteArtwork(artworkId, jwtToken);

      return {
        statusCode: 200,
        body: ""
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
