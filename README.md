# CrypWatch

You can check site here: https://cryp-watch.web.app

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test -- --watch=false --browsers=ChromeHeadlessCI` to execute the unit tests via [Karma](https://karma-runner.github.io) using the bundled Puppeteer Chromium. This avoids relying on a system Chrome binary and mirrors the CI configuration.

## Deployment

Make sure the [Firebase CLI](https://firebase.google.com/docs/cli) is installed (`npm install -g firebase-tools`) and that you're authenticated (`firebase login`). The project is configured for Firebase Hosting's Angular framework integration, so the CLI will run the Angular production build automatically during deploy.

```fish
firebase deploy --only hosting:cryp-watch
```

The production site publishes to https://cryp-watch.web.app. The hosting target is already defined in `.firebaserc`. If you need to switch projects, run `firebase use <project-id>` first. If you prefer to build manually, run `npm run build` and the deploy step will reuse the cached output when available.

## Continuous integration & deployment

Each push or pull request targeting `master` triggers the GitHub Actions workflow defined in `.github/workflows/ci.yml`:

- Installs dependencies with `npm ci`
- Executes the headless unit test suite
- Builds the Angular production bundle
- Deploys to Firebase Hosting (push events only) using the framework integration

### Required repository secrets

| Secret name | Description |
| --- | --- |
| `FIREBASE_SERVICE_ACCOUNT` | JSON credentials for a Firebase service account with Hosting Admin permissions. Create a service account in the Firebase console (Project Settings → Service Accounts) and paste the JSON into the secret. |

If the secret isn't configured, the deploy job now posts a notice and skips the Firebase deploy step, allowing the build and tests to pass while reminding you to add the credential when you're ready to publish. When the secret is present, the job exports `FIREBASE_CLI_EXPERIMENTS=webframeworks` so Firebase Hosting uses the Angular framework integration pipeline.

The default `GITHUB_TOKEN` is used automatically by the workflow; no extra configuration is needed for it.

### Local verification

Before pushing, you can mirror the CI steps locally:

```fish
npm ci
npm run test -- --watch=false --browsers=ChromeHeadlessCI
npm run build
firebase deploy --only hosting:cryp-watch
```

## Build metadata

The landing page footer displays the deployed commit hash. This is generated automatically by the `npm run set-build-info` script, which runs during install (`postinstall`), before builds, tests, and `npm start`. If you need to refresh the metadata manually, run:

```fish
npm run set-build-info
```

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
