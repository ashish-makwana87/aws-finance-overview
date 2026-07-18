import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

let cachedSecrets = null;

export const loadSecrets = async () => {
  
 // Prevent repeated calls during warm invocations
  if (cachedSecrets) {
    return cachedSecrets;
  }
  
   if (!process.env.SECRET_NAME) {
    throw new Error("SECRET_NAME environment variable is missing.");
  }

  try {
   const command = new GetSecretValueCommand({
    SecretId: process.env.SECRET_NAME,
  });

  const response = await client.send(command);

  cachedSecrets = JSON.parse(response.SecretString);

  return cachedSecrets;
  } catch (error) {
    console.error("Failed to load secrets from AWS Secrets Manager", {
      secretName: process.env.SECRET_NAME,
      message: error.message,
      stack: error.stack,
    });

    throw error;
  }
};

export const getSecrets = () => {

  if (!cachedSecrets) {
    throw new Error(
      "Secrets have not been loaded. Call loadSecrets() before using getSecrets().",
    );
  }

  return cachedSecrets;
};