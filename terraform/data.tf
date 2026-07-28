data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

data "aws_sqs_queue" "avatar_processing" {
  name = "avatar-processing-dev"
}