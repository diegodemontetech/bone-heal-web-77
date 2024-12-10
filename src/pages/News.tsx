import Navbar from "@/components/Navbar";

const News = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Notícias</h1>
        <div className="grid gap-8">
          {/* News items will be added here */}
        </div>
      </div>
    </div>
  );
};

export default News;