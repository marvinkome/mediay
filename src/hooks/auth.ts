import React from "react";
import { useOath2Login } from "libs/react-oauth2";
import { supabaseUrl } from "libs/supabase";

export function useOAuth(urlParams: any) {
  const url = React.useMemo(() => {
    const url = `${supabaseUrl}/auth/v1/authorize`;
    const params = new URLSearchParams(urlParams).toString();

    return `${url}?${params}`;
  }, [urlParams]);

  const signIn = useOath2Login({ url, id: "google-login", withHash: true });
  return signIn;
}
