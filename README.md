# Role-Based Auth Boilerplate

This project provides a boilerplate for handling role-based authentication in a React application. It is built using TypeScript, Vite, React Router, Tailwind CSS, and TanStack Query.

## Features

- **React** with **TypeScript** for a robust development experience.
- **Vite** for fast builds and HMR.
- **Tailwind CSS** for utility-first CSS styling.
- **TanStack Query** for handling server state.
- **React Router** for routing.
- Basic authentication context and components.

## Project Structure

- `src/pages/Unauthorized.tsx`: Unauthorized access page.
- `src/pages/Login.tsx`: Login page for the user to sign in.
- `src/main.tsx`: Main entry point, sets up routing and providers.
- `src/context/AuthProvider.tsx`: Authentication context and provider.
- `src/components/auth/ProtectedRoute.tsx`: Wrapper Component to protect route based on user roles.

## Setup

### Prerequisites

Make sure you have the following installed:

- Node.js (>=18)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd [repository-name]
2. Install dependencies:

```bash
npm test
# or
yarn test
```
### Routing

React Router is used for routing. Modify routes in the `src/main.tsx` file.

### State Management

TanStack Query is used for managing server state. Authentication state is managed using React context in `src/context/AuthProvider.tsx`.

## Usage

### Authentication

- Unauthorized Page: Displayed when a user tries to access a restricted page without the proper permissions.
- Login Page: A form for users to log in.
- AuthProvider: Context provider for managing authentication state.

Authentication methods (login, logout, getUser) need to be implemented based on your backend API.

### Running Tests

To run tests, use:
```bash
npm test
# or
yarn test
```