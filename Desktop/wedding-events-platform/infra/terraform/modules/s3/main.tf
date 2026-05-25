variable "bucket_name" { type = string }
resource "aws_s3_bucket" "web" { bucket = var.bucket_name }
resource "aws_s3_bucket_public_access_block" "web" {
  bucket = aws_s3_bucket.web.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}
output "bucket_id" { value = aws_s3_bucket.web.id }
output "bucket_regional_domain_name" { value = aws_s3_bucket.web.bucket_regional_domain_name }
