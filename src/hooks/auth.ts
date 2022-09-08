import React from "react";
import { useOath2Login } from "@marvinkome/react-oauth2";

export function useGoogleSignIn() {
  const url = React.useMemo(() => {
    const url = "https://accounts.google.com/o/oauth2/v2/auth";
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URL || "",
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      scope: "https://www.googleapis.com/auth/userinfo.email",
    }).toString();

    return `${url}?${params}`;
  }, []);

  const googleSignIn = useOath2Login({
    id: "google-login",
    url,
  });

  return googleSignIn;
}
