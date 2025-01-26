# InfoStream

A portal where users can view all articles, filter by category and view the content of individual articles. The admin will be able to add new articles, as well as edit and delete them

## Development server

To set up and run the application on your system, follow these steps:

1. Installation Process Clone the repository:
```bash
git clone <repository_url>
```
Install the required dependencies using npm:

```bash
npm install
```

2. Running the Development Server - FRONTEND

```bash
npm start
```

Open http://localhost:4200 in your browser to access the application.

3. Running the Development Server - BACKEND
```bash
py app.py
```

The backend will start running at http://127.0.0.1:5000/.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

