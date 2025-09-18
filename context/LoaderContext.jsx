"use client";
import React, { createContext, useContext, useState } from "react";
import GlobalLoader from "@/components/ui/GlobalLoader";

const LoaderContext = createContext();

export function LoaderProvider({ children }) {
  const [loader, setLoader] = useState({ show: false, message: "" });

  const showLoader = (message = "Loading...") =>
    setLoader({ show: true, message });
  const hideLoader = () => setLoader({ show: false, message: "" });

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loader.show && <GlobalLoader message={loader.message} />}
    </LoaderContext.Provider>
  );
}

export const useLoader = () => useContext(LoaderContext);
