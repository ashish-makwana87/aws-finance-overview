data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/.."
  output_path = "${path.module}/build/lambda.zip"

  excludes = [
    "layer/*",
    ".git/*",
    ".github/*",
    ".vscode/*",
    "terraform/*",
    "tests/*",
    "docs/*",
    ".serverless/*",
    "*.tfstate",
    "*.tfstate.backup",
    ".terraform/*",
    ".terraform.lock.hcl",
    "README.md",
    ".env",
    "jest.config.js",
    "jsconfig.json",
    "test-invoke.js",
    "package-lock.json",
    ".gitignore"
  ]
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
      MONGODB_URI = var.mongodb_uri
      DB_NAME     = var.db_name
      JWT_EXP     = var.jwt_exp

      AVATAR_BUCKET       = data.aws_s3_bucket.avatar_bucket.bucket
      CLOUDFRONT_URL      = var.cloudfront_url
      SQS_QUEUE_URL       = var.sqs_queue_url
      PROFILE_CACHE_TABLE = var.profile_cache_table

      STORAGE_PROVIDER     = var.storage_provider
      AVATAR_MAX_SIZE_MB   = var.avatar_max_size_mb
      AVATAR_ALLOWED_TYPES = var.avatar_allowed_types

      SECRET_NAME = "aws-serverless-project/dev"
    }
  }

  tags = local.common_tags
}


resource "aws_lambda_function" "image_resize" {

  function_name = "${var.service_name}-${var.environment}-imageResize"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  role = aws_iam_role.lambda_role.arn

  handler = "src/functions/imageResizeHandler.handler"

  runtime = "nodejs22.x"

  layers = [aws_lambda_layer_version.sharp_layer.arn]

  timeout = 6

  memory_size = 1024

  environment {
    variables = {
      MONGODB_URI = var.mongodb_uri
      DB_NAME     = var.db_name
      JWT_EXP     = var.jwt_exp

      AVATAR_BUCKET       = data.aws_s3_bucket.avatar_bucket.bucket
      CLOUDFRONT_URL      = var.cloudfront_url
      SQS_QUEUE_URL       = var.sqs_queue_url
      PROFILE_CACHE_TABLE = var.profile_cache_table

      STORAGE_PROVIDER     = var.storage_provider
      AVATAR_MAX_SIZE_MB   = var.avatar_max_size_mb
      AVATAR_ALLOWED_TYPES = var.avatar_allowed_types

      SECRET_NAME = "aws-serverless-project/dev"
    }
  }

  tags = local.common_tags
}

data "archive_file" "sharp_layer" {
  type        = "zip"
  source_dir  = "${path.module}/../layer"
  output_path = "${path.module}/sharp-layer.zip"

  excludes = [
    "nodejs/node_modules/.bin/*"
  ]
}

resource "aws_lambda_layer_version" "sharp_layer" {
  layer_name          = "sharp"
  filename            = data.archive_file.sharp_layer.output_path
  source_code_hash    = data.archive_file.sharp_layer.output_base64sha256
  compatible_runtimes = ["nodejs22.x"]

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lambda_event_source_mapping" "image_resize_sqs" {
  event_source_arn = data.aws_sqs_queue.avatar_processing.arn
  function_name    = aws_lambda_function.image_resize.arn
  batch_size       = 1
  enabled          = true
}