import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, ImagePlus, LayoutGrid, LogOut, Plus, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { type ResultItem, readResults, saveResults } from "@/lib/results";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Área Administrativa — Pedro CPA" },
    { name: "description", content: "Painel local de gerenciamento das provas sociais da landing page Pedro CPA." },
    { property: "og:title", content: "Área Administrativa — Pedro CPA" },
    { property: "og:description", content: "Acesso local ao painel da galeria Pedro CPA." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}), component: LoginPage,
});

function LoginPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => setAuthenticated(window.sessionStorage.getItem("pedro-cpa-admin") === "true"), []);
  function login(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const data = new FormData(event.currentTarget); if (data.get("username") === "pedrocpa" && data.get("password") === "thebestcpa") { window.sessionStorage.setItem("pedro-cpa-admin", "true"); setAuthenticated(true); setError(""); } else setError("Usuário ou senha incorretos."); }
  if (!authenticated) return <div className="grid min-h-screen place-items-center bg-background px-4"><div className="w-full max-w-md"><Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Voltar para a página</Link><div className="rounded-md border border-border bg-card p-6 shadow-modal sm:p-8"><p className="font-mono text-xs uppercase text-primary">Acesso restrito</p><h1 className="mt-3 font-display text-4xl uppercase">Área administrativa</h1><p className="mt-3 text-sm text-muted-foreground">Demonstração local para gerenciar a galeria.</p><form onSubmit={login} className="mt-8 grid gap-5"><label className="grid gap-2 text-xs font-bold text-muted-foreground">USUÁRIO<input name="username" autoComplete="username" className="rounded-md border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary" /></label><label className="grid gap-2 text-xs font-bold text-muted-foreground">SENHA<input name="password" type="password" autoComplete="current-password" className="rounded-md border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary" /></label>{error && <p className="text-sm text-destructive">{error}</p>}<Button type="submit">Entrar no painel</Button></form></div></div></div>;
  return <AdminPanel onLogout={() => { window.sessionStorage.removeItem("pedro-cpa-admin"); setAuthenticated(false); }} />;
}

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [formError, setFormError] = useState("");
  useEffect(() => setResults(readResults()), []);
  const update = (next: ResultItem[]) => { setResults(next); saveResults(next); };
  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const imageFile = data.get("image");
    try {
      const image = imageFile instanceof File && imageFile.size > 0 ? await compressImage(imageFile) : undefined;
      const item: ResultItem = { id: crypto.randomUUID(), title: String(data.get("title") || ""), value: String(data.get("value") || ""), ...(image ? { image } : {}) };
      update([...results, item]);
      form.reset();
    } catch {
      setFormError("Não foi possível salvar a foto. Escolha uma imagem menor ou remova provas antigas.");
    }
  }
  return <div className="min-h-screen bg-background"><header className="border-b border-border"><div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-8"><div className="min-w-0"><p className="truncate font-display text-2xl uppercase">Pedro <span className="text-primary">CPA</span></p><p className="truncate text-xs text-muted-foreground">Painel local da galeria</p></div><div className="flex shrink-0 gap-2"><Link to="/" className="grid size-11 place-items-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary" title="Ver página"><Eye className="size-4" /></Link><Button variant="ghost" onClick={onLogout} className="px-3" title="Sair"><LogOut className="size-4" /><span className="hidden sm:inline">Sair</span></Button></div></div></header><main className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[340px_1fr]"><aside><div className="sticky top-6 rounded-md border border-border bg-card p-5"><div className="flex items-center gap-3"><Plus className="size-5 text-primary" /><h1 className="font-display text-2xl uppercase">Nova prova</h1></div><form onSubmit={add} className="mt-6 grid gap-4"><Field name="title" label="Título" placeholder="Ex: Comissão semanal" /><Field name="value" label="Valor / resultado" placeholder="Ex: R$ 12.500" /><label className="grid gap-2 text-xs font-bold text-muted-foreground">FOTO (OPCIONAL)<span className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-3 py-3 text-sm font-normal text-foreground hover:border-primary"><ImagePlus className="size-5 shrink-0 text-primary" /><span>Selecionar da galeria</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" /></span></label>{formError && <p className="text-sm text-destructive">{formError}</p>}<Button type="submit">Adicionar à galeria</Button></form></div></aside><section><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><div className="min-w-0"><h2 className="truncate font-display text-4xl uppercase">Provas cadastradas</h2><p className="mt-1 text-sm text-muted-foreground">As alterações aparecem na página pública deste navegador.</p></div><span className="flex shrink-0 items-center gap-2 font-mono text-xs text-primary"><LayoutGrid className="size-4" /> {results.length}</span></div><div className="mt-6 grid gap-3">{results.map((item) => <article key={item.id} className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 rounded-md border border-border bg-card p-4">{item.image ? <img src={item.image} alt="" className="size-[72px] rounded-md object-cover" /> : <div className="grid size-[72px] place-items-center rounded-md border border-border bg-background"><ImagePlus className="size-5 text-muted-foreground" /></div>}<div className="min-w-0"><p className="truncate text-sm text-muted-foreground">{item.title}</p><strong className="mt-1 block truncate font-display text-2xl uppercase text-foreground">{item.value}</strong></div><Button variant="danger" onClick={() => update(results.filter((result) => result.id !== item.id))} className="size-10 shrink-0 p-0" title="Remover"><Trash2 className="size-4" /></Button></article>)}</div></section></main></div>;
}
function Field({ name, label, placeholder, type = "text" }: { name: string; label: string; placeholder: string; type?: string }) { return <label className="grid gap-2 text-xs font-bold text-muted-foreground">{label.toUpperCase()}<input required={name !== "image"} name={name} type={type} placeholder={placeholder} className="rounded-md border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary" /></label>; }

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const source = URL.createObjectURL(file);
    image.onload = () => {
      const maxSize = 1280;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      if (!context) { URL.revokeObjectURL(source); reject(new Error("Canvas indisponível")); return; }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(source);
      resolve(canvas.toDataURL("image/jpeg", 0.76));
    };
    image.onerror = () => { URL.revokeObjectURL(source); reject(new Error("Imagem inválida")); };
    image.src = source;
  });
}
