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
    await databases.updateDocument(
      import.meta.env.VITE_APPWRITE_DB_ID,
      import.meta.env.VITE_APPWRITE_CASH_COLLECTION_ID,
      documentId,
      data
    );

    const updatedCashList = await getCash(ownerId);

    return updatedCashList;
  } catch (error) {
    console.error("Error updating cash:", error);
    return null;
  }
};
