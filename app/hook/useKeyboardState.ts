import { Keyboard } from "react-native";
import { useState, useEffect } from "react";

const useKeyboardState = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    // Subscribe to keyboardDidShow event
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );

    // Subscribe to keyboardDidHide event
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    // Don't forget to cleanup the listeners
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []); // Empty dependency array means this effect runs once on mount
  return isKeyboardVisible;
};

export default useKeyboardState;
