// src/api/cash.js
import { createCash, getCash, updateCash } from "../lib/appwrite";

/**
 * Fetches cash data for a given owner and formats it
 * to match API-like structure.
 */
export const fetchCashAPI = async (ownerId) => {
  try {
    const cashEntries = await getCash(ownerId);

    const totalBalance = cashEntries.reduce(
      (acc, doc) => acc + parseFloat(doc.balance || 0),
      0
    );

    const total = {
      balance: Number(totalBalance.toFixed(2)),
      currency: "AUD",
      bank: "Total Balance",
      $id: 0,
    };

    return {
      success: true,
      data: {
        entries: cashEntries,
        total,
      },
    };
  } catch (error) {
    console.error("API Error: fetchCashAPI", error);
    return {
      success: false,
      message: error.message || "Failed to fetch cash data",
    };
  }
};

/**
 * Updates cash data for a given owner, formats it, and returns the updated data
 * to match API-like structure.
 */
export const updateCashAPI = async (data, documentId, ownerId) => {
  try {
    const updated = await updateCash(data, documentId, ownerId);
    return {
      success: true,
      data: updated,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Update failed",
    };
  }
};

/**
 * Creates cash data for a given owner, formats it, and returns the created data
 * to match API-like structure.
 */
export const createCashAPI = async (data, ownerId) => {
  try {
    const created = await createCash({ ...data, ownerId });
    return {
      success: true,
      data: created,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Creation failed",
    };
  }
};
