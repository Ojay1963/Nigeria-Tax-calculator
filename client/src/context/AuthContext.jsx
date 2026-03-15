import { createContext, useContext, useEffect, useState } from "react";
import {
  getCurrentUser,
  loginAccount,
  registerAccount,
  requestPasswordReset,
  resendVerificationEmail,
  resetPasswordAccount,
  verifyEmailToken
} from "../api/http";

const AuthContext = createContext(null);
const STORAGE_KEY = "tax-tools-ng-auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { token: "", user: null };
    } catch (_error) {
      window.localStorage.removeItem(STORAGE_KEY);
      return { token: "", user: null };
    }
  });
  const [authLoading, setAuthLoading] = useState(Boolean(auth.token));

  useEffect(() => {
    if (!auth.token) {
      setAuthLoading(false);
      return;
    }

    let ignore = false;

    getCurrentUser(auth.token)
      .then(response => {
        if (!ignore) {
          const nextAuth = { token: auth.token, user: response.data };
          setAuth(nextAuth);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
        }
      })
      .catch(() => {
        if (!ignore) {
          window.localStorage.removeItem(STORAGE_KEY);
          setAuth({ token: "", user: null });
        }
      })
      .finally(() => {
        if (!ignore) {
          setAuthLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [auth.token]);

  async function login(values) {
    const response = await loginAccount(values);
    const nextAuth = {
      token: response.data.token,
      user: response.data.user
    };
    setAuth(nextAuth);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAuth));
    return response;
  }

  async function register(values) {
    return registerAccount(values);
  }

  async function verifyEmail(values) {
    return verifyEmailToken(values);
  }

  async function resendVerification(values) {
    return resendVerificationEmail(values);
  }

  async function forgotPassword(values) {
    return requestPasswordReset(values);
  }

  async function resetPassword(values) {
    return resetPasswordAccount(values);
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setAuth({ token: "", user: null });
  }

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated: Boolean(auth.token && auth.user),
        authLoading,
        login,
        register,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return value;
}
