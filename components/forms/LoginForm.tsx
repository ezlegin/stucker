"use client";

import { GoogleOAuthSignIn } from "@/actions/OAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { googleLogo } from "@/public";
import Image from "next/image";
import { useTransition } from "react";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const onGoogleLogin = () => {
    startTransition(async () => {
      await GoogleOAuthSignIn();
    });
  };

  return (
    <div className="w-full space-y-6 sm:max-w-sm">
      <Card className="relative">
        <CardContent className="space-y-6">
          <Button
            disabled={isPending}
            variant={"outline"}
            className={"h-12 w-full"}
            size={"lg"}
            onClick={onGoogleLogin}
          >
            <Image alt="google" src={googleLogo} width={20} height={20} />
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
