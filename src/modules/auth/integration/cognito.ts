import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { config } from '@/config/secret';

const credentials = fromCognitoIdentityPool({
  identityPoolId: config.IDENTITY_POOL_ID,
});

const client = new CognitoIdentityProviderClient({
  region: config.AWS_REGION,
  credentials,
});

export async function signUpUser(
  username: string,
  email: string,
  password: string,
) {
  const signUpCommand = new SignUpCommand({
    ClientId: config.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [{ Name: 'email', Value: email }],
  });

  try {
    const signUpResponse = await client.send(signUpCommand);
    return signUpResponse;
  } catch (err) {
    console.log('[User Sign-up]', err);
    throw err;
  }
}
