import Navbar from "../global/Navbar";
import MainContent from "./MainContent";
import Features from "./Features";
import Developers from "./Developers";
import ContactUs from "./ContactUs";
import Footer from "../global/Footer";

export default function LandingPage() {
  return (
    <div className="container">
      <Navbar />
      <MainContent />
      <Features />
      <Developers />
      <ContactUs />
      <Footer />
    </div>
  );
}
