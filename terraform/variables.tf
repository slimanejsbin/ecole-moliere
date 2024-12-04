variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-1"
}

variable "environment" {
  description = "Environment (staging/production)"
  type        = string
}

variable "domain_name" {
  description = "Main domain name"
  type        = string
  default     = "ecole-moliere.com"
}

variable "certificate_arn" {
  description = "ARN of the SSL certificate in ACM"
  type        = string
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID"
  type        = string
}

variable "ecr_repository_url" {
  description = "ECR repository URL"
  type        = string
}

variable "backend_cpu" {
  description = "CPU units for backend tasks"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Memory for backend tasks (MB)"
  type        = number
  default     = 512
}

variable "backend_count" {
  description = "Number of backend tasks"
  type        = number
  default     = 2
}

variable "db_username" {
  description = "Database master username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}

locals {
  common_tags = {
    Project     = "École Molière"
    Environment = var.environment
    Terraform   = "true"
  }
}
