import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const News = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-8">
          <h1 className="text-4xl font-bold mb-8">Notícias</h1>
          <div className="grid gap-8">
            {/* News items will be added here */}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default News;