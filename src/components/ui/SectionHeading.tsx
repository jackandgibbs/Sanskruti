import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: Props) {
  return (
    <div
      className={cn(
        "mb-10 md:mb-14",
        align === "center" && "text-center",
        align === "left" && "text-left"
      )}
    >
      {eyebrow && <span className="eyebrow mb-3 block">{eyebrow}</span>}
      <h2 className="font-heading text-3xl md:text-4xl text-charcoal">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-3 text-sm text-muted max-w-lg",
            align === "center" && "mx-auto"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
