terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

provider "aws" { region = var.aws_region }

module "dynamodb" {
  source     = "../../modules/dynamodb"
  table_name = var.table_name
}

module "s3" {
  source      = "../../modules/s3"
  bucket_name = var.web_bucket_name
}

module "cloudfront" {
  source              = "../../modules/cloudfront"
  s3_bucket_domain    = module.s3.bucket_regional_domain_name
  s3_bucket_id        = module.s3.bucket_id
}

module "cognito" { source = "../../modules/cognito" }
module "ses" { source = "../../modules/ses" }
module "iam" { source = "../../modules/iam" table_arn = module.dynamodb.table_arn }
module "lambda" { source = "../../modules/lambda" lambda_role_arn = module.iam.lambda_role_arn table_name = var.table_name }
module "api_gateway" { source = "../../modules/api-gateway" lambda_invoke_arn = module.lambda.invoke_arn lambda_function_name = module.lambda.function_name }
