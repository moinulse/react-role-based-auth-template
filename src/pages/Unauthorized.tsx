import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, you don't have permission to access this page.
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}