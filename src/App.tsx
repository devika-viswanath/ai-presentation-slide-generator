import './App.css'
import Header from './components/custom/Header'
import Hero from './components/custom/Hero'
import PromptBox from './components/custom/PromptBox'
import { LayoutTemplate, ShieldCheck, Sparkles } from 'lucide-react'

function App() {
  const features = [
    {
      title: 'Polished layouts, instantly',
      description: 'Auto-generated slide structure with balanced spacing, typography, and hierarchy tailored to your topic.',
      icon: LayoutTemplate,
    },
    {
      title: 'On-brand visuals',
      description: 'Cohesive palettes, illustration prompts, and icon suggestions so every deck feels consistent and credible.',
      icon: Sparkles,
    },
    {
      title: 'Export-ready files',
      description: 'Download PPTX or refine in the built-in editor without losing alignment, grids, or media placements.',
      icon: ShieldCheck,
    },
  ]

  const steps = [
    {
      title: 'Describe your story',
      description: 'Share the audience, tone, and goal. The prompt drives outline depth, slide count, and visual direction.',
    },
    {
      title: 'Review the outline',
      description: 'Adjust talking points before slides are built. Keep control over flow while the AI handles layout.',
    },
    {
      title: 'Export & present',
      description: 'Download as PPTX or continue editing. Everything ships aligned to your chosen style in seconds.',
    },
  ]

  return (
    <div className="app-shell relative overflow-hidden">
      <span className="gradient-spot gradient-spot-1" />
      <span className="gradient-spot gradient-spot-2" />
      <span className="gradient-spot gradient-spot-3" />

      <Header />

      <main className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-10 sm:px-6 lg:px-10">
        <section className="glass-panel">
          <div className="flex flex-col gap-12">
            <Hero />
            <PromptBox />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Why teams choose us</p>
              <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">Stay polished without the busywork</h3>
            </div>
            <p className="max-w-md text-sm text-muted-foreground sm:text-base">From brainstorming to delivery, keep every slide coherent, on-brand, and presentation-ready.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white/80 p-5 shadow-lg shadow-primary/5 ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:ring-white/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition duration-300 group-hover:scale-105 group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-4 text-lg font-semibold text-foreground">{title}</h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">How it works</p>
              <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">Ship a deck in three moves</h3>
            </div>
            <p className="max-w-md text-sm text-muted-foreground sm:text-base">Guided steps keep you in control while the AI handles formatting, visuals, and structure.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map(({ title, description }, index) => (
              <div
                key={title}
                className="rounded-2xl border border-border bg-white/80 p-5 shadow-md ring-1 ring-black/5 backdrop-blur dark:border-white/10 dark:bg-slate-900/70 dark:ring-white/5"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <span>Step {index + 1}</span>
                </div>
                <h4 className="mt-3 text-lg font-semibold text-foreground">{title}</h4>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
