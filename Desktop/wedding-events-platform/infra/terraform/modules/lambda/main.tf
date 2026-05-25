variable "lambda_role_arn" { type = string }
variable "table_name" { type = string }
resource "aws_lambda_function" "api" {
  function_name = "wedding-events-api"
  role          = var.lambda_role_arn
  handler       = "app.handler"
  runtime       = "nodejs20.x"
  filename      = "../../../../apps/api/build/api.zip"
  source_code_hash = filebase64sha256("../../../../apps/api/build/api.zip")
  environment { variables = { WEDDING_EVENTS_TABLE = var.table_name } }
}
output "invoke_arn" { value = aws_lambda_function.api.invoke_arn }
output "function_name" { value = aws_lambda_function.api.function_name }
