import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import LedgerTable from './GeneralLedger/LedgerTable';
import DayBook from './GeneralLedger/DayBook/DayBook';
import ManualEntryForm from './GeneralLedger/ManualEntryForm';

const GeneralLedger = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">General Ledger</h2>
      
      <Tabs defaultValue="daybook" className="w-full">
        <TabsList>
          <TabsTrigger value="daybook">Day Book</TabsTrigger>
          <TabsTrigger value="ledger">General Ledger</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daybook">
          <DayBook />
        </TabsContent>
        
        <TabsContent value="ledger">
          <LedgerTable entries={[]} />
        </TabsContent>
        
        <TabsContent value="manual">
          <ManualEntryForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneralLedger;