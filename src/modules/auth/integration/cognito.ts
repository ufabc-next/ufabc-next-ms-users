import {
  AdminInitiateAuthCommand,
  CognitoIdentityProviderClient,
  DeleteUserCommand,
  GlobalSignOutCommand,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { config } from '@/config/secret';
import { AuthenticationResultType } from 'aws-sdk/clients/cognitoidentityserviceprovider';

const client = new CognitoIdentityProviderClient({
  region: config.AWS_REGION,
  credentials: {
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
  },
});

export async function signUpUser(
  username: string,
  email: string,
  password: string,
) {
  // assuming that password is already hashed
  // and email is already validated
  // Username is the same as the primary key in the user table
  const signUpCommand = new SignUpCommand({
    ClientId: config.COGNITO_CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      { Name: 'email', Value: email },
      // { Name: 'verified_email', Value: 'false' },
    ],
  });

  await client.send(signUpCommand).catch(handleCatch('User Sign-up failed'));
}
export async function signInUser(
  email: string,
  password: string,
): Promise<AuthenticationResultType | undefined> {
  const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    ClientId: config.COGNITO_CLIENT_ID,
    UserPoolId: config.USER_POOL_ID,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
    },
  });
  const response = await client
    .send(adminInitiateAuthCommand)
    .catch(handleCatch('Login failed'));

  return response.AuthenticationResult;
}

export async function signOutUser(AccessToken: string) {
  const globalSignOutCommand = new GlobalSignOutCommand({
    AccessToken,
  });
  await client.send(globalSignOutCommand).catch(handleCatch('Logout failed'));
}

export async function deleteUser(AccessToken: string) {
  const deleteUserCommand = new DeleteUserCommand({
    AccessToken,
  });

  await client.send(deleteUserCommand).catch(handleCatch('Delete failed'));
}

export async function refreshUserSession(
  refreshToken: string,
): Promise<string | undefined> {
  const adminInitiateAuthCommand = new AdminInitiateAuthCommand({
    AuthFlow: 'REFRESH_TOKEN_AUTH',
    ClientId: config.COGNITO_CLIENT_ID,
    UserPoolId: config.USER_POOL_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });

  const response = await client
    .send(adminInitiateAuthCommand)
    .catch(handleCatch('Refresh failed'));

  return response.AuthenticationResult?.AccessToken;
}

function handleCatch(message: string) {
  return (cause: any) => {
    if (cause.message === 'Access Token has expired')
      throw new Error('Access Token has expired');
    if (cause.message === 'Refresh Token has expired')
      throw new Error('Refresh Token has expired');
    throw new Error(message + cause.message);
  };
}
