import "source-map-support/register";

import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";

import { getAllArtworks } from "../../businessLogic/artworks";
import { getToken } from "../../auth/utils";
import { createLogger } from "../../utils/logger";

const logger = createLogger("get-artworks");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event:", event);

    try {
      const jwtToken: string = getToken(event.headers.Authorization);

      const artworks = await getAllArtworks(jwtToken);

      return {
        statusCode: 200,
        body: JSON.stringify({
          items: artworks
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
