variable "s3_bucket_domain" { type = string }
variable "s3_bucket_id" { type = string }
resource "aws_cloudfront_distribution" "web" {
  enabled = true
  origin { domain_name = var.s3_bucket_domain origin_id = var.s3_bucket_id }
  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    target_origin_id = var.s3_bucket_id
    viewer_protocol_policy = "redirect-to-https"
    forwarded_values { query_string = false cookies { forward = "none" } }
  }
  restrictions { geo_restriction { restriction_type = "none" } }
  viewer_certificate { cloudfront_default_certificate = true }
}
output "domain_name" { value = aws_cloudfront_distribution.web.domain_name }
