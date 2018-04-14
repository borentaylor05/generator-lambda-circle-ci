# <%= name %> - An AWS Lambda function with built in CI/CD pipeline

### What this is
  - A way to automate deployment of a single AWS lambda function
  - A baseline for leveraging Lambda versioning and aliases to deploy functions to DEV, STAGE, and PROD environments
  - A simple starting point that includes baked in linter and test config

### What this is not
  - A robust framework for deploying multiple Lambdas or other AWS resources
  - Does not attach triggers for you. Triggers will have to be manually configured through the AWS interface.
  - If you are looking for more robust solutions, try the [Serverless Framework](https://serverless.com/) or the [Serverless Application Model](https://github.com/awslabs/serverless-application-model)

# Requirements
  - [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed on your machine
  - An IAM role ARN that will be assigned to the Lambda function. If you didn't set it via the generator prompts, add it to `./config.js`.
  - Github or Bitbucket account
  - A [CircleCI Account](https://circleci.com/) (has a free tier)
    - You will also need to create a CircleCI IAM user and assign it the proper roles
    - The user will need programmatic access to run AWS cli commands
    - You will need to add this user's AWS Credentials through the CircleCI interface
    - The minimum policy for the user is:
      ```json
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "VisualEditor0",
              "Effect": "Allow",
              "Action": [
                "lambda:UpdateFunctionCode",
                "lambda:UpdateAlias"
              ],
              "Resource": "*"
            }
          ]
        }
      ```

# Getting Started
 - Run: `npm install`
 - Run: `npm run function:create`
    - Creates a new AWS Lambda function using the `nodejs8.10` runtime 
    - Create DEV, STAGE, and PROD aliases

# Deployment
  - Deployment is managed by CircleCI. See `.circleci/config.yml`.
    - Runs linter
    - Runs unit tests
    - If both pass, deploys to proper alias
    - If deployment succeeds, CircleCI runs your integration tests against the new version
  - Any commit to master gets deployed to STAGE alias
  - Any commit to another branch gets deployed to DEV alias
  - PROD deployment is manual with `npm run function:promote:prod`. This will point the prod alias to the version currently on STAGE

# Project Structure

### `.circleci/`
Contains CircleCI config responsible for CI/CD

### `dev/`
A simple web server for running integration tests locally. Will need to update endpoint to be relevant to your project. `dev/events/` contains mock event JSON relevant to your function. I included a mock API Gateway proxy event, but you can use whatever your function needs.

### `lib/`
All code used in the function belongs here. `/lib/handler` will contain the handler for your Lambda. All unit tests will be run against `lib/tests/**/*.test.js`.

### `scripts/`
These are the `npm` scripts leveraging the AWS SDK to deploy / publish your function.

### `tests/`
Any non-unit tests should be housed here. Currently setup for integration tests using `frisby.js`

### `.eslintrc`
Custom eslint file based on the Airbnb config

### `index.js`
Should not need any changes. This just uses the function exported by `lib/handler.js`.



