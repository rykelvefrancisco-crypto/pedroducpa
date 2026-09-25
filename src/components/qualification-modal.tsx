import { ArrowLeft, ArrowRight, Check, ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { open: boolean; onClose: () => void };
const experienceOptions = ["Sim, já faturo", "Conheço pouco", "Não, sou iniciante"];
const objectiveOptions = ["Começar do zero", "Aumentar meu faturamento atual", "Virar agente/cooperador"];

export function QualificationModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [objective, setObjective] = useState("");

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [open, onClose]);

  if (!open) return null;
  const selected = step === 1 ? experience : objective;
  const canContinue = step === 0 ? name.trim().length > 1 : selected.length > 0;
  const finish = () => {
    const text = `Olá, Pedro! Meu nome é ${name.trim()}. Sobre minha experiência com CPA/casas de apostas: ${experience}. Meu objetivo atual é: ${objective}. Quero entender como posso avançar com o método CPA.`;
    window.open(`https://wa.me/5519987266236?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-[100] grid place-items-end bg-overlay p-0 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Qualificação para falar com Pedro">
      <div className="relative w-full overflow-hidden rounded-t-xl border border-border bg-card shadow-modal sm:max-w-xl sm:rounded-xl">
        <div className="h-1 bg-secondary"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
        <button aria-label="Fechar" onClick={onClose} className="absolute right-4 top-5 grid size-10 place-items-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground"><X className="size-5" /></button>
        <div className="min-h-[450px] p-6 pt-14 sm:p-10 sm:pt-14">
          <p className="font-mono text-xs uppercase text-primary">Etapa {step + 1} de 4</p>
          {step === 0 && <div className="animate-enter"><h2 className="mt-4 font-display text-4xl uppercase text-foreground">Qual é o seu nome?</h2><p className="mt-3 text-muted-foreground">Vamos começar pelo básico.</p><input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && canContinue && setStep(1)} placeholder="Digite seu primeiro nome" className="mt-10 w-full border-b border-border bg-transparent py-4 text-xl text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary" /></div>}
          {step === 1 && <Question title="Você já tem experiência com CPA ou casas de apostas?" options={experienceOptions} value={experience} onChange={setExperience} />}
          {step === 2 && <Question title="Qual seu objetivo atual?" options={objectiveOptions} value={objective} onChange={setObjective} />}
          {step === 3 && <div className="animate-enter text-center"><div className="mx-auto grid size-14 place-items-center rounded-full border border-primary bg-primary/10 text-primary"><Check className="size-7" /></div><h2 className="mt-6 font-display text-4xl uppercase text-foreground">Tudo pronto, {name.split(" ")[0]}.</h2><p className="mx-auto mt-4 max-w-sm text-muted-foreground">Suas respostas serão enviadas diretamente para o Pedro iniciar a conversa.</p><Button onClick={finish} className="mt-8 w-full animate-pulse-gold">Finalizar e falar com o Pedro <ExternalLink className="size-4" /></Button><a href="https://instagram.com/pedro_du_cpa" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary">Ou acesse @pedro_du_cpa <ExternalLink className="size-3.5" /></a></div>}
          {step < 3 && <div className="absolute inset-x-6 bottom-6 flex justify-between sm:inset-x-10 sm:bottom-10">{step > 0 ? <Button variant="ghost" onClick={() => setStep(step - 1)}><ArrowLeft className="size-4" /> Voltar</Button> : <span />}<Button disabled={!canContinue} onClick={() => setStep(step + 1)}>Continuar <ArrowRight className="size-4" /></Button></div>}
        </div>
      </div>
    </div>
  );
}

function Question({ title, options, value, onChange }: { title: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return <div className="animate-enter"><h2 className="mt-4 max-w-md font-display text-3xl uppercase leading-tight text-foreground sm:text-4xl">{title}</h2><div className="mt-8 grid gap-3">{options.map((option) => <button key={option} onClick={() => onChange(option)} className={`grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-md border p-4 text-left font-bold transition ${value === option ? "border-primary bg-primary/10 text-primary" : "border-border bg-secondary/40 text-foreground hover:border-primary/60"}`}><span className={`grid size-5 place-items-center rounded-full border ${value === option ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"}`}>{value === option && <Check className="size-3" />}</span><span>{option}</span></button>)}</div></div>;
}
