import { Client, Databases, ID, Query } from "appwrite";

export const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

export const getCash = async (ownerId) => {
  try {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_CASH_COLLECTION_ID,
      [Query.equal("ownerId", ownerId)]
    );

    return response.documents;
  } catch (error) {
    console.error("Error fetching cash:", error);
    return null;
  }
};

export const updateCash = async (data, documentId, ownerId) => {
  try {
    const updated = await databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_CASH_COLLECTION_ID,
      documentId,
      data
    );

    // const updatedCashList = await getCash(ownerId);

    return updated;
  } catch (error) {
    console.error("Error updating cash:", error);
    return null;
  }
};

export const createCash = async (data) => {
  try {
    const response = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_CASH_COLLECTION_ID,
      ID.unique(),
      data
    );

    return response;
  } catch (error) {
    console.error("Error creating cash:", error);
    return null;
  }
};
