import { createContext } from "react";

export const UserDetailContext = createContext<{
  userDetail: any;
  setUserDetail: (detail: any) => void;
}>({
  userDetail: null,
  setUserDetail: () => {},
});