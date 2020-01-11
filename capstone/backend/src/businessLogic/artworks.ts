import * as uuid from "uuid";

import { Artwork } from "../models/Artwork";
import { ArtworkAccess } from "../dataLayer/artworkAccess";
import { SaveArtworkRequest } from "../requests/SaveArtworkRequest";
import { parseUserId } from "../auth/utils";
import { createLogger } from "../utils/logger";

const artworkAccess = new ArtworkAccess();

const logger = createLogger("artworks");

export const getAllArtworks = async (jwtToken: string): Promise<Artwork[]> => {
  logger.info("In getAllArtworks() function");

  const userId = parseUserId(jwtToken);

  return await artworkAccess.getAllArtworks(userId);
};

export const createArtwork = async (
  saveArtworkRequest: SaveArtworkRequest,
  jwtToken: string
): Promise<Artwork> => {
  logger.info("In createArtwork() function");

  const itemId = uuid.v4();
  const userId = parseUserId(jwtToken);

  return await artworkAccess.createArtwork({
    artworkId: itemId,
    userId,
    title: saveArtworkRequest.title,
    description: saveArtworkRequest.description,
    createdAt: new Date().toISOString()
  });
};

export const updateArtwork = async (
  artworkId: string,
  saveArtworkRequest: SaveArtworkRequest,
  jwtToken: string
): Promise<Artwork> => {
  logger.info("In updateArtwork() function");

  const userId = parseUserId(jwtToken);
  logger.info("User Id: " + userId);

  return await artworkAccess.updateArtwork({
    artworkId,
    userId,
    title: saveArtworkRequest.title,
    description: saveArtworkRequest.description
  });
};

export const deleteArtwork = async (
  artworkId: string,
  jwtToken: string
): Promise<string> => {
  logger.info("In deleteArtwork() function");

  const userId = parseUserId(jwtToken);
  logger.info("User Id: " + userId);

  return await artworkAccess.deleteArtwork(artworkId, userId);
};

export const generateUploadUrl = async (artworkId: string): Promise<string> => {
  logger.info("In generateUploadUrl() function");

  return await artworkAccess.generateUploadUrl(artworkId);
};
