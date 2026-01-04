import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { api } from "../services/api";

interface ApiContextType {
  isReady: boolean;
  isAuthenticated: boolean;
}

const ApiContext = createContext<ApiContextType>({ isReady: false, isAuthenticated: false });

export function ApiProvider({ children }: { children: ReactNode }) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Create a wrapper that logs and handles errors
      const tokenGetter = async () => {
        try {
          const token = await getToken();
          if (token) {
            setIsAuthenticated(true);
          }
          return token;
        } catch (error) {
          console.error("ApiProvider: Error getting token:", error);
          setIsAuthenticated(false);
          return null;
        }
      };
      
      api.setTokenGetter(tokenGetter);
      
      // Test token immediately
      tokenGetter().then(token => {
        console.log("ApiProvider: Token available:", !!token);
      });
    } else if (isLoaded && !isSignedIn) {
      setIsAuthenticated(false);
    }
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <ApiContext.Provider value={{ isReady: isLoaded, isAuthenticated }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiContext() {
  return useContext(ApiContext);
}
