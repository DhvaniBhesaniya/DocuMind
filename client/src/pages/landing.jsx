import React from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider.jsx";
import { useAuth } from "@/hooks/useAuth.js";
import { CheckCircle, Upload, MessageSquare, Search, Zap, Shield, Globe, Star } from "lucide-react";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect authenticated users to the app
  React.useEffect(() => {
    if (isAuthenticated) {
      setLocation("/app");
    }
  }, [isAuthenticated, setLocation]);

  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: "Smart PDF Upload",
      description: "Drag & drop multiple PDFs with automatic text extraction and intelligent processing"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "AI-Powered Search",
      description: "Find relevant information using advanced semantic search and vector embeddings"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Contextual Chat",
      description: "Engage in natural conversations with your documents, complete with source citations"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Get instant responses powered by Google's Gemini AI and Pinecone vector database"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your documents are processed securely with enterprise-grade encryption"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cloud-Based",
      description: "Access your documents and conversations from anywhere, on any device"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Research Analyst",
      content: "This tool has revolutionized how I work with research papers. I can quickly find relevant information across hundreds of documents.",
      avatar: "SC"
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Legal Consultant",
      content: "The accuracy of responses and source citations is impressive. It's like having a research assistant that never sleeps.",
      avatar: "MR"
    },
    {
      name: "Emily Johnson",
      role: "Product Manager",
      content: "Perfect for analyzing market research reports. The AI understands context and provides exactly what I need.",
      avatar: "EJ"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Upload up to 5 PDFs",
        "100 AI queries per month",
        "Basic search functionality",
        "Email support"
      ],
      cta: "Get Started Free",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Best for professionals",
      features: [
        "Upload unlimited PDFs",
        "Unlimited AI queries",
        "Advanced semantic search",
        "Priority support",
        "Export conversations",
        "Team collaboration"
      ],
      cta: "Start Pro Trial",
      highlighted: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Custom integrations",
        "SSO authentication",
        "Dedicated support",
        "Custom AI models",
        "On-premise deployment"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-foreground">AI DocChat</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform flex items-center justify-center ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                >
                  {theme === "dark" ? (
                    <svg className="w-3 h-3 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  )}
                </span>
              </button>
              <Link href="/auth">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth">
                <Button className="btn-ai">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            Powered by Google Gemini AI
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-bold text-foreground mb-6">
            Chat with Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Documents</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform your PDFs into intelligent conversations. Upload, search, and get instant answers 
            with AI-powered document analysis and contextual responses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="btn-ai px-8 py-3">
                <Zap className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-3">
              <MessageSquare className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 5 documents free • Instant setup
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything you need to unlock your documents
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform makes document analysis effortless with cutting-edge technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 ai-gradient rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by professionals worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our users are saying about AI DocChat
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-medium">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose the plan that's right for you. Upgrade or downgrade at any time.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`border-border bg-card relative ${plan.highlighted ? 'ring-2 ring-primary shadow-lg scale-105' : ''}`}>
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href="/auth">
                    <Button className={`w-full ${plan.highlighted ? 'btn-ai' : ''}`} variant={plan.highlighted ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Ready to revolutionize your document workflow?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of professionals who are already using AI DocChat to unlock insights from their documents.
          </p>
          <Link href="/auth">
            <Button size="lg" className="btn-ai px-8 py-3">
              <Zap className="w-4 h-4 mr-2" />
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 ai-gradient rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-bold text-foreground">AI DocChat</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Transform your documents into intelligent conversations with AI-powered analysis.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 AI DocChat. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}