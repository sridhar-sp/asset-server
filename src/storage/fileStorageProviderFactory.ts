import { Request } from "express";
import FallbackFileStorageProvider from "./fallbackFileStorageProvider";
import FileStorageProvider from "./fileStroageProvider";
import FirebaseFileStorageProvider from "./firebaseFileStorageProvider";

enum STORAGE_PROVIDER {
  FIREBASE = "firebase",
}

const STORAGE_PROVIDER_HEADER_KEY = "x-storage-provider";

class FileStoreProviderFactory {
  private constructor() {}

  private static fallbackFileStorageProvider = new FallbackFileStorageProvider();
  private static storageProviderCache: Map<string, FileStorageProvider> = new Map();

  static getFileStoreProvider(request: Request): FileStorageProvider {
    const storageProviderName = request.headers[STORAGE_PROVIDER_HEADER_KEY];
    if (storageProviderName == null) return FileStoreProviderFactory.fallbackFileStorageProvider;
    if (storageProviderName === STORAGE_PROVIDER.FIREBASE) {
      const cachedFirebaseProvider = FileStoreProviderFactory.storageProviderCache.get(STORAGE_PROVIDER.FIREBASE);
      if (cachedFirebaseProvider) return cachedFirebaseProvider;

      const firebaseFileStorageProvider = new FirebaseFileStorageProvider();
      FileStoreProviderFactory.storageProviderCache.set(STORAGE_PROVIDER.FIREBASE, firebaseFileStorageProvider);
      return firebaseFileStorageProvider;
    } else {
      return FileStoreProviderFactory.fallbackFileStorageProvider;
    }
  }
}

export default FileStoreProviderFactory;
