import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { SaveArtworkRequest } from "../../requests/SaveArtworkRequest";
import { updateArtwork } from "../../businessLogic/artworks";
import { getToken } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("update-artwork");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const artworkId = event.pathParameters.artworkId;
      const updatedArtwork: SaveArtworkRequest = JSON.parse(event.body);

      const jwtToken: string = getToken(event.headers.Authorization);

      await updateArtwork(artworkId, updatedArtwork, jwtToken);

      return {
        statusCode: 200,
        body: ""
      };
    } catch (e) {
      logger.error("Error", { error: e.message });

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
