# PAF-Frontend

Skill-Sharing & Learning Platform, where users can share and learn different skills like coding, cooking, photography, and DIY crafts.

This project is a frontend application built with React and Vite. It utilizes Tailwind CSS for styling and React Router for navigation.

## Tech Stack

*   **Framework/Library:** [React](https://reactjs.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/), [Bootstrap](https://getbootstrap.com/) (via `react-bootstrap`)
*   **Routing:** [React Router DOM](https://reactrouter.com/)
*   **HTTP Client:** [Axios](https://axios-http.com/)
*   **Icons:** [React Icons](https://react-icons.github.io/react-icons/), [React Bootstrap Icons](https://npmjs.com/package/react-bootstrap-icons)
*   **Linting:** [ESLint](https://eslint.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (comes with Node.js) or [yarn](https://yarnpkg.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd PAF-Frontend
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
    (or `yarn install` if you prefer Yarn)

### Running the Development Server

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

This will typically open the application in your default web browser at `http://localhost:5173` (the port might vary if 5173 is in use).

## Available Scripts

In the project directory, you can run the following scripts:

*   `npm run dev`:
    Runs the app in development mode with HMR.
    Open [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal) to view it in the browser.

*   `npm run build`:
    Builds the app for production to the `dist` folder.
    It correctly bundles React in production mode and optimizes the build for the best performance.

*   `npm run lint`:
    Lints the project files using ESLint to check for code quality and style issues.

## Linting

This project uses ESLint for code linting. You can run the linter with:

```bash
npm run lint
```

The ESLint configuration can be found in `eslint.config.js`.

This template was initially based on the minimal setup provided by Vite for a React project.
