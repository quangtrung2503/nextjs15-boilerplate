"use client";

import apiUrls from "@/constants/apiUrls";
import pageUrls from "@/constants/pageUrls";
import { ResponseCommon } from "@/interfaces/common";
import { FormLoginValues } from "@/models/login.model";
import { FormSignUpValues } from "@/models/signup.model";
import httpService from "@/services/httpService";
import authServices from "@/services/modules/auth/auth.services";
import {
  IUser,
  ResponseLogin,
} from "@/services/modules/auth/interfaces/signin.interface";
import { SignUpResponse } from "@/services/modules/auth/interfaces/signup.interface";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
// import { RequestRegister, ResponseRegisterMessage } from 'modules/register/register.interface';
// import registerServices from 'modules/register/register.services';
import React, { useCallback, useEffect, useMemo, useState } from "react";

type AuthContextType = {
  accessToken: string;
  user?: IUser;
  isLogining: boolean;
  isLogged: boolean;
  signIn: (body: FormLoginValues) => void;
  signUp: (body: FormSignUpValues) => void;
  signOut: () => void;
  // register: (body: RequestRegister) => void;
};

const AuthContext = React.createContext<AuthContextType>({
  accessToken: "",
  user: undefined,
  isLogining: false,
  isLogged: false,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  // register: () => {},
});

export const useSession = () => React.useContext(AuthContext);

export default function AuthProvider(props: { children: React.ReactNode }) {
  const { children } = props;
  const [state, setState] = useState<
    Omit<AuthContextType, "signIn" | "signOut" | "register" | "signUp">
  >({
    accessToken: httpService.getTokenFromLocalStorage() || "",
    user: httpService.getUserFromLocalStorage() || "",
    isLogged: !!httpService.getTokenFromLocalStorage(),
    isLogining: false,
  });

  useEffect(() => {
    httpService.attachTokenToHeader(state.accessToken);
  }, [state.accessToken]);

  const onSignSuccess = useCallback(
    ({ accessToken, user }: { accessToken: string; user: IUser }) => {
      httpService.attachTokenToHeader(accessToken);
      httpService.saveTokenToLocalStorage(accessToken);
      httpService.saveUserToStorage(user);
      // broadcastService.channelSwitchUser().postMessageReload();
    },
    []
  );

  const signIn = useCallback(
    (
      body: FormLoginValues,
      router?: AppRouterInstance
    ): Promise<ResponseLogin> => {
      return new Promise<ResponseLogin>((resolve, reject) => {
        (async () => {
          try {
            setState((prev) => ({
              ...prev,
              isLogining: true,
            }));
            const response = await authServices.signin(body);

            const accessToken = response?.data?.data?.accessToken;
            const user: IUser = response?.data?.data?.user;

            onSignSuccess({ accessToken, user });
            setState((prev) => ({
              ...prev,
              isLogining: false,
              isLogged: true,
              accessToken,
              user,
            }));
            resolve(response);
          } catch (error) {
            reject(error);
          } finally {
            setState((prev) => ({
              ...prev,
              isLogining: false,
            }));
          }
        })();
      });
    },
    [onSignSuccess]
  );
  const signUp = useCallback(
    (
      body: FormSignUpValues,
      router?: AppRouterInstance
    ): Promise<SignUpResponse> => {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            const response = await authServices.signup(body);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        })();
      });
    },
    []
  );
  const register = useCallback(
    (body: FormSignUpValues): Promise<SignUpResponse> => {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            const response = await authServices.signup(body);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        })();
      });
    },
    []
  );
  const signOut = useCallback(() => {
    httpService.clearUserInfo();
    // broadcastService.channelSwitchUser().postMessageReload();
    window.location.href = pageUrls.SignIn;
  }, []);

  const values = useMemo(() => {
    return {
      signIn,
      signUp,
      signOut,
      ...state,
    };
  }, [signIn, signOut, state]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
