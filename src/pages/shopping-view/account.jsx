import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

const Profile = () => {
  // Get user data from Redux state
  const { name, email, phoneNumber, userType, createdAt } = useSelector((state) => state.auth);

  return (
    <div className="p-4 max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {name ? (
        <div>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone Number:</strong> {phoneNumber}</p>
          <p><strong>User Type:</strong> {userType}</p>
          <p><strong>Account Created On:</strong> {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}</p>
        </div>
      ) : (
        <p>Loading user information...</p>
      )}
    </div>
  );
}

export default Profile;
