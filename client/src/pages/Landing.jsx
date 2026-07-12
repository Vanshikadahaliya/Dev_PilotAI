import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText, FolderSearch, Globe, GitPullRequest, Bug, Sparkles,
  ArrowRight, Check, Star, ChevronDown,
} from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  { icon: FileText, title: 'README Generator', desc: 'Generate professional READMEs with installation guides, tech stack, and folder structure.' },
  { icon: FolderSearch, title: 'Repository Analyzer', desc: 'Connect GitHub and analyze your repos to detect tech stack, features, and structure.' },
  { icon: Sparkles, title: 'Project Descriptions', desc: 'Create short, medium, LinkedIn, and resume descriptions for any project.' },
  { icon: Globe, title: 'Portfolio Builder', desc: 'Generate a complete portfolio website from your GitHub profile and export as HTML.' },
  { icon: GitPullRequest, title: 'PR Summarizer', desc: 'Get executive summaries, key changes, risks, and improvement suggestions.' },
  { icon: Bug, title: 'Bug Explainer', desc: 'Understand errors with root cause analysis, fix suggestions, and code examples.' },
];

const steps = [
  { step: '01', title: 'Connect GitHub', desc: 'Sign in with your GitHub account to sync repositories.' },
  { step: '02', title: 'Select a Tool', desc: 'Choose from README generator, portfolio builder, PR summarizer, and more.' },
  { step: '03', title: 'Generate & Export', desc: 'AI analyzes your code and generates professional output you can copy or download.' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'Full-Stack Developer', text: 'DevPilot AI saved me hours on README documentation. The generated output is incredibly professional.', avatar: 'SC' },
  { name: 'Marcus Johnson', role: 'Open Source Maintainer', text: 'The PR summarizer is a game-changer for reviewing contributions. Highly recommend the Pro plan.', avatar: 'MJ' },
  { name: 'Priya Sharma', role: 'Junior Developer', text: 'Bug Explainer helped me understand complex stack traces when I was learning. Essential tool!', avatar: 'PS' },
];

const faqs = [
  { q: 'How does DevPilot AI work?', a: 'DevPilot connects to your GitHub account, analyzes your repositories, and uses AI to generate professional documentation, descriptions, and more.' },
  { q: 'What AI models are supported?', a: 'We support OpenAI (GPT-4o-mini) and Google Gemini. You can configure the provider via environment variables.' },
  { q: 'Is my code data secure?', a: 'We only access repository metadata and file structure via GitHub API. We never store your source code.' },
  { q: 'Can I cancel anytime?', a: 'Yes, you can use the free plan indefinitely or upgrade to Pro. No long-term commitments required.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="page-panel rounded-2xl p-8 sm:p-12 lg:p-16">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div {...fadeUp}>
                <span className="section-label mb-6">
                  <Sparkles className="w-4 h-4" /> GitHub-style workspace for AI docs
                </span>
              </motion.div>

              <motion.h1
                {...fadeUp}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                Generate polished repository docs, summaries, and portfolio content
              </motion.h1>

              <motion.p
                {...fadeUp}
                transition={{ delay: 0.2 }}
                className="text-lg text-text-muted max-w-2xl mx-auto mb-8"
              >
                DevPilot AI analyzes your repositories and produces READMEs, portfolio sites, project descriptions, PR summaries, and bug explanations.
              </motion.p>

              <motion.div
                {...fadeUp}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get started free <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore features
                  </Button>
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16"
              >
                <ChevronDown className="w-6 h-6 mx-auto text-text-muted" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label mb-4">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything you need</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Six focused AI tools designed for the GitHub workflow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card hover className="h-full">
                  <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-text-muted">{f.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label mb-4">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Three simple steps</h2>
            <p className="text-text-muted">Connect GitHub, choose a tool, export the result.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.step} {...fadeUp} transition={{ delay: i * 0.15 }} className="text-center">
                <div className="text-5xl font-bold text-primary mb-4">{s.step}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-text-muted">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label mb-4">Pricing</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple pricing</h2>
            <p className="text-text-muted">Start free, upgrade when you need more</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div {...fadeUp}>
              <Card className="h-full">
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold mb-6">$0<span className="text-base text-text-muted font-normal">/mo</span></div>
                <ul className="space-y-3 mb-8">
                  {['5 generations/month', 'README Generator', 'Repository Analyzer', 'Project Descriptions', 'Bug Explainer'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login"><Button variant="outline" className="w-full">Get Started</Button></Link>
              </Card>
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
              <Card className="h-full border-primary/30 relative">
                <span className="absolute -top-3 right-6 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">Popular</span>
                <h3 className="text-xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-6">$12<span className="text-base text-text-muted font-normal">/mo</span></div>
                <ul className="space-y-3 mb-8">
                  {['Unlimited generations', 'Everything in Free', 'Portfolio Builder', 'PR Summaries', 'Priority support'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login"><Button className="w-full">Upgrade to Pro</Button></Link>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label mb-4">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by developers</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.1 }}>
                <Card className="h-full">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-text-muted mb-4">&ldquo;{t.text}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="section-label mb-4">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">FAQ</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.details key={i} {...fadeUp} transition={{ delay: i * 0.05 }} className="group bg-surface border border-border rounded-md">
                <summary className="flex items-center justify-between p-5 cursor-pointer font-medium hover:text-primary transition-colors list-none">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-text-muted group-open:rotate-180 transition-transform" />
                </summary>
                <p className="px-5 pb-5 text-sm text-text-muted">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
