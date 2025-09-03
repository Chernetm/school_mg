"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useTranslation from "next-translate/useTranslation";

export default function LanguageSwitcher() {
  // 1. Hooks at the top level
  const { lang } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 2. Derived values (safe)
  const queryString = searchParams?.toString() ? `?${searchParams.toString()}` : "";
  const nextLang = lang === "am" ? "en" : "am";
  const pathWithoutLocale = pathname.replace(/^\/(en|am)/, "");
  const newPath = `/${nextLang}${pathWithoutLocale}${queryString}`;

  // 3. Event handler
  const handleClick = () => {
    router.push(newPath);
  };

  // 4. JSX
  return (
    <button
      onClick={handleClick}
      className="text-white hover:bg-blue-800 rounded-md px-3 py-2 text-sm font-medium transition"
    >
      {nextLang.toUpperCase()}
    </button>
  );
}
