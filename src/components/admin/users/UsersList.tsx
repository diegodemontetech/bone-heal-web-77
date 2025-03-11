
import { useState } from "react";
import { useUsers } from "./useUsers";
import { useAuth } from "@/hooks/use-auth-context";
import UsersTable from "./UsersTable";
import EditUserDialog from "./EditUserDialog";
import DeleteUserDialog from "./DeleteUserDialog";
import { UserData } from "./types";

const UsersList = () => {
  const { users, isLoading, deleteUser, updateUserPermissions } = useUsers();
  const { isAdminMaster } = useAuth();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const openEditDialog = (user: UserData) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      setIsDeleteOpen(false);
    }
  };

  const handleSavePermissions = async () => {
    if (selectedUser) {
      await updateUserPermissions(selectedUser.id, selectedPermissions);
      setIsEditOpen(false);
    }
  };

  const togglePermission = (permission: string) => {
    setSelectedPermissions(current => 
      current.includes(permission) 
        ? current.filter(p => p !== permission)
        : [...current, permission]
    );
  };

  return (
    <>
      <UsersTable 
        users={users} 
        isLoading={isLoading} 
        onEditUser={openEditDialog} 
        onDeleteUser={openDeleteDialog}
        isAdminMaster={isAdminMaster}
      />

      <EditUserDialog 
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        selectedUser={selectedUser}
        selectedPermissions={selectedPermissions}
        onPermissionToggle={togglePermission}
        onSavePermissions={handleSavePermissions}
      />

      <DeleteUserDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        selectedUser={selectedUser}
        onConfirmDelete={handleDeleteUser}
      />
    </>
  );
};

export default UsersList;
