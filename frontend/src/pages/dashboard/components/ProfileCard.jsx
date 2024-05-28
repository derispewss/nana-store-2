import React from 'react';

const ProfileCard = () => {
    const user = localStorage.getItem('isLogin')
    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-sm mx-auto">
            <div className="flex flex-col items-center">
                <img
                    className="w-24 h-24 rounded-full shadow-lg mb-4"
                    src={'https://via.placeholder.com/150'}
                    alt="User Profile"/>
                <h2 className="text-2xl font-semibold mb-2">Nana Store</h2>
                <p className="text-gray-600 mb-4">{user}</p>
            </div>
        </div>
    );
};


export default ProfileCard;
