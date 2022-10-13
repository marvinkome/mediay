import Router from "next/router";

export function routeReplace(path: string) {
  return new Promise<void>((res, rej) => {
    Router.events.on("routeChangeComplete", () => {
      res();
    });

    setTimeout(() => {
      rej("Reload timeout");
    }, 5000);

    Router.replace(path);
  });
}
