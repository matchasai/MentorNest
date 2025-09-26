import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaCreditCard, FaQrcode, FaTimes } from 'react-icons/fa';
import api from '../services/api';
import Button from './Button';

const PaymentModal = ({ course, onClose, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [step, setStep] = useState('method'); // method, payment, complete

  const handleInitiatePayment = async () => {
    try {
      if (paymentMethod === 'credit_card') {
        // Use Razorpay checkout
        const { data: order } = await api.post(`/payment/razorpay/order`, {
          courseId: course.id,
          amountPaise: Math.round(Number(course.price) * 100),
          currency: 'INR'
        });

        const options = {
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'MentorNest',
          description: course.title,
          order_id: order.id,
          handler: async function (response) {
            try {
              await api.post(`/payment/razorpay/verify`, {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                courseId: course.id,
                paymentMethod: 'RAZORPAY'
              });
              setStep('complete');
              toast.success('Payment completed successfully!');
              setTimeout(() => {
                onPaymentComplete();
                onClose();
              }, 1200);
            } catch (e) {
              toast.error('Failed to verify payment');
            }
          },
          theme: { color: '#2563eb' },
          prefill: {},
          modal: { ondismiss: () => {} }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // QR code flow remains manual confirmation
        setStep('payment');
        toast.success('Payment initiated! Please complete your payment.');
      }
    } catch (error) {
      toast.error('Failed to initiate payment');
    }
  };

  const handleCompletePayment = async () => {
    try {
      // Manual confirmation path for QR code only
      setStep('complete');
      toast.success('Payment completed successfully!');
      setTimeout(() => {
        onPaymentComplete();
        onClose();
      }, 1500);
    } catch (error) {
      toast.error('Failed to complete payment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Purchase Course
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
              title="Close modal"
            >
              <FaTimes size={16} className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 'method' && (
            <div className="space-y-6">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {course.title}
                </h4>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                  ₹{course.price}
                </p>
              </div>

              <div className="space-y-4">
                <h5 className="font-semibold text-gray-900 dark:text-gray-100">Select Payment Method</h5>
                
                <div className="space-y-3">
                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <FaCreditCard className="text-blue-500 mr-3" />
                    <span className="text-gray-900 dark:text-gray-100">Credit/Debit Card</span>
                  </label>

                  <label className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="qr_code"
                      checked={paymentMethod === 'qr_code'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <FaQrcode className="text-green-500 mr-3" />
                    <span className="text-gray-900 dark:text-gray-100">Scan QR Code (UPI)</span>
                  </label>
                </div>
              </div>

              <Button
                onClick={handleInitiatePayment}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Proceed to Payment
              </Button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              {paymentMethod === 'credit_card' ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <FaCreditCard className="text-3xl text-blue-500 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Card Payment
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Amount: ₹{course.price}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setStep('method')}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleCompletePayment}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Pay ₹{course.price}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <FaQrcode className="text-3xl text-green-500 mx-auto mb-3" />
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Scan QR Code to Pay
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Amount: ₹{course.price}
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                      <img 
                        src="/qr-code-google-pay.jpg" 
                        alt="QR Code for Payment"
                        className="w-48 h-48 object-contain"
                      />
                      <p className="text-center text-xs text-gray-600 mt-2">
                        Scan with any UPI app
                      </p>
                    </div>
                  </div>

                  <div className="text-center space-y-3">
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      After scanning and completing the payment, click the button below to confirm.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        onClick={() => setStep('method')}
                        variant="outline"
                        className="px-4 py-2"
                      >
                        Back
                      </Button>
                      <Button
                        onClick={handleCompletePayment}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700"
                      >
                        I've Completed Payment
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center space-y-4">
              <FaCheckCircle className="text-6xl text-green-500 mx-auto" />
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Payment Successful!
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Your payment has been verified. You can now enroll in the course.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 