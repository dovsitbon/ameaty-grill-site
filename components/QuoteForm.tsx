"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { FORMULA_CHOICES, isoDay, isPhone, quoteMessage, takenDates, TYPES, waLink, YESNO, type EventType, type FormulaChoice, type YesNo } from "@/lib/quote";

type Errors = Partial<Record<"type" | "name" | "phone", string>>;

function Field({ label, hint, error, children, id }: { label: ReactNode; hint?: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-[0.8125rem] leading-relaxed text-gold">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-[0.8125rem] text-gold">
          {error}
        </p>
      )}
    </div>
  );
}

function Choices<T extends string>({ name, label, options, labels, value, onChange, labelId, error }: { name: string; label: ReactNode; options: readonly T[]; labels: Record<T, string>; value: T | ""; onChange: (v: T) => void; labelId?: string; error?: string }) {
  const auto = useId();
  const id = labelId ?? auto;
  return (
    <div>
      <p className="label" id={id} tabIndex={-1}>
        {label}
      </p>
      <div role="radiogroup" aria-labelledby={id} {...(error ? { "aria-describedby": `${id}-err` } : {})} className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o} className="chip">
            <input type="radio" name={name} value={o} checked={value === o} onChange={() => onChange(o)} className="sr-only" />
            {labels[o]}
          </label>
        ))}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-[0.8125rem] text-gold">
          {error}
        </p>
      )}
    </div>
  );
}

function Legend({ n, children }: { n: string; children: ReactNode }) {
  return (
    <legend className="mb-8 flex items-baseline gap-4">
      <span className="num text-[0.8125rem] text-gold">{n}</span>
      <span className="display text-[1.7rem] rtl:text-[1.6rem]">{children}</span>
    </legend>
  );
}

/**
 * Demande de devis : événement, date, heure, lieu, invités, formule, bar à alcool, cacheroute, budget, coordonnées.
 * Le récapitulatif part sur WhatsApp dans la langue du visiteur. Aucun paiement, rien n'est stocké.
 */
export function QuoteForm() {
  const { lang, d } = useLocale();
  const f = d.quote.fields;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [type, setType] = useState<EventType | "">("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [guests, setGuests] = useState("");
  const [time, setTime] = useState("");
  const [formula, setFormula] = useState<FormulaChoice | "">("");
  const [bar, setBar] = useState<YesNo | "">("");
  const [kashrut, setKashrut] = useState("");
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour lue une fois au montage
  useEffect(() => setToday(isoDay(new Date())), []);

  // Les boutons « Choisir cette formule » des cartes pré-remplissent la formule (ou le bar)
  useEffect(() => {
    const onPick = (e: Event) => {
      const m = (e as CustomEvent<string>).detail;
      if (m === "bar") setBar("yes");
      else if (m === "live" || m === "table") setFormula(m);
      else if (m === "signature") setFormula("both");
      setSent(null);
    };
    window.addEventListener("pick-menu", onPick);
    return () => window.removeEventListener("pick-menu", onPick);
  }, []);

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const dateHint = validDate ? (takenDates.has(date) ? f.dateTaken : takenDates.size > 0 ? f.dateFree : undefined) : undefined;

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Errors = {};
    if (!type) e.type = d.quote.pickType;
    if (!name.trim()) e.name = d.quote.required;
    if (!phone.trim()) e.phone = d.quote.required;
    else if (!isPhone(phone)) e.phone = d.quote.invalidPhone;
    setErrors(e);
    if (Object.keys(e).length || !type) {
      const first = (["type", "name", "phone"] as const).find((k) => e[k]);
      if (first) document.getElementById(id(first))?.focus();
      return;
    }
    const text = quoteMessage(
      { type, date: validDate ? date : "", time, place: place.trim(), guests: guests.trim(), formula, bar, kashrut: kashrut.trim(), budget: budget.trim(), name: name.trim(), phone: phone.trim(), message: message.trim() },
      lang,
      d,
    );
    const url = waLink(text);
    window.open(url, "_blank", "noopener");
    setSent(url);
  };

  const err = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-err` } : {});
  const optional = <span className="normal-case tracking-normal opacity-80">({f.optional})</span>;

  if (sent)
    return (
      <div className="fade-in py-6 text-center md:py-10" role="status">
        <p className="display text-[3rem] leading-none text-copper">{d.quote.success.thanks}</p>
        <h3 className="display mt-5 text-[1.8rem]">{d.quote.success.title}</h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{d.quote.success.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={sent} target="_blank" rel="noopener noreferrer" className="btn-solid">
            <WhatsAppIcon className="h-4 w-4" />
            {d.quote.success.again}
          </a>
          <button type="button" onClick={() => setSent(null)} className="link-line nav-link">
            {d.quote.success.reset}
          </button>
        </div>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-14">
      <fieldset className="space-y-8">
        <Legend n="01">{d.quote.steps.event}</Legend>
        <Choices name="type" labelId={id("type")} label={`${f.type} *`} options={TYPES} labels={f.types} value={type} onChange={setType} error={errors.type} />
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("date")} label={f.date} hint={dateHint}>
            <input id={id("date")} type="date" min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" />
          </Field>
          <Field id={id("time")} label={f.time}>
            <input id={id("time")} type="time" step={900} value={time} onChange={(e) => setTime(e.target.value)} className="field" />
          </Field>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("place")} label={f.place}>
            <input id={id("place")} type="text" autoComplete="address-level2" placeholder={f.placePlaceholder} value={place} onChange={(e) => setPlace(e.target.value)} className="field" maxLength={160} />
          </Field>
          <Field id={id("guests")} label={f.guests}>
            <input id={id("guests")} type="number" inputMode="numeric" min={1} max={5000} value={guests} onChange={(e) => setGuests(e.target.value)} className="field" />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-8">
        <Legend n="02">{d.quote.steps.menu}</Legend>
        <Choices name="formula" label={f.formula} options={FORMULA_CHOICES} labels={f.formulas} value={formula} onChange={setFormula} />
        <Choices name="bar" label={f.bar} options={YESNO} labels={f.yesno} value={bar} onChange={setBar} />
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("kashrut")} label={<>{f.kashrut} {optional}</>}>
            <input id={id("kashrut")} type="text" placeholder={f.kashrutPlaceholder} value={kashrut} onChange={(e) => setKashrut(e.target.value)} className="field" maxLength={160} />
          </Field>
          <Field id={id("budget")} label={<>{f.budget} {optional}</>}>
            <input id={id("budget")} type="text" placeholder={f.budgetPlaceholder} value={budget} onChange={(e) => setBudget(e.target.value)} className="field" maxLength={60} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-8">
        <Legend n="03">{d.quote.steps.contact}</Legend>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("name")} label={`${f.name} *`} error={errors.name}>
            <input id={id("name")} type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={120} {...err("name")} />
          </Field>
          <Field id={id("phone")} label={`${f.phone} *`} error={errors.phone}>
            <input id={id("phone")} type="tel" autoComplete="tel" inputMode="tel" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="field rtl:text-end" maxLength={30} {...err("phone")} />
          </Field>
        </div>
        <Field id={id("message")} label={<>{f.message} {optional}</>}>
          <textarea id={id("message")} rows={3} placeholder={f.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" maxLength={1500} />
        </Field>
      </fieldset>

      <div>
        <button type="submit" className="btn-solid w-full sm:w-auto">
          <WhatsAppIcon className="h-4 w-4" />
          {d.quote.submit}
        </button>
        <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">{d.quote.hint}</p>
      </div>
    </form>
  );
}
