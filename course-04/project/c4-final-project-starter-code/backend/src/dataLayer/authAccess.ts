import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

export class AuthAccess {
  constructor(private readonly client = new XAWS.SecretsManager()) {
    //
  }

  async getSecret(): Promise<string> {
    const data = await this.client.getSecretValue({
      SecretId: process.env.AUTH_0_SECRET_ID
    }).promise()

    return JSON.parse(data.SecretSting)
  }
}