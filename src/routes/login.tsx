import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Eye, ImagePlus, LayoutGrid, LoaderCircle, LogOut, Plus, Trash2 } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createProof, deleteProof, importLocalProofs, loginAdmin } from "@/lib/proofs.functions";
import { readLocalResults, resultsQueryOptions, STORAGE_KEY } from "@/lib/results";

const ADMIN_SESSION_KEY = "pedro-cpa-admin-token";
const IMPORTED_KEY = "pedro-cpa-cloud-imported";

export const Route = createFileRoute("/login")({
  loader: ({ context }) => context.queryClient.ensureQueryData(resultsQueryOptions),
  head: () => ({ meta: [
    { title: "Área Administrativa — Pedro CPA" },
    { name: "description", content: "Painel de gerenciamento das referências da página Pedro CPA." },
    { property: "og:title", content: "Área Administrativa — Pedro CPA" },
    { property: "og:description", content: "Acesso ao painel da galeria Pedro CPA." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}), component: LoginPage,
});

function LoginPage() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  useEffect(() => setToken(window.sessionStorage.getItem(ADMIN_SESSION_KEY) ?? ""), []);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoggingIn(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await loginAdmin({ data: { username: String(data.get("username") ?? ""), password: String(data.get("password") ?? "") } });
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, response.token);
      setToken(response.token);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Usuário ou senha incorretos.");
    } finally {
      setLoggingIn(false);
    }
  }

  if (!token) return <div className="grid min-h-screen place-items-center bg-background px-4"><div className="w-full max-w-md"><Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Voltar para a página</Link><div className="rounded-md border border-border bg-card p-6 shadow-modal sm:p-8"><p className="font-mono text-xs uppercase text-primary">Acesso restrito</p><h1 className="mt-3 font-display text-4xl uppercase">Área administrativa</h1><p className="mt-3 text-sm text-muted-foreground">Gerencie as referências exibidas para todos os visitantes.</p><form onSubmit={login} className="mt-8 grid gap-5"><Field name="username" label="Usuário" placeholder="Seu usuário" autoComplete="username" /><Field name="password" label="Senha" placeholder="Sua senha" type="password" autoComplete="current-password" />{error && <p className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={loggingIn}>{loggingIn && <LoaderCircle className="size-4 animate-spin" />} Entrar no painel</Button></form></div></div></div>;
  return <AdminPanel token={token} onLogout={() => { window.sessionStorage.removeItem(ADMIN_SESSION_KEY); setToken(""); }} />;
}

