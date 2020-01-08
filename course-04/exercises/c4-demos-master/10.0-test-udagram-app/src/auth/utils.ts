import { decode } from 'jsonwebtoken'

import { JwtToken } from './JwtToken'

/**
 * Parse a JWT token and return a user ID
 *
 * @param jwtToken JWT token to parse
 *
 * @return User ID from the JWT token
 */
export const getUserId = (jwtToken: string): string => {
  const decodedJwt = decode(jwtToken) as JwtToken

  return decodedJwt.sub
}
