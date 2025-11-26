import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserTypeContext = createContext({
  userType: "passenger",
  setUserType: () => {},
});

export function UserTypeProvider({ children }) {
  const [userType, setUserType] = useState("passenger");

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("USER_TYPE");
      if (saved) setUserType(saved);
    })();
  }, []);

  const updateUserType = async (type) => {
    setUserType(type);
    await AsyncStorage.setItem("USER_TYPE", type);
  };

  return (
    <UserTypeContext.Provider value={{ userType, setUserType: updateUserType }}>
      {children}
    </UserTypeContext.Provider>
  );
}
