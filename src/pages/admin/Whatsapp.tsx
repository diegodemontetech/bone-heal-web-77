
import React from 'react';
import WhatsAppDashboard from "@/components/admin/whatsapp/WhatsAppDashboard";

const AdminWhatsApp = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">WhatsApp</h1>
        <p className="text-neutral-500 mt-1">Gerencie suas conexões e mensagens</p>
      </div>
      <WhatsAppDashboard />
    </div>
  );
};

export default AdminWhatsApp;
