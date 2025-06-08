import NextAuth, { AuthOptions, Session, User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('Authorize callback started.');
        await connectDB();

        const user = await User.findOne({ email: credentials?.email });
        console.log('User found in authorize:', user ? user.email : 'None');

        if (user && bcrypt.compareSync(credentials!.password, user.password)) {
          console.log('Password matched. Returning user:', user._id.toString());
          return { id: user._id.toString(), name: user.username, email: user.email }; // Явно преобразуем _id в string
        } else {
          console.log('Password did not match or user not found.');
          return null;
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user }: { user: NextAuthUser }) {
      console.log('SignIn callback started. User:', user);
      if (user) {
        return true;
      }
      return false;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('Session callback started. Token sub:', token.sub);
      if (session?.user && token.sub) {
        session.user.id = token.sub;
      }
      console.log('Session returned:', session);
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: NextAuthUser }) {
      console.log('JWT callback started. User:', user);
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      console.log('JWT token returned:', token);
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 
