import { createCookie } from "react-router";

export const userToken = createCookie("user-token", {
  maxAge: 604_800, // one week
});
