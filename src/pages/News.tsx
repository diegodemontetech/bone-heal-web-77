import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsHero from "@/components/NewsHero";
import NewsList from "@/components/NewsList";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const News = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <NewsHero />
          <section className="container mx-auto px-4 py-12">
            <NewsList />
          </section>
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default News;