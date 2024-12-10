import Navbar from "@/components/Navbar";
import { Search, Download, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const studies = [
  {
    id: 1,
    title: "Regeneração Óssea Guiada com Bone Heal: Um Estudo Clínico",
    category: "Regeneração Óssea",
    date: "2024-02-15",
    fileSize: "2.6 MB",
    thumbnail: "https://c5gwmsmjx1.execute-api.us-east-1.amazonaws.com/prod/dados_processo_seletivo/logo_empresa/167858/bone-heal-logo-01.png"
  },
  {
    id: 2,
    title: "Análise Comparativa de Técnicas de Regeneração Tecidual",
    category: "Pesquisa Clínica",
    date: "2024-01-20",
    fileSize: "1.8 MB",
    thumbnail: "https://c5gwmsmjx1.execute-api.us-east-1.amazonaws.com/prod/dados_processo_seletivo/logo_empresa/167858/bone-heal-logo-01.png"
  },
  // Add more studies as needed
];

const Studies = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-[1440px] mx-auto px-8 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-heading">
              Estudos Científicos
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              Nossa biblioteca reúne evidências científicas e casos clínicos sobre regeneração óssea e tecidual guiada com Bone Heal.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-[1440px] mx-auto px-8 lg:px-24 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <input
                type="text"
                placeholder="Pesquisar estudos..."
                className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            </div>
            
            {/* Filter Dropdown */}
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Categories */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <div className="flex flex-wrap gap-3">
              {["Todos", "Regeneração Óssea", "Casos Clínicos", "Pesquisa", "Inovação"].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full border border-neutral-200 hover:border-primary hover:text-primary transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Studies List */}
        <div className="mt-12 space-y-6">
          {studies.map((study) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6"
            >
              <div className="flex items-center gap-6">
                <img
                  src={study.thumbnail}
                  alt="Thumbnail"
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <span className="text-sm text-primary font-medium">{study.category}</span>
                  <h3 className="text-xl font-bold mb-2">{study.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <span>{new Date(study.date).toLocaleDateString('pt-BR')}</span>
                    <span>PDF, {study.fileSize}</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors">
                  <Download size={20} />
                  <span>Download</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Studies;