export default function Footer() {
  return (
    <footer className="w-full bg-white px-6 pb-16 pt-10">
      <div className="mx-auto max-w-5xl">
        <div className="h-px w-full bg-ink" />
        <div className="flex flex-col items-center gap-3 pt-10 text-center">
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
      </div>
    </footer>
  );
}
