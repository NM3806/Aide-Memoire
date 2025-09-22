"use client";
import React, { createContext, useContext, useState } from "react";
import GlobalLoader from "@/components/ui/GlobalLoader";
import { AnimatePresence } from "framer-motion";

const LoaderContext = createContext();

export default function LoaderProvider({ children }) {
  const [loader, setLoader] = useState({ show: false, message: "" });

  const showLoader = (message = "LLLLLoading...") =>
    setLoader({ show: true, message });
  const hideLoader = () => setLoader({ show: false, message: "" });

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <AnimatePresence>
        {loader.show && <GlobalLoader message={loader.message} />}
      </AnimatePresence>
    </LoaderContext.Provider>
  );
}

export const useLoader = () => useContext(LoaderContext);