
import { UsersProvider } from "@/components/admin/users";
import UsersList from "@/components/admin/users/UsersList";
import CreateUserForm from "@/components/admin/users/CreateUserForm";
import { UserPlus } from "lucide-react";

const Users = () => {
  return (
    <UsersProvider>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Usuários</h1>
            <p className="text-neutral-500 mt-1">Gerenciar contas de usuários do sistema</p>
          </div>
          <CreateUserForm />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-100">
          <UsersList />
        </div>
      </div>
    </UsersProvider>
  );
};

export default Users;
