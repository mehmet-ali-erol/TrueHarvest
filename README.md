## Table of Contents
- [Getting Started with Create React App](#getting-started-with-create-react-app)
- [Available Scripts](#available-scripts)
    - [npm start](#npm-start)
    - [npm test](#npm-test)
    - [npm run build](#npm-run-build)
    - [npm run eject](#npm-run-eject)
- [Node.js Backend Setup](#nodejs-backend-setup)
    - [Node.js Backend Overview](#nodejs-backend-overview)
    - [Key Features of Our Backend](#key-features-of-our-backend)
- [Running the Server](#running-the-server)
    - [Server Configuration](#server-configuration)
- [Current Features](#current-features)
- [Contribution Guidelines for Group Members](#contribution-guidelines-for-group-members)
- [License Information](#license-information)
- [Credits](#credits)
- [Learn More](#learn-more)
    - [Code Splitting](#code-splitting)
    - [Analyzing the Bundle Size](#analyzing-the-bundle-size)
    - [Making a Progressive Web App](#making-a-progressive-web-app)
    - [Advanced Configuration](#advanced-configuration)
    - [Deployment](#deployment)
    - [npm run build fails to minify](#npm-run-build-fails-to-minify)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


## Node.js Backend Setup


### Node.js Backend Overview

Our project's backend is developed using Node.js, a powerful and efficient JavaScript runtime built on Chrome's V8 engine. The backend plays a crucial role in handling business logic, data storage, and serving API requests to the frontend.

### Key Features of Our Backend:

- **API Services**: Our Node.js server provides various RESTful API endpoints, essential for the frontend to interact with the application data.
- **Data Handling**: The backend is responsible for managing database operations, ensuring data integrity and security.
- **Performance Optimization**: Leveraging Node.js's non-blocking I/O model, the backend is designed for optimal performance, handling multiple requests simultaneously without slowing down.
- **Integration with TKGM APIs**: We've integrated and customized free API services from TKGM in our backend, enhancing the application's location search capabilities.

## Running the Server

To start both the React application and the Node.js server concurrently, use the command `npm start`. This command is configured in `package.json` to execute two scripts simultaneously:

- `npm run start-react`: Starts the React application using `react-scripts start`.
- `npm run start-server`: Launches the Node.js server with `node server.js`.

### Server Configuration

Our Node.js server is set up with the following configurations:

- **Logging**: Utilizes `morgan` with the 'combined' configuration for detailed HTTP request logging.
- **Port**: The server listens on port `3002`.
- **CORS**: Cross-Origin Resource Sharing (CORS) is enabled to allow seamless frontend-backend communication.
- **JSON Support**: Uses `express.json()` middleware for parsing JSON request bodies.

## Current Features
* Users can register with an email and password
* Users can select or draw a field on the map to detect their field
* Users can add a field by selecting its properties
* Users can see the map on the right side of the page
## Contribution Guidelines for Group Members

As this project is a term project, contributions are currently limited to designated group members. Each member plays a vital role in the development and success of this project. Here are some guidelines to ensure smooth collaboration and consistency:

- **Communication**: Regularly communicate with team members about your progress, challenges, and any ideas for improvement.
- **Code Reviews**: Before merging changes, submit a pull request. It's essential for other team members to review the code to maintain quality and consistency.
- **Issue Tracking**: Use GitHub issues to track tasks, bugs, and feature requests. Ensure that you're assigned to an issue before you start working on it.
- **Commit Messages**: Write clear and descriptive commit messages. This helps in understanding the history of changes and the purpose of each commit.
- **Testing**: Thoroughly test your code before pushing it to ensure that it doesn't break existing functionalities.

For major changes, please discuss with the team first to reach a consensus. This collaborative approach helps in maintaining a coherent and efficient development process.

## License Information

Currently, this project is not under any specific open source license.

## Credits
* Tapu ve Kadastro Genel Müdürlüğü (TKGM)
  * in our project's backend, we have strategically reorganized and integrated several free API services from TKGM, optimizing them to enhance our location search functionalities in a way that best suits our specific needs.
## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)