import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({
  region: process.env.AWS_REGION,
});

export const publishImageProcessingJob = async ({ bucket, key, userId }) => {
  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_QUEUE_URL,

    MessageBody: JSON.stringify({
      bucket,
      key,
      userId,
    }),
  });

  await sqs.send(command);
};
