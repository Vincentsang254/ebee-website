import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
      <p className="text-gray-600 mt-2">The page you are looking for does not exist.</p>
      
      <Link to="/shop/home" className="mt-5 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
