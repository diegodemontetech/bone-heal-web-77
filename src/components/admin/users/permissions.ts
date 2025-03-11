
import { UserPermission } from '@/types/auth';

export const availablePermissions = [
  { id: UserPermission.MANAGE_PRODUCTS, label: 'Gerenciar Produtos' },
  { id: UserPermission.MANAGE_ORDERS, label: 'Gerenciar Pedidos' },
  { id: UserPermission.MANAGE_CUSTOMERS, label: 'Gerenciar Clientes' },
  { id: UserPermission.MANAGE_SUPPORT, label: 'Gerenciar Suporte' },
  { id: UserPermission.MANAGE_USERS, label: 'Gerenciar Usuários' },
  { id: UserPermission.VIEW_REPORTS, label: 'Visualizar Relatórios' },
  { id: UserPermission.MANAGE_SETTINGS, label: 'Gerenciar Configurações' },
  { id: UserPermission.MANAGE_INTEGRATIONS, label: 'Gerenciar Integrações' },
];
