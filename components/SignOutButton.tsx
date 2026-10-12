"use client";

import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const SignOutButton = () => {
  return (
    <Button variant={"ghost"} size={"icon"} onClick={() => signOut()}>
      <LogOut />
    </Button>
  );
};

export default SignOutButton;
