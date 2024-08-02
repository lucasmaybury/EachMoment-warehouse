This repo is copied over from the original private repo owned by EachMoment with their permission.

# EachMoment Warehouse App

[Trello board](https://trello.com/b/JpDSWAjy/eachmoment-warehouse-app)

[Dev/Test](https://console.firebase.google.com/project/each-moment-test/overview)

[Prod](https://console.firebase.google.com/project/each-moment-warehouse/overview)

# Structure

The app consists of a React frontend served by Firease Hosting, and a collection of Firebase Cloud Functions, backed by a Firebase Realtime Database. The functions also use Firebase Storage, detailed below.

# Installation

Install firebase CLI with:

```
npm i -g firebase-tools:
```

and login with

```
firebase login
```

# Webapp

## Running the app locally

Create a `.env.test` file in the root dir using the following template.

```
VITE_apiKey=
VITE_authDomain=
VITE_databaseURL=
VITE_projectId=
VITE_storageBucket=
VITE_messagingSenderId=
VITE_appId=
VITE_measurementId=
```

Fill it out with from the values from [here](https://console.firebase.google.com/project/each-moment-test/settings/general/). Alternatively, you can set `VITE_FIREBASE_CONFIG_FULL` to a JSON object containing the whole config in one line.

To install dependencies, run:

```
npm i
```

To run the app in dev mode with hot module reloading, using vite, run:

```
npm run serve
```

This method uses the default database in the `each-moment-test` project.

This is my preferred way to develop the webapp in isolation as it's much faster with Vite's dev server. But if you need to test the webapp in conjunction with the local emulators for any other services: database, functions etc, you can also run the app in the Firebase Emulator:

```
npm run build:watch
```

and

```
npm run dev
```

By default it builds with the `.env.test` env vars, for prod, see the section below.

## ~~Deployment Pipelines~~ (Currently Disabled)

### ~~PR Environments~~

The repo is set up with a GitHub Actions CI/CD pipeline, including a pipeline for building and deploying temporary environment's for each PR. When working on a feature, make a PR and the build agent will leave a comment on the PR with a link to a hosted environment in the `each-moment-test` project.

### ~~Prod Pipeline~~

The project is set up with a CI/CD pipeline with GitHub Actions, so any commits to `main` will a trigger build and deploy to `each-moment-warehouse` project.

All environment variables live in the `GitHub Env-Vars & Secrets` section in the repo settings and are baked into the app at build-time.

## Building locally

### Dev/Test

Refer to previous sections for setting up `.env.test`.

Build for dev/test with:

```
npm run build
```

or

```
npm run build:watch
```

Both build with test env vars by default.

### Prod

You need a `.env.production` file to build for prod locally. Fill it out the same as the dev one, but from [config at this URL](https://console.firebase.google.com/project/each-moment-warehouse/settings/general)

And build to the `dist` directory with:

```
npm run build:prod
```

## Deploying

Both of the following commands build and deploy with prod env vars.

### Dev/Test

```
npm run deploy:test
```

Deploys to `each-moment-test`

### Prod

```
npm run deploy:prod
```

Deploys to `each-moment-warehouse`

# Functions

Working on the functions has a different workflow locally because you can't just run them with a dev server like the webapp.

## Running locally

Start with:

```
cd functions
npm i
```

To build once:

```
npm run build
```

To build then rebuild on changes:

```
npm run build:watch
```

To run the emulator, you should generally be using the `test` firebase project alias.
Switch between the two project aliases with:

```
firebase use [default/test]
```

Then run:

```
firebase emulators:start
```

You'll get a console readout with the local IPs of the various components of the app. There's a Postman Workspace you can use to call the functions with some predefined test data, to simulate webhook calls from Shopify. Ask `sam@eachmoment.co.uk` or `lucasmaybury@gmail.com` for an invite. Navigate to the browser control centre (IP in console) and the database emulator to see the changes the functions are making.

The webhooks handler functions require a hashkey check to authenticate the request. Postman already has two test orders set up with the hashes already generated. If you need to test with any other data, get the correct hash value by un-commenting the console log lines in `middleware.ts` and sending a request via Postman. Then set it to the value for the header `X-Shopify-Hmac-Sha256`. Remember to comment out the lines again before commiting changes.

### Secrets

All secrets are stored in in Google Cloud Secret Manager, regardless of whether you're running locally or in a live environment. For more details, [see the docs here](https://firebase.google.com/docs/functions/config-env).

All the required values should already be there, but if you need to set/update them. The following are required:

`SHOPIFY_WEBHOOK_SECRET`, value [here](https://admin.shopify.com/store/3f215f-2/settings/notifications/webhooks).

`SHOPIFY_ACCESS_TOKEN`, value [here](https://admin.shopify.com/store/3f215f-2/settings/apps/development/120405491713/overview)

`SMTP_USER` and `SMTP_PASS` are stored in 1Password, [ask Sam](mailto:sam@eachmoment.co.uk) for the values or access to 1Password.

`STRIPE_API_KEY`: [ask Sam](mailto:sam@eachmoment.co.uk) for an invite to the Stripe and [go here for the value](https://dashboard.stripe.com/apikeys). Switch between Live and Test in the Stripe Dashboard to get and set the relevant key for our Prod and Test environments. Both Live and Test keys are called `warehouse_app_key` and are restricted with permissions to `write` `invoices` and `customers`

Switch to the project alias you want update and set the secrets with:

```
firebase functions:secrets:set SECRET_NAME
```

### Environment Variables

Config values are set with:

```
firebase functions:config:set servicename.configname=configvalue
```

Currently the only required config value is `shopify.shopname=3f215f-2`

Then deploy to see the changes working.

## Test Environment

### Deploying to test

There currently isn't a pipeline for deploying PRs to a test environment. To test in a hosted environment, you can run:

```
npm run deploy:test
```

The changes are deployed to `each-moment-test` project.

The webhooks in shopify trigger the functions for test as well as prod, so you can either use Postman or make an actual order in Shopfiy to test your changes.

## Deploying to Prod

### Deploying

~~There's a CI/CD pipeline to deploy to the functions to prod too. This runs on pushes to `main`.~~

You can also manually deploy with

```
npm run deploy:prod
```

## Storage Bucket

The funcions require a firebase storage instance to be set up in each project, with the default name of the project, and a folder inside called `invoicePdfs` and `oqrPdfs`.
