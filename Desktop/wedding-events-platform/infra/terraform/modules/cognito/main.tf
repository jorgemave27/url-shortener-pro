resource "aws_cognito_user_pool" "admin" { name = "wedding-events-admin" }
resource "aws_cognito_user_pool_client" "admin" {
  name = "wedding-events-admin-client"
  user_pool_id = aws_cognito_user_pool.admin.id
  generate_secret = false
}
output "user_pool_id" { value = aws_cognito_user_pool.admin.id }
