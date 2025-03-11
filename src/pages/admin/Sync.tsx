
import React from 'react';
import { OmieCustomersSync } from '@/components/admin/OmieCustomersSync';
import TestOmieSync from '@/components/TestOmieSync';

const Sync = () => {
  return (
    <div className="container p-8">
      <h1 className="text-2xl font-bold mb-8">Sincronização com Omie</h1>
      
      <div className="grid gap-8">
        <OmieCustomersSync />
        <TestOmieSync />
      </div>
    </div>
  );
};

export default Sync;
