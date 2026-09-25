import { useEffect, useState } from "react";

export type ResultItem = { id: string; title: string; value: string; image?: string };

export const DEFAULT_RESULTS: ResultItem[] = [
  { id: "1", title: "Comissão em uma semana", value: "R$ 12.840" },
  { id: "2", title: "Resultado de operação", value: "R$ 27.500" },
  { id: "3", title: "Equipe em expansão", value: "+340 FTDs" },
  { id: "4", title: "Volume acumulado", value: "+R$ 100 mil" },
  { id: "5", title: "Campanha direcionada", value: "186 cadastros" },
  { id: "6", title: "Crescimento mensal", value: "+72%" },
  { id: "7", title: "Comissão liberada", value: "R$ 8.920" },
  { id: "8", title: "Novos depositantes", value: "94 FTDs" },
];

const STORAGE_KEY = "pedro-cpa-results";

export function readResults(): ResultItem[] {
  if (typeof window === "undefined") return DEFAULT_RESULTS;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ResultItem[]) : DEFAULT_RESULTS;
  } catch {
    return DEFAULT_RESULTS;
  }
}

export function saveResults(results: ResultItem[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  window.dispatchEvent(new CustomEvent("pedro-cpa-results-updated"));
}

export function useResults() {
  const [results, setResults] = useState<ResultItem[]>(DEFAULT_RESULTS);
  useEffect(() => {
    const sync = () => setResults(readResults());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("pedro-cpa-results-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("pedro-cpa-results-updated", sync);
    };
  }, []);
  return results;
}
