variable "table_name" { type = string }
resource "aws_dynamodb_table" "wedding_events" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"
  attribute { name = "PK" type = "S" }
  attribute { name = "SK" type = "S" }
  point_in_time_recovery { enabled = true }
}
output "table_name" { value = aws_dynamodb_table.wedding_events.name }
output "table_arn" { value = aws_dynamodb_table.wedding_events.arn }
