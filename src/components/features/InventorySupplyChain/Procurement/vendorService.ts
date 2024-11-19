import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import { Vendor, VendorFormData } from './types';

export const addVendor = async (vendor: VendorFormData) => {
  return await addDoc(collection(db, 'vendors'), {
    ...vendor,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
};

export const updateVendor = async (id: string, updates: Partial<Vendor>) => {
  const vendorRef = doc(db, 'vendors', id);
  return await updateDoc(vendorRef, {
    ...updates,
    updatedAt: new Date(),
  });
};

export const deleteVendor = async (id: string) => {
  const vendorRef = doc(db, 'vendors', id);
  return await deleteDoc(vendorRef);
};