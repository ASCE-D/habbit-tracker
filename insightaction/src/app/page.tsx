import About from "@/components/About";
// import HomeBlogSection from "@/components/Blog/HomeBlogSection";
import CallToAction from "@/components/CallToAction";
// import Clients from "@/components/Clients";
import ScrollUp from "@/components/Common/ScrollUp";
import Contact from "@/components/Contact";
//import Faq from "@/components/Faq";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import Team from "@/components/Team";
// import Testimonials from "@/components/Testimonials";
import { getAllPosts } from "@/utils/markdown";
import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://insightaction.pureapps.tech/"),
  title: "Insightaction -  Build Lasting Habits with Atomic Precision.",
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  description:
    "A comprehensive Next.js application designed for individuals committed to personal growth. It integrates cutting-edge habit formation techniques, interactive tools, and progress tracking to empower users in creating lasting positive changes in their lives.",
  twitter: {
    card: "summary_large_image",
    images: "/opengraph-image.png",
  },
  openGraph: {
    images: "/opengraph-image.png",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Home() {
  return (
    <main>
      <ScrollUp />
      <Hero />
      <Features />
      <About />
      <CallToAction />
      <Pricing />
      {/* <Testimonials /> */}
      {/*<Faq />*/}
      <Team />
      {/* <HomeBlogSection posts={posts} /> */}
      <Contact />
      {/* <Clients /> */}
    </main>
  );
}
