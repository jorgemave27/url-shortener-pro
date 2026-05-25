variable "lambda_invoke_arn" { type = string }
variable "lambda_function_name" { type = string }
resource "aws_apigatewayv2_api" "http" { name = "wedding-events-api" protocol_type = "HTTP" }
resource "aws_apigatewayv2_integration" "lambda" {
  api_id = aws_apigatewayv2_api.http.id
  integration_type = "AWS_PROXY"
  integration_uri = var.lambda_invoke_arn
}
resource "aws_apigatewayv2_route" "proxy" {
  api_id = aws_apigatewayv2_api.http.id
  route_key = "ANY /{proxy+}"
  target = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}
resource "aws_apigatewayv2_stage" "default" { api_id = aws_apigatewayv2_api.http.id name = "$default" auto_deploy = true }
resource "aws_lambda_permission" "api_gateway" {
  statement_id = "AllowExecutionFromAPIGateway"
  action = "lambda:InvokeFunction"
  function_name = var.lambda_function_name
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}
output "api_endpoint" { value = aws_apigatewayv2_api.http.api_endpoint }
