# CI/CD Pipeline Documentation

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipeline setup for the project.

## Overview

The project uses GitHub Actions for automated testing, building, and deployment with a blue-green deployment strategy. There are three main environments:

- Development (develop branch)
- Staging (staging branch)
- Production (master branch)

## Required Secrets and Variables

### GitHub Secrets

1. **AWS Credentials**

   - `AWS_ACCESS_KEY_ID`: AWS access key
   - `AWS_SECRET_ACCESS_KEY`: AWS secret key
   - `SSH_PRIVATE_KEY`: SSH key pair for EC2 access

2. **Docker Hub**

   - `DOCKERHUB_USERNAME`: Docker Hub username
   - `DOCKERHUB_PASSWORD`: Docker Hub password

3. **Frontend Authentication**
   - `GOOGLE_CLIENT_ID`: Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
   - `NEXTAUTH_SECRET`: NextAuth secret key

### GitHub Variables

1. **AWS Resource Tags**
   - `TAGS`: JSON array of AWS resource tags
   ```json
   [
     { "Key": "ApplicationName", "Value": "Search Engine" },
     { "Key": "Purpose", "Value": "Learning" },
     { "Key": "Project", "Value": "Search Engine" },
     { "Key": "Creator", "Value": "VectorNguyen" }
   ]
   ```

## Pipeline Workflows

### 1. Development Pipeline

**File:** [development_pipeline.yml](development_pipeline.yml)

- **Trigger:** Push to `develop` branch
- **Jobs:**
  - Run code quality checks (ruff)
  - Run unit tests
  - Build Docker images

### 2. Staging Pipeline

**File:** [staging_pipeline.yml](staging_pipeline.yml)

- **Trigger:** Push to `staging` branch
- **Jobs:**
  - Run CI checks
  - Deploy to staging environment
  - Automatic rollback on failure

### 3. Production Pipeline

**File:** [production_pipeline.yml](production_pipeline.yml)

- **Trigger:** Pull request to `master` branch
- **Jobs:**
  - Run CI checks
  - Deploy to production environment
  - Automatic rollback on failure

## Deployment Process (CD Pipeline)

The CD pipeline implements blue-green deployment using AWS infrastructure:

1. **Infrastructure Creation**

   - Creates VPC, subnets, security groups
   - Launches EC2 instance
   - Sets up Application Load Balancer
   - Configures SSL certificate

2. **Application Deployment**

   - Builds and pushes Docker images
   - Configures EC2 instance using Ansible
   - Deploys applications using Docker Compose

3. **Traffic Switch**

   - Performs health checks
   - Updates Route53 DNS records
   - Switches traffic to new environment

4. **Cleanup**
   - Removes old infrastructure after successful deployment

## Rollback Process

The rollback workflow ([rollback.yml](rollback.yml)) is triggered automatically if deployment fails:

1. Identifies failed deployment stack
2. Removes newly created infrastructure
3. Traffic remains routed to previous stable environment

## Infrastructure as Code

The infrastructure is defined using AWS CloudFormation:

- **Template:** [server.yml](cloudformations/server.yml)
- **Parameters:** Configurable via pipeline inputs
- **Resources:**
  - VPC and networking components
  - EC2 instances
  - Load balancer
  - SSL certificate
  - DNS configuration

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [Blue-Green Deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
