import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Product } from '../../components/features/PointOfSale/types';

export const findProductByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const q = query(
      collection(db, 'inventory'),
      where('barcode', '==', barcode)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    
    return {
      id: doc.id,
      name: data.name,
      price: data.price,
      stock: data.quantity,
      quantity: data.quantity,
      minSellingPrice: data.minSellingPrice || data.price * 0.8,
      lowStockThreshold: data.lowStockThreshold || 10,
      imageUrl: data.imageUrl,
      barcode: data.barcode,
      manufacturer: data.manufacturer,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  } catch (error) {
    console.error('Error finding product by barcode:', error);
    return null;
  }
};