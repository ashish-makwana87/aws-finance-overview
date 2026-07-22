data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda/lambda.zip"
}

resource "aws_lambda_function" "api_lambda" {

  function_name = "${var.service_name}-${var.environment}-apiLambda"
  
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  role = aws_iam_role.lambda_role.arn

  handler = "src/api/handler.handler"

  runtime = "nodejs22.x"

  timeout = 6

  memory_size = 1024

  environment {
  variables = {
    MONGODB_URI         = var.mongodb_uri
    DB_NAME             = var.db_name
    JWT_EXP             = var.jwt_exp

    AVATAR_BUCKET       = data.aws_s3_bucket.avatar_bucket.bucket
    CLOUDFRONT_URL      = var.cloudfront_url
    SQS_QUEUE_URL       = var.sqs_queue_url
    PROFILE_CACHE_TABLE = var.profile_cache_table

    STORAGE_PROVIDER    = var.storage_provider
    AVATAR_MAX_SIZE_MB  = var.avatar_max_size_mb
    AVATAR_ALLOWED_TYPES = var.avatar_allowed_types

    SECRET_NAME = "aws-serverless-project/dev"
  }
}

lifecycle {
  ignore_changes = [
    filename,
    source_code_hash
  ]
}

  tags = local.common_tags
}



