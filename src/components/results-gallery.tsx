import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { useResults } from "@/lib/results";

export function ResultsGallery() {
  const results = useResults();
  if (!results.length) return <p className="border-y border-border py-8 text-sm text-muted-foreground">Novas referências serão publicadas em breve.</p>;
  return <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">{results.map((item, index) => <article key={item.id} className="group relative min-h-44 overflow-hidden rounded-md border border-border bg-card p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-gold sm:min-h-52 sm:p-5">{item.image ? <><img src={item.image} alt={`Referência: ${item.title}`} className="absolute inset-0 size-full object-cover opacity-40 transition duration-500 group-hover:scale-105 group-hover:opacity-55" /><div className="absolute inset-0 bg-card-fade" /></> : <ImageIcon className="absolute right-4 top-4 size-5 text-border" />}<div className="relative flex h-full flex-col justify-end"><span className="font-mono text-[10px] uppercase text-primary">Prova #{String(index + 1).padStart(2, "0")}</span><p className="mt-2 text-xs text-muted-foreground sm:text-sm">{item.title}</p><strong className="mt-1 break-words font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">{item.value}</strong><ArrowUpRight className="absolute bottom-0 right-0 size-4 text-primary opacity-0 transition group-hover:opacity-100" /></div></article>)}</div>;
}
