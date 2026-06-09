# retirement-election-wc.
This template provides the repository structure needed for Angular 8 web content development

## CICD Pipeline
The following changes have been implemented to ensure pipeline compatability

1. Within the project **cicd.json**, add a **build.node.version** property to ensure the pipeline builds with the appropriate node version.  
```
{
  ...
  "build":{
    "node":{
      "version":"10.16.3"
    }
  }
}
```

2. The project **package.json** has been updated to include npm **ci** scripts. During the build process, the pipeline will execute the **build:ci**, **test:ci**, and **lint:ci** npm scripts. These may be configured differently than the standard npm run scripts (e.g., production flags, headless browsers, etc.).  
```
  "scripts": {
    ...
    "build:ci": "ng build --prod --output-hashing none --single-bundle true",
    "test:ci": "ng test --browsers ChromeHeadlessNoSandbox --watch false --code-coverage true",
    "lint:ci": "ng lint"
  },
```

3. The project **karma.conf.js** has been updated to include the headless chrome browser configuration. This is needed when running unit tests within the pipeline via headless mode.
```
  config.set({
    ...
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    } 
```

4. The necessary gradle files have been added. The pipeline will execute the npm **ci** scripts via the following gradle plugin defined within **build.gradle**. This ensures the appropriate build steps will be performed.
```
...
// Apply plugins.
apply plugin: com.alight.gradle.plugins.NgAppPlugin
```

## Angular
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.7

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


