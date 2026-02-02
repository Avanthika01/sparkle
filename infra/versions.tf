terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Local backend - state stored on your machine
  # For production, use S3 + DynamoDB for team collaboration
  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "sparkle-todo"
      Environment = "demo"
      ManagedBy   = "terraform"
    }
  }
}
