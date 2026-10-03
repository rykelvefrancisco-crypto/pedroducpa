import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Instagram, MessageCircle } from "lucide-react";
import { useState } from "react";
import brandAsset from "@/assets/pedro-cpa-brand.png.asset.json";
import { QualificationModal } from "@/components/qualification-modal";
import { ResultsGallery } from "@/components/results-gallery";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { resultsQueryOptions } from "@/lib/results";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(resultsQueryOptions),
  head: () => ({ meta: [
    { title: "Pedro CPA — Método, Cooperação e Agenciamento" },
    { name: "description", content: "Atue com CPA por meio de indicações genuínas, cooperação com plataformas e estrutura para escalar como agente." },
    { property: "og:title", content: "Pedro CPA — Resultados reais com o Método CPA" },
    { property: "og:description", content: "Conheça o modelo de CPA para afiliados e agentes no mercado de casas de apostas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
  errorComponent: ResultsError,
});

function ResultsError() {
  return <div className="grid min-h-screen place-items-center bg-background px-4 text-center"><div><h1 className="font-display text-4xl uppercase text-foreground">Página temporariamente indisponível</h1><p className="mt-3 text-muted-foreground">Atualize a página em alguns instantes.</p></div></div>;
}

function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  return <div className="min-h-screen overflow-hidden bg-background"><SiteHeader /><main>
    <section className="relative min-h-[760px] border-b border-border pt-16 sm:min-h-[800px] sm:pt-20"><div className="hero-grid absolute inset-0 opacity-40" /><div className="hero-glow absolute inset-x-0 top-0 h-[700px]" /><div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 pb-16 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,.85fr)] lg:gap-6 lg:pt-16"><div className="relative z-10"><div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-2 font-mono text-[10px] uppercase text-primary"><span className="size-1.5 animate-pulse rounded-full bg-primary" /> Mercado CPA • Método validado</div><h1 className="mt-7 max-w-4xl font-display text-[clamp(3.8rem,9vw,8.5rem)] uppercase leading-[.82] text-foreground">Mais de <span className="text-primary text-glow">100 mil</span><br />gerados com CPA.</h1><p className="mt-7 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">É agente ou gerente de CPA? Entre em contato e venha rodar conosco.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button onClick={() => setModalOpen(true)} className="animate-pulse-gold px-7">Quero me tornar um agente de elite <ArrowRight className="size-4" /></Button><a href="https://instagram.com/pedro_du_cpa" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-bold text-foreground transition hover:border-primary hover:text-primary"><Instagram className="size-4" /> @pedro_du_cpa</a></div><div className="mt-9 flex items-center gap-3 text-xs text-muted-foreground"><BadgeCheck className="size-4 text-primary" /><span>Indicação genuína. Cooperação transparente. Crescimento estruturado.</span></div></div><div className="relative mx-auto aspect-square w-full max-w-[480px] lg:translate-x-8"><div className="absolute inset-[7%] rounded-full border border-primary/40 shadow-brand" /><div className="absolute inset-[15%] animate-spin-slow rounded-full border border-dashed border-primary/40" /><img src={brandAsset.url} alt="Identidade Pedro CPA" className="relative z-10 size-full rounded-full object-cover [mask-image:radial-gradient(circle,black_58%,transparent_72%)]" /></div></div><div className="absolute bottom-0 left-1/2 z-10 hidden w-full max-w-7xl -translate-x-1/2 grid-cols-3 border-x border-t border-border bg-background/80 backdrop-blur md:grid"><Stat value="+100 mil" label="em resultados" /><Stat value="CPA" label="aquisição real" /><Stat value="1:1" label="direcionamento" /></div></section>

    <section className="relative py-20 sm:py-28"><div className="mx-auto max-w-7xl px-4 sm:px-8"><p className="font-mono text-xs uppercase text-primary">Resultados</p><h2 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[.95] text-foreground sm:text-7xl">Números que deixam rastros.</h2><div className="mt-12"><ResultsGallery /></div></div></section>

    <section className="border-y border-primary/25 bg-primary/5 py-20 sm:py-28"><div className="mx-auto max-w-4xl px-4 text-center sm:px-8"><p className="font-mono text-xs uppercase text-primary">Seu próximo movimento</p><h2 className="mt-5 font-display text-5xl uppercase leading-none text-foreground sm:text-7xl">Quer transformar indicação em uma operação de verdade?</h2><p className="mx-auto mt-5 max-w-xl text-muted-foreground">Responda três perguntas rápidas para o Pedro entender seu momento e iniciar uma conversa direcionada.</p><Button onClick={() => setModalOpen(true)} className="mt-8 animate-pulse-gold px-8">Quero falar com o Pedro <MessageCircle className="size-4" /></Button></div></section>
  </main><footer className="border-b-4 border-primary py-8"><div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-8"><div><span className="font-display text-2xl uppercase">Pedro <span className="text-primary">CPA</span></span><p className="mt-1 text-xs text-muted-foreground">Método. Cooperação. Escala.</p></div><div className="flex flex-wrap gap-5 text-xs font-bold text-muted-foreground"><a href="https://wa.me/5519987266236" target="_blank" rel="noreferrer" className="hover:text-primary">WhatsApp</a><a href="https://instagram.com/pedro_du_cpa" target="_blank" rel="noreferrer" className="hover:text-primary">Instagram</a><Link to="/login" className="hover:text-primary">Área Administrativa</Link></div></div></footer><QualificationModal open={modalOpen} onClose={() => setModalOpen(false)} /></div>;
}

function Stat({ value, label }: { value: string; label: string }) { return <div className="border-r border-border px-8 py-5 last:border-0"><strong className="font-display text-3xl uppercase text-primary">{value}</strong><span className="ml-3 text-xs uppercase text-muted-foreground">{label}</span></div>; }

