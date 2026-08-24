export default function Footer() {
  return (
    <footer className="w-full bg-white pb-16 pt-10">
      {/* Full-bleed divider, edge to edge */}
      <div className="h-px w-full bg-ink" />
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 pt-10 text-center">
        <p className="text-sm text-ink/80">created by Sahib / Sabby</p>
        <p className="text-sm text-ink/60">
          support :{" "}
          <a
            href="mailto:info.hellosienna@gmail.com"
            className="text-[#3b82f6] hover:underline"
          >
            info.hellosienna@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
