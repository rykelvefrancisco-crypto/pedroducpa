import { Link } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";

export function SiteHeader() {
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl"><div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:h-20 sm:px-8"><Link to="/" className="min-w-0"><span className="block truncate font-display text-2xl uppercase leading-none text-foreground sm:text-3xl">Pedro <span className="text-primary">CPA</span></span><span className="hidden font-mono text-[9px] uppercase text-muted-foreground sm:block">Agenciamento & cooperação</span></Link><Link to="/login" className="inline-flex shrink-0 items-center gap-2 rounded-md border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition hover:border-primary hover:text-primary sm:px-4"><LockKeyhole className="size-3.5" /><span className="hidden sm:inline">Área Administrativa</span><span className="sm:hidden">Admin</span></Link></div></header>;
}
