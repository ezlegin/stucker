"use server";

import { signIn } from "@/auth";

export const GoogleOAuthSignIn = async () => {
  await signIn("google", {
    redirectTo: "/dashboard",
  });
};
