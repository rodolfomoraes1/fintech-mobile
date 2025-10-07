import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../lib/firebase";

export const storageService = {
  async uploadReceipt(
    userId: string,
    invoiceId: string,
    uri: string
  ): Promise<{ url: string | null; error: string | null }> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const fileRef = ref(
        storage,
        `receipts/${userId}/${invoiceId}/${Date.now()}`
      );

      const uploadTask = uploadBytesResumable(fileRef, blob);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          },
          (error) => {
            resolve({ url: null, error: error.message });
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ url: downloadURL, error: null });
            } catch (error: any) {
              resolve({ url: null, error: error.message });
            }
          }
        );
      });
    } catch (error: any) {
      return { url: null, error: error.message };
    }
  },
};
