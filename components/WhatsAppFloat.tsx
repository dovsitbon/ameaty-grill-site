import { WhatsAppIcon } from "@/components/icons";
import { waLink } from "@/lib/quote";

export function WhatsAppFloat({ label, message }: { label: string; message: string }) {
  return (
    <a
      href={waLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-braise text-cream shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] ring-1 ring-cream/30 transition-colors duration-500 hover:bg-braise-deep hover:shadow-[0_0_40px_-6px_rgba(168,50,30,0.8)] md:end-8 md:bottom-8"
    >
      <WhatsAppIcon />
    </a>
  );
}
