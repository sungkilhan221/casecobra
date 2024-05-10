import React, { Suspense } from "react";
import ThankYou from "./ThankYou";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Page = () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user) {
    redirect("/api/auth/login");
  }

  return (
    <Suspense>
      <ThankYou />
    </Suspense>
  );
};

export default Page;
