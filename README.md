# GraphQL API

## Spin up Dev Environment

```sh
vagrant up
vagrant ssh
```

The Application is located in `/var/www`.

Run the server in development mode.

```sh
npm run dev
```

While in development mode the app will listen for changes and reload automatically.

## Automated Deployment

Enter the appropriate values into the `.env` for AWS IAM access and ECR. Once those are in place, run the npm command to deploy:

`npm run deploy`

This process will run the steps below, but should it fail you may need to do them manually to debug. Once this has finished, move on to **Step 4** below to finalize the deployment in the container environment.

## Manual Deployment

### Step 1 - setup personal AWS credentials

Run `aws configure` and enter in your personal Access Key and Secret Key. This sets up authentication to receive a temporary access token (requried by MFA).

### Step 2 - temporary access credentials
To deploy the app to AWS Container service, you must first obtain a temporary set of 2FA access credentials. To do this, run the following command:

`aws sts get-session-token --serial-number [your-device-arn-from-iam-mfa-console] --token-code  [valid-generated-auth-token]`

This will produce a JSON object with credentials that need to be exported into environment variables like so:

```
export AWS_ACCESS_KEY_ID=[generated-key]
export AWS_SECRET_ACCESS_KEY=[generated-key]
export AWS_SESSION_TOKEN=[generated-token]
```

> Note: you can run `aws configure` again and enter in the new values, however doing it this way **will retain your permanant credentials**, and only clear the temporary on reboot, so next time you can skip right to the end of this step.

### Step 3 - generate Docker login command
Now that the temporary credentials have been added to the environment, run the following command to generate a Docker Login string that will log you into the AWS Container Registry:

`eval $(aws ecr get-login --no-include-email)`

You should receive confirmation that Docker was successfully logged into the Container Registry.

### Step 3 - build the Docker image, tag it latest, and push to Container Repository.

`docker build -t tf-b2c-graphql .`

`docker tag tf-b2c-graphql:latest [repository-uri]/[repository-name]:latest`

`docker push [repository-uri]/[repository-name]:latest`

### Step 4
Create a new revision of the **ECS Task**, but retain all settings and save. 

## Step 5 
Open up the running cluster and edit the running service. Select the latest revision of the currently running task, and check the `Force Deployment` checkbox, then save. This will kickoff an ECS deployment of the latest pushed Image. When submitted, click `View Service`, then the Deployments tab will show the current deployment spinning down and the new one spinning up. Deployment is complete when the new deployments "Pending" count is zero, and "Running" count is non zero.

## Examples

Here are some example queries which you can use as a starting point when using the playground.

```graphql
query GetRecommendations {
  recommendations (filter: { profileId: "<PROFILE_ID_HERE>" }) {
    _id
    category
    styleId
    rankId
    fitSize { 
      id
      label
      sizeType
    }
  }
  recommendation ( profileId: "<PROFILE_ID_HERE>" ) {
    _id
    category
    styleId
    rankId
    fitSize { 
      id
      label
      sizeType
    }
  }
}
mutation AddRecommendation {
  addRecommendation(input: { 
    profileId: "<PROFILE_ID_HERE>", 
    category: "Tops", 
    styleId: "<STYLE_ID>", 
    rankId: "<RANK_ID>", 
    fitSize: { 
      id: "test-id-123",
      label: "fit-size-label",
      localeCode: "en-US",
      secondLabel: "",
      sizeType: "Regular",
      system: "system-value"
    } 
  }) {
    _id
  }
}
```