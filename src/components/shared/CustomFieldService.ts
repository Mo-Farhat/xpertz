import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { CustomField } from './CustomFieldsManager';

export const addCustomField = async (field: Omit<CustomField, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'customFields'), {
      ...field,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding custom field:', error);
    throw error;
  }
};

export const updateCustomField = async (fieldId: string, value: any) => {
  try {
    const fieldRef = doc(db, 'customFields', fieldId);
    await updateDoc(fieldRef, {
      value,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating custom field:', error);
    throw error;
  }
};

export const deleteCustomField = async (fieldId: string) => {
  try {
    await deleteDoc(doc(db, 'customFields', fieldId));
  } catch (error) {
    console.error('Error deleting custom field:', error);
    throw error;
  }
};

export const getCustomFields = async (moduleType: string): Promise<CustomField[]> => {
  try {
    const q = query(
      collection(db, 'customFields'),
      where('moduleType', '==', moduleType)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as CustomField));
  } catch (error) {
    console.error('Error fetching custom fields:', error);
    throw error;
  }
};