import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "../../../lib/mongodb";
import User from "../../../models/User";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Customize the sign-in page if necessary
    error: '/auth/error',   // Custom error page (optional)
    verifyRequest: '/auth/verify-request',  // Optional verification request page
    newAccount: '/auth/new-account',
    callback: '/welcome',          // Optional new account page
  },
  callbacks: {
  async signIn({ account, profile, user }) {
  try {
    await dbConnect();
    const existingUser = await User.findOne({ email: user.email });
    console.log(existingUser);

    if (!existingUser) {
      // Create a new user
      await User.create({
        name: user.name,
        email: user.email,
        qrCodeCheckedIn: false, // Default value
      });
    }

    return true; // Allow sign-in
  } catch (error) {
    console.error("Error in signIn callback:", error);
    return false; // Deny sign-in
  }
},

},
});