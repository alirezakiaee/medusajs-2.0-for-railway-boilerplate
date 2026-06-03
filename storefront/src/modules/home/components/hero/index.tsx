import { clx } from "@medusajs/ui"
import { ArrowRight } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <section className="relative h-[75vh] w-full overflow-hidden bg-ui-bg-subtle">
      <div className="absolute inset-0 bg-gradient-to-br from-ui-bg-subtle via-ui-bg-base to-ui-bg-muted" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-ui-fg-interactive/5 via-transparent to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <div
          className="flex flex-col items-center gap-6"
          style={{ animation: "fade-in-top 0.6s cubic-bezier(0.5, 0, 0.5, 1) forwards" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-ui-border-base bg-ui-bg-base/60 px-4 py-1.5 text-xs uppercase tracking-wider text-ui-fg-subtle backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ui-fg-interactive opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ui-fg-interactive" />
            </span>
            New Collection 2026
          </span>

          <Heading
            level="h1"
            className="text-4xl leading-tight font-normal text-ui-fg-base small:text-5xl medium:text-6xl"
          >
            Elevate your style with
            <span className="block text-ui-fg-interactive">
              timeless essentials
            </span>
          </Heading>

          <p className="max-w-xl text-base leading-relaxed text-ui-fg-subtle small:text-lg">
            Discover curated collections designed for modern living. Quality crafting, sustainable materials, and effortless elegance.
          </p>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{ animation: "fade-in-right 0.6s 0.15s cubic-bezier(0.5, 0, 0.5, 1) forwards", opacity: 0 }}
        >
          <Button
            variant="secondary"
            size="large"
            className="group gap-2 rounded-2xl px-8 py-3.5 text-base"
            asChild
          >
            <a href="/store">
              Shop Collection
              <ArrowRight className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </a>
          </Button>

          <Button
            variant="secondary"
            size="large"
            className="rounded-2xl border border-ui-border-base bg-ui-bg-base/60 px-8 py-3.5 text-base backdrop-blur-sm"
          >
            Learn More
          </Button>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ui-bg-base to-transparent"
        style={{ animation: "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02) forwards" }}
      />
    </section>
  )
}

export default Hero
