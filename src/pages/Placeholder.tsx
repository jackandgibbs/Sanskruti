import { Link } from "react-router";

export default function Placeholder({ title }: { title: string }) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 pt-32 pb-24 text-center">
      <span className="eyebrow">Sanskruti</span>
      <h1 className="mt-4 font-heading text-5xl text-forest">{title}</h1>
      <div className="gold-rule my-7 w-24" />
      <p className="text-charcoal/65 leading-relaxed">
        This page is part of the Sanskruti experience and is ready to be designed. The homepage
        showcases the full visual language — explore it to feel the boutique.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-forest px-7 py-3 text-sm font-medium text-ivory transition-colors hover:bg-forest-700"
      >
        Back to Home
      </Link>
    </section>
  );
}
