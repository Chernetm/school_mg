"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const TranslationContext = createContext();

export function TranslationProvider({ children }) {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    import(`../locales/${locale}.json`)
      .then((mod) => setMessages(mod))
      .catch(() => setMessages({}));
  }, [locale]);

  function t(key, vars = {}) {
    let msg = messages[key] || key;
    Object.keys(vars).forEach((v) => {
      msg = msg.replace(`{${v}}`, vars[v]);
    });
    return msg;
  }

  return (
    <TranslationContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
  return ctx;
}
