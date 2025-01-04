import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { UserButton } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import {
  ArrowRightIcon,
  LogInIcon,
  Bot,
  FileText,
  Zap,
  CheckCircle2,
  Brain,
  Search,
  Lock,
  Sparkles,
  BarChart,
  Clock,
  Users,
  Loader2,
} from "lucide-react";
import { eq } from "drizzle-orm";
import SubscriptionButton from "@/components/SubscriptionButton";
import { checkSubscription } from "@/lib/subscription";
import Image from "next/image";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat = userId
    ? (await db.select().from(chats).where(eq(chats.userId, userId)))[0]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-gray-700 bg-gray-900/50 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">SakhiAI</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuth ? (
              <>
                <SubscriptionButton isPro={isPro} />
                <UserButton afterSwitchSessionUrl="/" />
              </>
            ) : (
              <div className="flex gap-4">
                <Link href="/sign-in">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-gray-100/10"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="secondary" size="sm" className="bg-gray-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
            <span className="text-sm font-medium text-blue-400">
              ✨ Your AI PDF Chat Assistant
            </span>
          </div>

          <h1 className="mb-8 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Chat with your PDFs using{" "}
            <span className="text-blue-500">SakhiAI</span>
          </h1>

          <p className="mb-12 text-lg text-gray-400 max-w-2xl mx-auto">
            Transform your PDF documents into interactive conversations. Get
            instant answers, analyze content, and extract insights with our
            advanced AI chat interface.
          </p>

          {/* File Upload or Auth Section */}
          <div className="mx-auto max-w-lg">
            {isAuth ? (
              <div className="space-y-4">
                {!firstChat || isPro ? (
                  <FileUpload />
                ) : (
                  <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <p className="text-yellow-200 mb-4">
                      You have reached the limit for free accounts. Please
                      upgrade to Pro to upload more PDFs.
                    </p>
                    <SubscriptionButton isPro={isPro} />
                  </div>
                )}
                {firstChat && (
                  <Link href={`chat/${firstChat.id}`}>
                    <Button className="w-full bg-blue-600/40 hover:bg-blue-700/40 mt-2 group">
                      <span>Continue to Your Chats</span>
                      <ArrowRightIcon className="ml-2 h-5 w-5 hidden group-hover:block" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Link href="/sign-in">
                <Button className="w-full bg-blue-600/50 hover:bg-blue-700 py-6 text-lg">
                  Get Started Free
                  <LogInIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Powerful Features for Document Analysis
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the next generation of document interaction with our
            advanced AI features
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-b from-gray-900/50 to-gray-900/30 py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              Three simple steps to get started
            </p>
          </div>
          <div className="relative">
            {/* Animated Connection Lines */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 hidden md:block bg-gradient-to-r from-blue-600/20 via-blue-600 to-blue-600/20" />

            <div className="grid gap-12 md:grid-cols-3 relative">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-800/40 backdrop-blur-sm rounded-xl p-8 transition-all duration-500 hover:bg-gray-800/60 hover:-translate-y-2"
                >
                  {/* Step Number */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full bg-blue-600/20" />
                      <div className="relative w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/20">
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-blue-500/10 text-blue-500 transition-all duration-500 group-hover:scale-110 relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500/5" />
                    <div className="transform transition-transform duration-500 group-hover:rotate-12">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-4 transition-colors duration-300 group-hover:text-blue-400">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                    {step.description}
                  </p>

                  {/* Decorative Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Professionals
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            See what our users have to say about their experience
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Document Experience?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using SakhiAI to
            revolutionize their document interaction.
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Free
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Bot className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white">SakhiAI</span>
              </Link>
              <p className="text-gray-400">
                Transform your PDF documents into interactive conversations
              </p>
            </div>
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-white mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// Components and Data
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition-all hover:border-blue-500/50 hover:bg-gray-900">
      <div className="mb-4 rounded-lg bg-blue-500/10 p-3 w-fit">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function TestimonialCard({
  name,
  role,
  content,
  avatar,
}: {
  name: string;
  role: string;
  content: string;
  avatar: string;
}) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
      <p className="text-gray-400 mb-6">{content}</p>
      <div className="flex items-center gap-4">
        <Image
          src={avatar}
          alt={name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <div className="font-semibold text-white">{name}</div>
          <div className="text-sm text-gray-400">{role}</div>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { value: "7+", label: "Active Users" },
  { value: "42+", label: "Documents Processed" },
  { value: "69420+", label: "Questions Answered" },
  { value: "69%", label: "Satisfaction Rate" },
];

const features = [
  {
    icon: <Brain className="h-6 w-6 text-blue-500" />,
    title: "AI-Powered Chat",
    description:
      "Natural conversations with your documents using advanced AI technology.",
  },
  {
    icon: <Lock className="h-6 w-6 text-blue-500" />,
    title: "Secure & Private",
    description: "Enterprise-grade security for your sensitive documents.",
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-500" />,
    title: "24/7 Access",
    description: "Access your documents anytime, anywhere.",
  },
];

const steps = [
  {
    icon: <FileText className="h-8 w-8" />,
    title: "Upload Your PDF",
    description: "Simply drag and drop your PDF document into our platform.",
  },
  {
    icon: <Brain className="h-8 w-8" />,
    title: "AI Processing",
    description: "Our AI analyzes and understands your document content.",
  },
  {
    icon: <Bot className="h-8 w-8" />,
    title: "Start Chatting",
    description: "Ask questions and get instant, accurate responses.",
  },
];

const testimonials = [
  {
    content:
      "SakhiAI is out of this world! Almost as impressive as my Mars rockets. Though I might need it to help me understand those Twitter terms of service I agreed to...",
    name: "Elon Musk",
    role: "CEO of Tesla, SpaceX, & Twitter/X",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/1200px-Elon_Musk_Royal_Society_%28crop2%29.jpg",
  },
  {
    content:
      "Finally! An AI that can explain my metaverse presentations to me. Now if only it could help me figure out how many zeroes are in our AI investment budget.",
    name: "Mark Zuckerberg",
    role: "CEO of Meta",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg",
  },
  {
    content:
      "I asked SakhiAI to analyze my competitor's business strategies. It just replied 'Buy them all.' Best advice ever!",
    name: "Satya Nadella",
    role: "CEO of Microsoft",
    avatar:
      "https://upload.wikimedia.org/wikipedia/commons/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg",
  },
];

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Terms and Conditions", href: "/tnc" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];
