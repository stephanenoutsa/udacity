import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
// import { AuthAccess } from '../../dataLayer/authAccess'

const logger = createLogger('auth')

const jwksUrl = 'https://dev-nip0kv-e.auth0.com/.well-known/jwks.json'

// const authAccess = new AuthAccess()

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)

  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

const verifyToken = async (authHeader: string): Promise<JwtPayload> => {
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt

  const alg = jwt.header.alg
  const kid = jwt.header.kid

  // Retrieve JWKS
  const jwks = await Axios.get(jwksUrl)
  const jwk = jwks[0]

  if (kid !== jwk.kid) throw new Error('Key mismatch')

  const cert = jwk.x5c[0]

  // const secretObject = await authAccess.getSecret()
  // const secret = secretObject[process.env.AUTH_0_SECRET_FIELD]

  return verify(token, cert, { algorithms: [alg] }) as JwtPayload
}

const getToken = (authHeader: string): string => {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}
