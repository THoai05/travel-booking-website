import Header from "../client/components/layout/Header";
import Footer from "../client/components/layout/Footer";
import ScrollToTopButton from "../client/components/common/ScrollToTopButton";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <ScrollToTopButton />
    </>
  );
}
