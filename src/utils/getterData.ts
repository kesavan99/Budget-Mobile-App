export interface Transaction {
    id: number;
    type: 'expense' | 'budget' | 'transfer';
    value: number;
    notes: string;
    date: string;
}

export const generateId = (): number => Math.floor(Math.random() * 1000000);

export const getTotal = (transactions: Transaction[]): number =>
    transactions.reduce((sum, item) => sum + item.value, 0);

export const getLength = (transactions: Transaction[]): number => transactions.length;
