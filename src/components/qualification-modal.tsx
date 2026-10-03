import { Check, ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Props = { open: boolean; onClose: () => void };

export function QualificationModal({ open, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [open, onClose]);

  if (!open) return null;
  const canContinue = name.trim().length > 1;
  const whatsappUrl = `https://wa.me/5519987266236?text=${encodeURIComponent(`Olá, Pedro! Meu nome é ${name.trim()} e quero trabalhar contigo.`)}`;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-end bg-overlay p-0 backdrop-blur-sm sm:place-items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Qualificação para falar com Pedro">
      <div className="relative w-full overflow-hidden rounded-t-xl border border-border bg-card shadow-modal sm:max-w-xl sm:rounded-xl">
        <div className="h-1 bg-secondary"><div className="h-full bg-primary transition-all duration-500" style={{ width: `${((step + 1) / 2) * 100}%` }} /></div>
        <button aria-label="Fechar" onClick={onClose} className="absolute right-4 top-5 grid size-10 place-items-center rounded-md text-muted-foreground transition hover:bg-secondary hover:text-foreground"><X className="size-5" /></button>
        <div className="min-h-[380px] p-6 pt-14 sm:p-10 sm:pt-14">
          <p className="font-mono text-xs uppercase text-primary">Etapa {step + 1} de 2</p>
          {step === 0 && <div className="animate-enter"><h2 className="mt-4 font-display text-4xl uppercase text-foreground">Qual é o seu nome?</h2><p className="mt-3 text-muted-foreground">Vamos começar pelo básico.</p><input autoFocus value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && canContinue && setStep(1)} placeholder="Digite seu primeiro nome" className="mt-10 w-full border-b border-border bg-transparent py-4 text-xl text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary" /><Button disabled={!canContinue} onClick={() => setStep(1)} className="mt-10 w-full">Continuar</Button></div>}
          {step === 1 && <div className="animate-enter text-center"><div className="mx-auto grid size-14 place-items-center rounded-full border border-primary bg-primary/10 text-primary"><Check className="size-7" /></div><h2 className="mt-6 font-display text-4xl uppercase text-foreground">Tudo pronto, {name.split(" ")[0]}.</h2><p className="mx-auto mt-4 max-w-sm text-muted-foreground">Sua mensagem será enviada diretamente para o Pedro iniciar a conversa.</p><Button asChild className="mt-8 w-full animate-pulse-gold"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Finalizar e falar com o Pedro <ExternalLink className="size-4" /></a></Button><a href="https://instagram.com/pedro_du_cpa" target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary">Ou acesse @pedro_du_cpa <ExternalLink className="size-3.5" /></a></div>}
        </div>
      </div>
    </div>
  );
}
