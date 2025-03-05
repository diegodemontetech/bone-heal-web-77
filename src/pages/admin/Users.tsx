
import AdminLayout from "@/components/admin/Layout";
import { UsersProvider } from "@/components/admin/UsersContext";
import UsersList from "@/components/admin/users/UsersList";
import CreateUserForm from "@/components/admin/users/CreateUserForm";

const Users = () => {
  return (
    <UsersProvider>
      <AdminLayout>
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Usuários</h1>
            <CreateUserForm />
          </div>

          <div className="bg-white rounded-lg shadow">
            <UsersList />
          </div>
        </div>
      </AdminLayout>
    </UsersProvider>
  );
};

export default Users;
