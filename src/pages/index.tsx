// import QRCode from "react-qrcode";
// import { useSession, signIn } from "next-auth/react";

// const HomePage = () => {
//   const { data: session } = useSession();

//   const attendanceUrl = session
//     ? `${window.location.origin}/attendance/${session.user?.email}`
//     : "";

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       {!session ? (
//         <button
//           onClick={() => signIn("google")}
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Sign in with Google
//         </button>
//       ) : (
//         <>
//           <h1 className="text-lg font-semibold">Scan QR to Mark Attendance</h1>
//           <QRCode value={attendanceUrl} size={256} />
//           <p className="mt-4 text-gray-500">Share this QR for attendance sign-in.</p>
//         </>
//       )}
//     </div>
//   );
// };

// export default HomePage;