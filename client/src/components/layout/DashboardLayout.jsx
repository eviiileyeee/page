import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";
import ScrollToTop from "../subComponents/ScrollToTop";

const DashboardLayout = ({ children }) => (
  <div id="main" className="relative overflow-hidden min-h-screen">
    <ScrollToTop />
    <Navbar />
    <main className="min-h-screen pt-20">{children}</main>
    <Footer />
  </div>
);

export default DashboardLayout;