
export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Aberto</span>;
    case 'in_progress':
      return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">Em Andamento</span>;
    case 'resolved':
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Resolvido</span>;
    case 'closed':
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Fechado</span>;
    default:
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
  }
};

export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'low':
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Baixa</span>;
    case 'medium':
      return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Média</span>;
    case 'high':
      return <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">Alta</span>;
    case 'urgent':
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Urgente</span>;
    default:
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">{priority}</span>;
  }
};

export const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'support':
      return <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">Suporte Técnico</span>;
    case 'sales':
      return <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">Vendas</span>;
    case 'logistics':
      return <span className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">Entregas</span>;
    case 'financial':
      return <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">Financeiro</span>;
    default:
      return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Geral</span>;
  }
};
