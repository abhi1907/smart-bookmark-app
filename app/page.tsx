"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/dashboard");
      }
    };

    checkUser();
  }, [router]);

const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
};




  return (
    <div className="flex h-screen items-center justify-center bg-black">
      <button
        onClick={loginWithGoogle}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg"
      >
        Sign in with Google
      </button>
    </div>
  );
}
