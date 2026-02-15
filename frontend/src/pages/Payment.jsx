import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaCreditCard, FaLock, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const checkIfAlreadyPaid = useCallback(async () => {
    try {
      const response = await api.get(`/payment/check/${id}`);
      if (response.data.hasPaid) {
        // User has already paid - redirect to course
        toast.success('You have already enrolled in this course!');
        navigate(`/course/${id}`);
      }
    } catch {
      // If check fails, continue with payment page
      console.log('Payment status check failed, allowing payment flow');
    }
  }, [id, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const loadCourse = useCallback(async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch {
      toast.error('Failed to load course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    // Check if user is authenticated and is a STUDENT
    if (!isAuthenticated || user?.role !== 'STUDENT') {
      toast.error('Please log in as a student to purchase courses');
      navigate('/login');
      return;
    }
    
    loadCourse();
    checkIfAlreadyPaid();
    loadRazorpayScript();
  }, [id, isAuthenticated, user, navigate, checkIfAlreadyPaid, loadCourse]);

  const handleRazorpayPayment = async () => {
    setProcessing(true);
    
    try {
      // Validate course data
      if (!course) {
        toast.error('Course information not loaded. Please refresh the page.');
        setProcessing(false);
        return;
      }

      if (!course.price || course.price <= 0) {
        toast.error('Invalid course price. Please try again.');
        setProcessing(false);
        return;
      }

      if (!id) {
        toast.error('Invalid course ID. Please try again.');
        setProcessing(false);
        return;
      }

      console.log('Creating Razorpay order with:', { courseId: id, price: course.price, paise: Math.round(course.price * 100) });

      // Create order on backend
      const orderResponse = await api.post(`/payment/razorpay/order`, {
        courseId: id,
        amountPaise: Math.round(course.price * 100), // Convert to paise
        currency: 'INR'
      });

      console.log('Order response:', orderResponse.data);

      const { id: orderId, amount, currency, keyId } = orderResponse.data;

      if (!orderId || !amount) {
        toast.error('Failed to create payment order. Please try again.');
        setProcessing(false);
        return;
      }

      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID, // Use key from backend
        amount: amount,
        currency: currency,
        name: 'MentorNest',
        description: course.title,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyResponse = await api.post(`/payment/razorpay/verify`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              courseId: id,
              paymentMethod: 'RAZORPAY'
            });

            if (verifyResponse.data.success) {
              setCompleted(true);
              toast.success('Payment successful! You are now enrolled.');
              // Wait 2.5 seconds to ensure backend has processed enrollment before redirect
              setTimeout(() => {
                navigate(`/course/${id}`, { state: { refreshEnrollment: true } });
              }, 2500);
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error(error.response?.data?.error || 'Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#4F46E5'
        }
      };

      if (!window.Razorpay) {
        toast.error('Razorpay payment gateway not loaded. Please refresh and try again.');
        setProcessing(false);
        return;
      }

      const rzp = new window.Razorpay(options);
      
      rzp.on('payment.failed', function (response) {
        console.error('Razorpay payment failed:', response);
        toast.error('Payment failed: ' + (response.error?.description || 'Unknown error'));
        setProcessing(false);
      });

      rzp.open();
      setProcessing(false);
      
    } catch (error) {
      console.error('Payment error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to initiate payment';
      toast.error(errorMsg);
      setProcessing(false);
    }
  };

  const handleFreeEnrollment = async () => {
    setProcessing(true);
    try {
      const response = await api.post(`/payment/enroll-free/${id}`);
      if (response.data.success) {
        setCompleted(true);
        toast.success('Successfully enrolled in the course!');
        // Wait 2.5 seconds to ensure backend has processed enrollment before redirect
        setTimeout(() => {
          navigate(`/course/${id}`, { state: { refreshEnrollment: true } });
        }, 2500);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to enroll. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <FaSpinner className="animate-spin text-5xl text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading payment details...</p>
        </motion.div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="text-4xl text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">You have been enrolled in the course successfully.</p>
          <p className="text-sm text-gray-500 mb-8">Welcome to your learning journey!</p>
          <div className="animate-pulse">
            <p className="text-sm text-indigo-600 font-semibold">Redirecting to course...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">Complete Your Enrollment</h1>
          <p className="text-lg text-gray-600">Secure payment powered by Razorpay</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Details - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Course Info Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Course Details</h2>
              {course && (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    {course.imageUrl ? (
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-3xl">📚</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-800 mb-2">{course.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{course.description}</p>
                    </div>
                  </div>

                  {/* Course Features */}
                  <div className="bg-indigo-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-800 mb-4">What you'll get:</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-3 text-gray-700">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Lifetime access to course content</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Certificate of completion</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Expert mentor support</span>
                      </li>
                      <li className="flex items-center gap-3 text-gray-700">
                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                        <span>Progress tracking dashboard</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Security Badge */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-4">
                <FaShieldAlt className="text-green-500 text-3xl" />
                <div>
                  <h3 className="font-semibold text-gray-800">100% Secure Payment</h3>
                  <p className="text-sm text-gray-600">Your payment information is encrypted and secure</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Summary - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Summary</h2>
              
              {course && (
                <div className="space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Course Price:</span>
                      <span>₹{course.price}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (included):</span>
                      <span>₹0</span>
                    </div>
                    <div className="border-t-2 border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                        <span className="text-3xl font-bold text-indigo-600">₹{course.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="space-y-3">
                    {course.price === 0 || course.price === "0" ? (
                      <button
                        onClick={handleFreeEnrollment}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Enrolling...
                          </>
                        ) : (
                          <>
                            <FaCheckCircle />
                            Enroll for Free
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleRazorpayPayment}
                        disabled={processing}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        {processing ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaLock />
                            Pay with Razorpay
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => navigate('/courses')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all"
                    >
                      Back to Courses
                    </button>
                  </div>

                  {/* Payment Methods */}
                  <div className="text-center pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-3">Accepted Payment Methods</p>
                    <div className="flex justify-center items-center gap-2 flex-wrap">
                      <FaCreditCard className="text-2xl text-gray-400" />
                      <span className="text-sm text-gray-600">Cards, UPI, Wallets & More</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Payment; 