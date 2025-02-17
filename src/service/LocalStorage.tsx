import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to AsyncStorage
export const saveData = async (key: string, value: string): Promise<void> => {
    try {
        if (!key || !value) {
            console.error("[ERROR] Key or value is empty. Data not saved.");
            return;
        }

        await AsyncStorage.setItem(key, value);
        console.log(`[SUCCESS] Data saved! Key: ${key}, Value: ${value}`);
    } catch (error) {
        console.error('[ERROR] saving data:', error);
    }
};

// Retrieve data from AsyncStorage
export const loadData = async (key: string): Promise<string | null> => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (error) {
        console.error('[ERROR] retrieving data:', error);
        return null;
    }
};

// Remove data from AsyncStorage
export const removeData = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('[ERROR] removing data:', error);
    }
};

// Clear all AsyncStorage data
export const clearStorage = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('[ERROR] clearing storage:', error);
    }
};
