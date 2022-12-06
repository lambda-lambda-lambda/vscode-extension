# {{appName}}

{{appDescription}}

## Dependencies

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org)

### VS Code extensions

- [Remote-Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Running your app

In the VS Code _Command Palette_ choose "Open Folder in Container" which will launch your application in a Docker container allowing for realtime development and testing.  Once launched, the application can be accessed at - [http://localhost:3000{{appPrefix}}](http://localhost:3000{{appPrefix}})

## Deploying to AWS

    $ ./deploy

## AWS requirements

In order to successfully deploy your application you must have [set-up your AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/gs-cli.html) and have [created an IAM user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html) with the following [policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_manage.html):

- [IAMFullAccess](https://console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FIAMFullAccess)
- [CloudFrontFullAccess](https://console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FCloudFrontFullAccess)
- [AWSCloudFormationFullAccess](https://console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAWSCloudFormationFullAccess)
- [AWSLambda_FullAccess](https://console.aws.amazon.com/iam/home#/policies/arn%3Aaws%3Aiam%3A%3Aaws%3Apolicy%2FAWSLambda_FullAccess)

WARNING: The policies above are provided to ensure a successful application deployment.  It is recommended that you adjust these policies to meet the security requirements of your Lambda application.  They should NOT be used in a Production environment.

### Mounting the AWS configuration

In order to deploy from within the container using [VS Code terminal](https://code.visualstudio.com/docs/terminal/basics) you will need to enable* the following line in: `.devcontainer/devcontainer.json`

```json
"mounts": ["source=${localEnv:HOME}/.aws,target=/root/.aws,type=bind,consistency=cached"],
```

(*) Requires container rebuild.

## Developers

### CLI options

Run [ESLint](https://eslint.org/) on project sources:

    $ npm run lint

Generate documentation using [JSDoc](https://jsdoc.app):

    $ npm run gendoc

## References

- [Setting IAM Permissions and Roles](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-permissions.html)
- [lambda-lambda-lambda](https://github.com/nuxy/lambda-lambda-lambda)
