import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { QuotationContract } from './types';

export const useQuotationDocuments = () => {
  const [documents, setDocuments] = useState<QuotationContract[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'quotationsContracts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const documentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        validUntil: doc.data().validUntil.toDate(),
        createdAt: doc.data().createdAt.toDate(),
        lastModified: doc.data().lastModified?.toDate() || doc.data().createdAt.toDate(),
      } as QuotationContract));
      setDocuments(documentsData);
    });
    return unsubscribe;
  }, []);

  return documents;
};