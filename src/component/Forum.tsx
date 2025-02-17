import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { saveData, loadData } from '../service/LocalStorage';
// @ts-ignore
import styles from '../style/component/Forum.scss';
// @ts-ignore
import { generateId, getTotal, getLength, Transaction } from '../utils/getterData';

interface Transaction {
    id: number;
    type: 'expense' | 'budget' | 'transfer';
    value: number;
    notes: string;
    date: string;
}

const Forum = () => {
    const [type, setType] = useState<'expense' | 'budget' | 'transfer'>('expense');
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
    const [transactions, setTransactions] = useState<{ expense: Transaction[], budget: Transaction[], transfer: Transaction[] }>({
        expense: [],
        budget: [],
        transfer: [],
    });
    const [dataIds, setDataIds] = useState<number[]>([]);

    useEffect(() => {
        loadPosts();
    }, []);


    const savePost = async () => {
        if (!value.trim() || !notes.trim()) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        const newEntry: Transaction = {
            id: generateId(),
            type,
            value: parseFloat(value),
            notes,
            date: new Date().toISOString(),
        };

        const updatedData = {
            ...transactions,
            [type]: [...transactions[type], newEntry],
        };

        try {
            await saveData('forumData', JSON.stringify(updatedData));
            await saveData('dataIds', JSON.stringify([...dataIds, newEntry.id]));
            setTransactions(updatedData);
            setDataIds([...dataIds, newEntry.id]);
            setValue('');
            setNotes('');
        } catch (error) {
            Alert.alert('Error', 'Failed to save the post.');
        }
    };


    const loadPosts = async () => {
        try {
            const storedData = await loadData('forumData');
            const storedIds = await loadData('dataIds');
            if (storedData) setTransactions(JSON.parse(storedData));
            if (storedIds) setDataIds(JSON.parse(storedIds));
        } catch (error) {
            Alert.alert('Error', 'Failed to load posts.');
        }
    };

    const sortedTransactions = [
        ...transactions.expense,
        ...transactions.budget,
        ...transactions.transfer,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.rowContainer}>
                <View style={styles.pickerWrapper}>
                    <Picker selectedValue={type} onValueChange={(itemValue) => setType(itemValue)} style={styles.picker} mode="dropdown">
                        <Picker.Item label="Expense" value="expense" />
                        <Picker.Item label="Budget" value="budget" />
                        <Picker.Item label="Transfer" value="transfer" />
                    </Picker>
                </View>
                <TextInput style={styles.input} placeholder="Enter Value" value={value} onChangeText={setValue} keyboardType="numeric" />
            </View>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Enter Notes" value={notes} onChangeText={setNotes} multiline />
            <TouchableOpacity style={styles.button} onPress={savePost}>
                <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <Text style={styles.heading}>Summary</Text>
            <View style={styles.summaryContainer}>
                <Text style={styles.summaryText}>Total Expense: ₹{getTotal(transactions.expense)}</Text>
                <Text style={styles.summaryText}>Total Transfer: ₹{getTotal(transactions.transfer)}</Text>
                <Text style={styles.summaryText}>Total Budget: ₹{getTotal(transactions.budget)}</Text>
                <Text style={styles.summaryText}>Balance: ₹{getTotal(transactions.budget) - (getTotal(transactions.expense) + getTotal(transactions.transfer))}</Text>
                <Text style={styles.summaryText}>Total Expenses Count: {getLength(transactions.expense)}</Text>
                <Text style={styles.summaryText}>Total Transfers Count: {getLength(transactions.transfer)}</Text>
            </View>
            <Text style={styles.heading}>Transactions</Text>
            {sortedTransactions.length === 0 ? (
                <Text style={styles.noPosts}>No transactions available</Text>
            ) : (
                sortedTransactions.map((post) => (
                    <View key={post.id} style={styles.post}>
                        <Text style={styles.postTitle}>{post.type.toUpperCase()}</Text>
                        <Text>Value: ₹{post.value}</Text>
                        <Text>Notes: {post.notes}</Text>
                        <Text style={styles.timestamp}>{new Date(post.date).toLocaleString()}</Text>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

export default Forum;
