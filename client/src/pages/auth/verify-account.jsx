import { InputOTP } from "@/components/ui/input-otp";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';  // Make sure to import axios
// import { Toast } from "@/components/ui/toaster";
import { toast } from 'react-toastify';

const AccountVerification = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerification = async () => {
        setLoading(true);
        const url = `http://localhost:3001/api/auth/verify`;  // POST to verify endpoint

        try {
            const response = await axios.post(url, { verificationCode });
            toast.success(response.data.message);

            // After successful verification, redirect to login page
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.errors[0] || "Verification failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Verify Your Account</h2>
                <InputOTP
                    value={verificationCode}
                    onChange={setVerificationCode}
                    length={6} // Assuming OTP is 6 digits
                    placeholder="Enter OTP"
                    className="w-full"
                />
                <button
                    onClick={handleVerification}
                    disabled={loading}
                    className={`w-full py-2 px-4 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition mt-4`}
                >
                    {loading ? 'Verifying...' : 'Verify Account'}
                </button>
            </div>
        </div>
    );
};

export default AccountVerification;
