import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true, //todo
  callbacks: {
    authorized: async ({ request: req, auth }) => {
      const privateRoutes = ["/dashboard"];
      const isLoginRoute = req.nextUrl.pathname.startsWith("/login");
      const isPrivateRoute = privateRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route),
      );
      if (!!auth) {
        if (isLoginRoute)
          return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
        return true;
      } else {
        if (isPrivateRoute && !isLoginRoute) return false;
        return true;
      }
    },
    async jwt({ token, user }) {
      if (user) return token;
      if (token.sub) {
        const exists = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { id: true },
        });
        if (!exists) {
          return null;
        }
        token.id = exists.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [Google({ allowDangerousEmailAccountLinking: true })],
});
