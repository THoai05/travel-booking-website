'use client';
import Header from "../client/components/layout/Header";
import Footer from "../client/components/layout/Footer";
import ScrollToTopButton from "../client/components/common/ScrollToTopButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
     <QueryClientProvider client={queryClient}>
            <Header />
            <main>{children}</main>
            <Footer />
            <ScrollToTopButton />
         </QueryClientProvider>
  );
}
