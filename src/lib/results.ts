import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getProofs, type ProofItem } from "@/lib/proofs.functions";

export type ResultItem = ProofItem;

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

export const STORAGE_KEY = "pedro-cpa-results";

export function readLocalResults(): ResultItem[] | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as ResultItem[]) : null;
  } catch {
    return null;
  }
}

export const resultsQueryOptions = queryOptions({
  queryKey: ["public-proofs"],
  queryFn: () => getProofs(),
  staleTime: 30_000,
});

export function useResults() {
  return useSuspenseQuery(resultsQueryOptions).data;
}
