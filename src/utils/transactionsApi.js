import logger from "../logger";

export const fetchTransactions = async () => {
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
            try {
                const res = await fetch("/data/transactions.json");
                const data = await res.json();
                logger.info("Fetched transactions:", data);
                resolve(data);
            } catch (err) {
                logger.error("Error fetching transactions:", err);
                reject(err);
            }
        }, 500);
    });
}