function AdminPanel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const queryClient = useQueryClient();
  const { data: results } = useSuspenseQuery(resultsQueryOptions);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [importing, setImporting] = useState(false);

  const refresh = async () => queryClient.invalidateQueries({ queryKey: resultsQueryOptions.queryKey });
  const addMutation = useMutation({ mutationFn: createProof, onSuccess: refresh });
  const deleteMutation = useMutation({ mutationFn: deleteProof, onSuccess: refresh });

  useEffect(() => {
    const localResults = readLocalResults();
    if (!localResults || window.localStorage.getItem(IMPORTED_KEY) === "true") return;
    setImporting(true);
    importLocalProofs({ data: { token, proofs: localResults } })
      .then(async () => {
        window.localStorage.setItem(IMPORTED_KEY, "true");
        window.localStorage.removeItem(STORAGE_KEY);
        setNotice("Suas referências antigas foram publicadas para todos os visitantes.");
        await refresh();
      })
      .catch(() => setFormError("Não foi possível importar as referências antigas."))
      .finally(() => setImporting(false));
  }, [token]);

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const imageFile = data.get("image");
    try {
      const image = imageFile instanceof File && imageFile.size > 0 ? await compressImage(imageFile) : undefined;
      await addMutation.mutateAsync({ data: { token, title: String(data.get("title") ?? ""), value: String(data.get("value") ?? ""), image } });
      form.reset();
      setNotice("Referência publicada para todos os visitantes.");
    } catch (addError) {
      setFormError(addError instanceof Error ? addError.message : "Não foi possível salvar a referência.");
    }
  }

  async function remove(id: string) {
    setFormError("");
    try {
      await deleteMutation.mutateAsync({ data: { token, id } });
      setNotice("Referência removida da página pública.");
    } catch (removeError) {
      setFormError(removeError instanceof Error ? removeError.message : "Não foi possível remover a referência.");
    }
  }

  const busy = importing || addMutation.isPending || deleteMutation.isPending;
  return <div className="min-h-screen bg-background"><header className="border-b border-border"><div className="mx-auto grid h-20 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-8"><div className="min-w-0"><p className="truncate font-display text-2xl uppercase">Pedro <span className="text-primary">CPA</span></p><p className="truncate text-xs text-muted-foreground">Painel público de referências</p></div><div className="flex shrink-0 gap-2"><Link to="/" className="grid size-11 place-items-center rounded-md border border-border text-muted-foreground hover:border-primary hover:text-primary" title="Ver página"><Eye className="size-4" /></Link><Button variant="ghost" onClick={onLogout} className="px-3" title="Sair"><LogOut className="size-4" /><span className="hidden sm:inline">Sair</span></Button></div></div></header><main className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[340px_1fr]"><aside><div className="sticky top-6 rounded-md border border-border bg-card p-5"><div className="flex items-center gap-3"><Plus className="size-5 text-primary" /><h1 className="font-display text-2xl uppercase">Nova referência</h1></div><form onSubmit={add} className="mt-6 grid gap-4"><Field name="title" label="Título" placeholder="Ex: Comissão semanal" /><Field name="value" label="Valor / resultado" placeholder="Ex: R$ 12.500" /><label className="grid gap-2 text-xs font-bold text-muted-foreground">FOTO (OPCIONAL)<span className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-3 py-3 text-sm font-normal text-foreground hover:border-primary"><ImagePlus className="size-5 shrink-0 text-primary" /><span>Selecionar da galeria</span><input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" /></span></label>{formError && <p className="text-sm text-destructive">{formError}</p>}{notice && <p className="text-sm text-primary">{notice}</p>}<Button type="submit" disabled={busy}>{busy && <LoaderCircle className="size-4 animate-spin" />} Publicar referência</Button></form></div></aside><section><div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4"><div className="min-w-0"><h2 className="font-display text-4xl uppercase">Referências cadastradas</h2><p className="mt-1 text-sm text-muted-foreground">As alterações aparecem para todos que acessarem o link.</p></div><span className="flex shrink-0 items-center gap-2 font-mono text-xs text-primary"><LayoutGrid className="size-4" /> {results.length}</span></div><div className="mt-6 grid gap-3">{results.map((item) => <article key={item.id} className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 rounded-md border border-border bg-card p-4">{item.image ? <img src={item.image} alt={`Referência: ${item.title}`} className="size-[72px] rounded-md object-cover" /> : <div className="grid size-[72px] place-items-center rounded-md border border-border bg-background"><ImagePlus className="size-5 text-muted-foreground" /></div>}<div className="min-w-0"><p className="truncate text-sm text-muted-foreground">{item.title}</p><strong className="mt-1 block truncate font-display text-2xl uppercase text-foreground">{item.value}</strong></div><Button variant="danger" onClick={() => remove(item.id)} disabled={busy} className="size-10 shrink-0 p-0" title="Remover"><Trash2 className="size-4" /></Button></article>)}</div></section></main></div>;
}

function Field({ name, label, placeholder, type = "text", autoComplete }: { name: string; label: string; placeholder: string; type?: string; autoComplete?: string }) {
  return <label className="grid gap-2 text-xs font-bold text-muted-foreground">{label.toUpperCase()}<input required name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} className="rounded-md border border-border bg-background px-3 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-primary" /></label>;
}

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
      if (!context) { URL.revokeObjectURL(source); reject(new Error("Não foi possível preparar a foto.")); return; }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(source);
      resolve(canvas.toDataURL("image/jpeg", 0.76));
    };
    image.onerror = () => { URL.revokeObjectURL(source); reject(new Error("Imagem inválida.")); };
    image.src = source;
  });
}
