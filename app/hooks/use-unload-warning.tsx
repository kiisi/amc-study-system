import { useEffect } from "react";
import { useBlocker } from "react-router";

const useUnloadWarning = (shouldWarn = true) => {
  // Block React Router navigation
  const blocker = useBlocker(shouldWarn);

  // Block browser unload (closing tab/refreshing)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (shouldWarn) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    if (shouldWarn) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarn]);

  return blocker;
};

export default useUnloadWarning;