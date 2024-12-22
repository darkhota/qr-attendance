import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

const CheckInPage = () => {
  const { data: session, status } = useSession();
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false); // Tracks if the user needs to register
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    address: "",
    phone: "",
    firstTimer: "yes", // Default to 'yes'
  }); // Registration form data

  useEffect(() => {
    if (session) {
      const checkUserStatus = async () => {
        const response = await fetch("/api/check-in", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        });

        const result = await response.json();
        if (result.isNewUser) {
          setIsNewUser(true); // Trigger registration form
        } else {
          setCheckInStatus(result.message); // Display the message from API
        }
      };

      checkUserStatus();
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, email: session?.user.email }),
    });

    const result = await response.json();
    if (result.success) {
      setCheckInStatus("User registered and checked in!");
      setIsNewUser(false); // Hide the form after registration
    }
  };

  if (status === "loading") return <p className="text-center mt-20">Loading...</p>;

  if (!session) {
    signIn("google"); // Redirect to Google Sign-In
    return null;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#DA1212]">
      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <span
            key={i}
            className="floating-icon text-white text-opacity-40"
            style={{
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            ✨
          </span>
        ))}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md z-10">
        {isNewUser ? (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Register</h1>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <select
              name="firstTimer"
              value={formData.firstTimer}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            >
              <option value="yes">First Time</option>
              <option value="no">Returning</option>
            </select>
            <button
              type="submit"
              className="w-full bg-[#DA1212] text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Register and Check In
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <Image
              src="/cci-logo.svg"
              alt="Church Logo"
              width={100}
              height={100}
              className="mx-auto"
            />
            <h1 className="text-3xl font-extrabold text-gray-800">Welcome to Church, {session.user?.name}!</h1>
            <p className="text-lg text-gray-600">
              {checkInStatus || "We are processing your check-in, please wait..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInPage;