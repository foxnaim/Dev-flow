import NextAuth from 'next-auth';
import TelegramProvider from '@/lib/telegram-provider';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    TelegramProvider({
      clientId: process.env.TELEGRAM_CLIENT_ID!,
      clientSecret: process.env.TELEGRAM_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'telegram') {
        try {
          await connectDB();
          
          const telegramData = account.providerAccountId;
          const existingUser = await User.findOne({ telegramId: telegramData });

          if (!existingUser) {
            await User.create({
              telegramId: telegramData,
              username: user.name,
              firstName: user.firstName,
              lastName: user.lastName,
              photoUrl: user.image,
            });
          }

          return true;
        } catch (error) {
          console.error('Error during sign in:', error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST }; 
