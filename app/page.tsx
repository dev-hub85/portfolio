import SmoothScroll from "@/components/smooth-scroll";
import IntroLoader from "@/components/intro-loader";
import Universe from "@/components/cosmos/universe";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Hero from "@/components/sections/hero";
import Manifesto from "@/components/sections/manifesto";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Work from "@/components/sections/work";
import WorldScene from "@/components/sections/world-scene";
import Workshop from "@/components/sections/workshop";
import FlightLog from "@/components/sections/flight-log";
import Contact from "@/components/sections/contact";
import WhatsAppButton from "@/components/whatsapp-button";
import ChatBot from "@/components/chat-bot";
import { worlds } from "@/lib/worlds";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SmoothScroll />
      <IntroLoader />

      <div className="sky" aria-hidden="true" />
      <Universe />
      <div className="scrim" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <SiteHeader />

      <main id="main">
        <Hero />
        <Manifesto />
        <About />
        <Skills />
        <Work />
        {worlds.map((world, i) => (
          <WorldScene key={world.slug} world={world} index={i} />
        ))}
        <Workshop />
        <FlightLog />
        <Contact />
      </main>

      <SiteFooter />
      <WhatsAppButton />
      <ChatBot />
    </>
  );
}
