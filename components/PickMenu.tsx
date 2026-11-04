"use client";

/** Bouton « Composer ce menu » : pré-remplit le formulaire de devis puis descend jusqu'à lui. */
export function PickMenu({ id, label, className = "" }: { id: string; label: string; className?: string }) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("pick-menu", { detail: id }));
      }}
    >
      {label}
    </a>
  );
}
