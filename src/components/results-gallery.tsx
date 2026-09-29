import { ArrowUpRight, ChevronLeft, ChevronRight, Image as ImageIcon, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useResults } from "@/lib/results";

export function ResultsGallery() {
  const results = useResults();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (delta: number) => setLightbox((current) => (current === null ? null : (current + delta + results.length) % results.length)),
    [results.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  if (!results.length) return <p className="border-y border-border py-8 text-sm text-muted-foreground">Novas referências serão publicadas em breve.</p>;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {results.map((item, index) => (
          <article
            key={item.id}
            onClick={() => item.image && setLightbox(index)}
            className={`group relative min-h-44 overflow-hidden rounded-md border border-border bg-card p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/70 hover:shadow-gold sm:min-h-52 sm:p-5 ${item.image ? "cursor-zoom-in" : ""}`}
          >
            {item.image ? (
              <>
                <img src={item.image} alt={`Referência: ${item.title}`} className="absolute inset-0 size-full object-cover opacity-40 transition duration-500 group-hover:scale-105 group-hover:opacity-55" />
                <div className="absolute inset-0 bg-card-fade" />
                <span className="absolute right-3 top-3 z-10 inline-flex size-8 items-center justify-center rounded-full border border-primary/40 bg-overlay opacity-0 transition group-hover:opacity-100" aria-hidden="true">
                  <ArrowUpRight className="size-4 text-primary" />
                </span>
              </>
            ) : (
              <ImageIcon className="absolute right-4 top-4 size-5 text-border" />
            )}
            <div className="relative flex h-full flex-col justify-end">
              <span className="font-mono text-[10px] uppercase text-primary">Prova #{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{item.title}</p>
              <strong className="mt-1 break-words font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">{item.value}</strong>
            </div>
          </article>
        ))}
      </div>

      {lightbox !== null && results[lightbox]?.image && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-overlay backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Referência: ${results[lightbox].title}`} onClick={close}>
          <div className="flex items-center justify-between px-4 py-4 sm:px-8">
            <span className="font-mono text-xs uppercase text-primary">Prova #{String(lightbox + 1).padStart(2, "0")} / {String(results.length).padStart(2, "0")}</span>
            <button onClick={close} aria-label="Fechar imagem" className="inline-flex size-10 items-center justify-center rounded-full border border-border text-foreground transition hover:border-primary hover:text-primary">
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            {results.length > 1 && (
              <button onClick={(event) => { event.stopPropagation(); step(-1); }} aria-label="Referência anterior" className="absolute left-2 z-10 inline-flex size-11 items-center justify-center rounded-full border border-border bg-card/80 text-foreground transition hover:border-primary hover:text-primary sm:left-6">
                <ChevronLeft className="size-5" />
              </button>
            )}
            <img src={results[lightbox].image!} alt={`Referência: ${results[lightbox].title}`} className="max-h-full max-w-full animate-enter rounded-md border border-border object-contain shadow-modal" onClick={(event) => event.stopPropagation()} />
            {results.length > 1 && (
              <button onClick={(event) => { event.stopPropagation(); step(1); }} aria-label="Próxima referência" className="absolute right-2 z-10 inline-flex size-11 items-center justify-center rounded-full border border-border bg-card/80 text-foreground transition hover:border-primary hover:text-primary sm:right-6">
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>
          <div className="mx-auto w-full max-w-3xl px-6 pb-8 text-center" onClick={(event) => event.stopPropagation()}>
            <p className="text-sm text-muted-foreground">{results[lightbox].title}</p>
            <strong className="mt-1 block font-display text-3xl uppercase text-primary sm:text-4xl">{results[lightbox].value}</strong>
          </div>
        </div>
      )}
    </>
  );
}
