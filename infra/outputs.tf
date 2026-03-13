output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name (e.g. xxxx.cloudfront.net)"
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.s3_distribution.id
}

output "website_bucket_name" {
  description = "S3 bucket name for website content"
  value       = aws_s3_bucket.website.id
}
