  'use client';
  import Header from "../client/components/layout/Header";
  import Footer from "../client/components/layout/Footer";
  import ScrollToTopButton from "../client/components/common/ScrollToTopButton";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { useState } from "react";
  import { HeroUIProvider } from "@heroui/system";

  export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    return (
      <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
              <Header />
              <main>{children}</main>
              <Footer />
              <ScrollToTopButton />
          </QueryClientProvider>
      </HeroUIProvider>
    );
  }
