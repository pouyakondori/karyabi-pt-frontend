import locale from "../locales/fa.json";

type Dictionary = Record<string, unknown>;

export function t(key: string, dictionary: Dictionary = locale as Dictionary): string {
  const resolved = key
    .split(".")
    .reduce<unknown>((accumulator, part) => {
      if (accumulator && typeof accumulator === "object" && part in (accumulator as Dictionary)) {
        return (accumulator as Dictionary)[part];
      }

      return undefined;
    }, dictionary);

  return typeof resolved === "string" ? resolved : key;
}

export { locale };
