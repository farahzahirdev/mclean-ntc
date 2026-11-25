import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Empathy from "@/components/Empathy";
import Services from "@/components/Services";
import Why from "@/components/Why";
import Insurance from "@/components/Insurance";
import BookingCalendar from "@/components/BookingCalendar";
import Reviews from "@/components/Reviews";
import Faq from "@/components/Faq";
import QualifyForm from "@/components/QualifyForm";
import Visit from "@/components/Visit";
import FinalCta from "@/components/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Empathy />
      <Services />
      <Why />
      <Insurance />
      <BookingCalendar />
      <Reviews />
      <Faq />
      <QualifyForm />
      <Visit />
      <FinalCta />
    </>
  );
}
