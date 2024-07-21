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
  title: "Insightaction -  Build Lasting Habits with Atomic Precision.",
  description:
    "A comprehensive Next.js application designed for individuals committed to personal growth. It integrates cutting-edge habit formation techniques, interactive tools, and progress tracking to empower users in creating lasting positive changes in their lives.",
};

export default function Home() {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"]);

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
