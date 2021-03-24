/**
 * This is based on https://github.com/hejmsdz/use-hash-param/, but modified to work correctly with
 * isomorphic rendering (plus typescript).
 */
import { useState, useEffect, useCallback } from "react";

function getHashSearchParams(location: {
  hash: string;
}): [string, URLSearchParams] {
  const hash = location.hash.slice(1);
  const [prefix, query] = hash.split("?");

  return [prefix, new URLSearchParams(query)];
}

function getHashParam(key: string, defaultValue: string): string {
  if (typeof window !== "undefined") {
    const [, searchParams] = getHashSearchParams(window.location);
    return searchParams.get(key);
  }
  return defaultValue;
}

function setHashParam(key: string, value?: string): void {
  if (typeof window !== "undefined") {
    const [prefix, searchParams] = getHashSearchParams(window.location);

    if (typeof value === "undefined" || value === "") {
      searchParams.delete(key);
    } else {
      searchParams.set(key, value);
    }

    const search = searchParams.toString();
    window.location.hash = search ? `${prefix}?${search}` : prefix;
  }
}

export default function useHashParam(
  key: string,
  defaultValue: string
): [string, (string) => void] {
  const [innerValue, setInnerValue] = useState(defaultValue);

  useEffect(() => {
    const handleHashChange = () =>
      setInnerValue(getHashParam(key, defaultValue));
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [key]);

  const setValue = useCallback(
    value => {
      if (typeof value === "function") {
        setHashParam(key, value(getHashParam(key, defaultValue)));
      } else {
        setHashParam(key, value);
      }
    },
    [key]
  );

  return [innerValue || defaultValue, setValue];
}
