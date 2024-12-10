import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsHero from "@/components/NewsHero";
import NewsList from "@/components/NewsList";
import NewsCategories from "@/components/NewsCategories";

const News = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <NewsHero />
        <section className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <NewsCategories />
            <div className="flex-grow">
              <NewsList />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;