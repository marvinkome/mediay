import React from "react";
import PopupWindow from "./popupWindow";

export type ReactOauth2Options = {
  id: string;
  url: string;
  withHash?: boolean;
};

export function useOath2Login(options: ReactOauth2Options) {
  return React.useCallback(async () => {
    const data = await PopupWindow.open(options.id, options.url, {
      height: 800,
      width: 600,
      withHash: options.withHash || false,
    });

    return data;
  }, [options.url, options.id, options.withHash]);
}
