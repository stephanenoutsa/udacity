import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJb49/3y3ZqTH9MA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmRldi1uaXAwa3YtZS5hdXRoMC5jb20wHhcNMjAwMTA1MTQwNTA0WhcNMzMw
OTEzMTQwNTA0WjAhMR8wHQYDVQQDExZkZXYtbmlwMGt2LWUuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApCRqZVrlKKNJAE9HXM0P23OX
+39n+OujsTSRJej5OB1fS6l+gYRyivOyx5c7gG/rVEznZEUz+2E87ExWWosq5VL/
A6UHnKbPETqMXEtgy2cCwsf543XFdXTpvSIWPEfP0X0vuiq/d8YYYrmSJ4VTWKwk
jc/Gywfgji8KPqlhJI+zdWTWIGFWkGBB7mfTvUiepo02HwbAdJlGnHr0bf7ab8OZ
KdBoXKRhP6DPmv1oivda9EkklVpSZjqKFEkqWE3T34T6PwaA093nckG+GBcOCX1Q
Z1rzDiBu+ysCaY3u7tXTwoWZMktfm9SYa24T5bC9v+rnTe2S6b9aCFKo6gyxhwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBT179Yp2UVrXUs9vOp9
OTM7X4L13DAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAJd+YVXE
KmVX+YFijYz+3hiRMM9dmz/ZbNG2YvnYJFjzErz+L0tcup1V4Qk+jq2a2w4wv4Qv
QseTCu5CAcncmN0PpreeShnz/gg7bevh9H1VlC70E/qvN5I9i2nqBWcQJM2nheAQ
Hu6QRUFh7YdCXIoMGB5AnARvLD69y25i6q0Ma8xURS3AKvzNV2+fWy+iush6QgI+
DjuUb1jyEQ9286Tq4BMhadiuN6Y0rPlDbz2bqQWbsxytsbLqdAD0ku1glwvdbxdU
im+lDYIQRNitLzBIlI7Y9ArYP+NQOI2APRH5v2+RMOk2V+ZgUP1Ojqh//5U0wimT
SFQoS2TSGt2eSq4=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = verifyToken(event.authorizationToken)

    console.log('User was authorized')

    return {
      principalId: decodedToken.sub,
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
    console.log('User was not authorized', e.message)

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

const verifyToken = (authHeader: string): JwtToken => {
  if (!authHeader) throw new Error('No authorization header')

  if (!authHeader.toLocaleLowerCase().startsWith('bearer '))
    throw new Error('Invalid authorization header')

  const authHeaderArray = authHeader.split(' ')
  const token = authHeaderArray[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
