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
import HowItWorks from "@/components/home/HowItWorks";
import Hero from "@/components/home/Hero";
import Pricing from "@/components/home/Pricing";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat = userId
    ? (await db.select().from(chats).where(eq(chats.userId, userId)))[0]
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-gray-300 bg-gray-100/50 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-violet-500 hover:rotate-12 transform transition duration-200 ease-in-out" />
            <span className="text-xl font-bold text-gray-800">SakhiAI</span>
          </Link>
          <div className="flex items-center gap-4">
            {isAuth ? (
              <>
                <SubscriptionButton isPro={isPro} />
                <UserButton />
              </>
            ) : (
              <div className="flex gap-4">
                <Link href="/sign-in">
                  <Button variant="default" size="sm" className="bg-gray-600">
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
      <section className="container mx-auto px-4 pt-32 pb-16 min-h-[77vh]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-16 inline-flex items-center rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 shadow-xl">
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-white/50 text-purple-700 hover:bg-purple-100 transition duration-300 ease-in-out rounded-full shadow-lg"
              >
                Start Your Free Trial
                <Sparkles className="ml-2 h-5 w-5 animate-bounce ease-in-out transition transform opacity-70" />
              </Button>
            </Link>
          </div>
          <h1 className="mb-8 text-5xl font-extrabold tracking-tight leading-normal text-gray-800 sm:text-7xl">
            Talk to your PDF's
            <br />
            <span className="text-4xl font-sans  pr-3">with</span>
            <span className="text-violet-600 font-sans underline decoration-dashed underline-offset-8 ">
              SakhiAI
            </span>
          </h1>
          <p className="mb-12 text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Dive into a world where your PDF documents come alive! <br /> With{" "}
            <span className="text-violet-900  font-semibold">SakhiAI</span>,
            every PDF is a gateway to new knowledge and understanding.
          </p>
          {/* File Upload or Auth Section */}
          <div className="mx-auto max-w-lg">
            {isAuth ? (
              <div className="space-y-6">
                {!firstChat || isPro ? (
                  <FileUpload />
                ) : (
                  <div className="text-center p-6 bg-yellow-100 rounded-lg border border-yellow-300 shadow-md">
                    <p className="text-yellow-800 mb-4 font-medium">
                      You have reached the limit for free accounts. Please
                      upgrade to Pro to upload more PDFs.
                    </p>
                    <SubscriptionButton isPro={isPro} />
                  </div>
                )}
                {firstChat && (
                  <Link href={`chat/${firstChat.id}`}>
                    <Button className="w-full bg-violet-600 hover:bg-violet-700 py-4 text-lg font-semibold transition duration-200 ease-in-out">
                      <span>Continue to Your Chats</span>
                      <ArrowRightIcon className="ml-2 h-5 w-5 hidden group-hover:block" />
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center rounded-lg border border-violet-500/20 bg-violet-500/10 px-6 py-3 shadow-xl relative ">
                <Link href="/sign-in">
                  <Image
                    alt="rozz chat to pdf"
                    src="/rozz.webp"
                    width={420}
                    height={420}
                    className="bg-cover opacity-80 rounded-lg "
                  />
                  <Button className="w-full bg-violet-500/80 hover:bg-violet-600/90 py-6 text-lg font-semibold transition duration-200 ease-in-out absolute bottom-0 right-[0.08rem] z-50">
                    Get Started Free
                    <LogInIcon className="ml-2 h-5 w-5 animate-pulse" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="border-y border-gray-300 bg-gray-100/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="uppercase font-bold text-xl mb-8 text-purple-600">
            Trusted by Professionals
          </h2>
          <p className="font-mono font-thin max-w-2xl mx-auto mb-24">
            See what our users have to say about their experience
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </section>

      <Pricing />

      {/* Footer */}
      <footer className="border-t border-gray-200  border-2 shadow-lg mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Bot className="h-8 w-8 text-violet-500" />
                <span className="text-xl font-bold text-gray-800">SakhiAI</span>
              </Link>
              <p className="text-gray-600">
                Transform your PDF documents into interactive conversations
              </p>
            </div>
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-800 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-gray-800"
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
    <div className="rounded-xl border border-gray-300 bg-gray-100/50 p-6 transition-all hover:border-violet-500/50 hover:bg-gray-100">
      <div className="mb-4 rounded-lg bg-violet-500/10 p-3 w-fit">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
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
    <div className="rounded-xl border border-gray-300 bg-gray-100/50 p-6">
      <p className="text-gray-600 mb-6">{content}</p>
      <div className="flex items-center gap-4">
        <Image
          src={avatar}
          alt={name}
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <div className="font-semibold text-gray-800">{name}</div>
          <div className="text-sm text-gray-600">{role}</div>
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
    icon: <Brain className="h-6 w-6 text-violet-500" />,
    title: "AI-Powered Chat",
    description:
      "Natural conversations with your documents using advanced AI technology.",
  },
  {
    icon: <Lock className="h-6 w-6 text-violet-500" />,
    title: "Secure & Private",
    description: "Enterprise-grade security for your sensitive documents.",
  },
  {
    icon: <Clock className="h-6 w-6 text-violet-500" />,
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
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Refund Policy", href: "/legal/refund" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Shipping and Delivery", href: "/tnc" },
      { label: "Contact Us", href: "/tnc" },
    ],
  },
];
