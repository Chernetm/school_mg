// "use client";

// import React, { createContext, useContext, useState, useEffect } from "react";

// const TranslationContext = createContext();

// export function TranslationProvider({ children }) {
//   const [locale, setLocale] = useState("en");
//   const [messages, setMessages] = useState({});

//   useEffect(() => {
//     import(`../locales/${locale}.json`)
//       .then((mod) => setMessages(mod))
//       .catch(() => setMessages({}));
//   }, [locale]);

//   function t(key, vars = {}) {
//     let msg = messages[key] || key;
//     Object.keys(vars).forEach((v) => {
//       msg = msg.replace(`{${v}}`, vars[v]);
//     });
//     return msg;
//   }

//   return (
//     <TranslationContext.Provider value={{ locale, t, setLocale }}>
//       {children}
//     </TranslationContext.Provider>
//   );
// }

// export function useTranslation() {
//   const ctx = useContext(TranslationContext);
//   if (!ctx) throw new Error("useTranslation must be used within TranslationProvider");
//   return ctx;
// }
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const TranslationContext = createContext();

export function TranslationProvider({ children, initialLocale = "en", initialMessages = null }) {
  const [locale, setLocale] = useState(initialLocale);
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    // If we already have messages for this locale (SSR preload), skip fetching
    if (initialMessages && locale === initialLocale) return;

    import(`../locales/${locale}.json`)
      .then((mod) => setMessages(mod.default || mod))
      .catch(() => setMessages({}));
  }, [locale, initialLocale, initialMessages]);

  function t(key, vars = {}) {
    if (!messages) return ""; // don’t render until ready
    let msg = messages[key] || key;
    Object.keys(vars).forEach((v) => {
      msg = msg.replace(`{${v}}`, vars[v]);
    });
    return msg;
  }

  if (!messages) {
    return null; // or loading spinner
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
