// useConsole.js
export function useConsole() {
  function getConsole() {
    if (typeof window !== "undefined") {
      return window.console;
    }
    return global.console;
  }

  const console = getConsole();
  return console;
}