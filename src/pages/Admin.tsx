import Navbar from "@/components/Navbar";

const Admin = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Painel Administrativo</h1>
        <div>
          {/* Admin dashboard content will be added here */}
        </div>
      </div>
    </div>
  );
};

export default Admin;