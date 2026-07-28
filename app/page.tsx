import BackgroundScene from "@/components/landing/BackgroundScene";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { LearningPaths } from "@/components/landing/LearningPaths";

export default function Home() {
  return (
    <>
      <BackgroundScene />
      <Header />
      <main id="main-content">
        <Hero />
        <LearningPaths />
      </main>
    </>
  );
}
