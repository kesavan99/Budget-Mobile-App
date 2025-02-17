import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { ScreenProps } from '../navigation/navigationTypes';
import { PieChart } from "react-native-gifted-charts";
import { getTotal, Transaction } from '../utils/getterData';
import { loadData } from "../service/LocalStorage.tsx";

const Home: React.FC<ScreenProps<"Home">> = ({ navigation }) => {
    const [transactions, setTransactions] = useState<{ expense: Transaction[], budget: Transaction[], transfer: Transaction[] }>({
        expense: [],
        budget: [],
        transfer: [],
    });

    const [expensePercentage, setExpensePercentage] = useState(0);
    const [transferPercentage, setTransferPercentage] = useState(0);
    const [balancePercentage, setBalancePercentage] = useState(0);

    useEffect(() => {
        loadTransactions();
    }, []);

    useEffect(() => {
        calculatePercentages();
    }, [transactions]); // Recalculate whenever transactions change

    const loadTransactions = async () => {
        try {
            const storedData = await loadData('forumData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setTransactions(parsedData); // State update is asynchronous
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load transactions.');
        }
    };

    const calculatePercentages = () => {
        const totalExpense = getTotal(transactions.expense);
        const totalTransfer = getTotal(transactions.transfer);
        const totalBudget = getTotal(transactions.budget);
        const balance = totalBudget - (totalExpense + totalTransfer);

        setExpensePercentage(totalBudget ? (totalExpense / totalBudget) * 100 : 0);
        setTransferPercentage(totalBudget ? (totalTransfer / totalBudget) * 100 : 0);
        setBalancePercentage(totalBudget ? (balance / totalBudget) * 100 : 0);
    };

    const pieData = [
        { value: balancePercentage, color: '#93FCF8', gradientCenterColor: '#3BE9DE' }, // Balance
        { value: expensePercentage, color: '#BDB2FA', gradientCenterColor: '#8F80F3' }, // Expense
        { value: transferPercentage, color: '#FFA5BA', gradientCenterColor: '#FF7F97' }, // Transfer
    ];

    const renderDot = (color: string) => (
        <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: color, marginRight: 10 }} />
    );

    const renderLegendComponent = () => (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: 120, marginRight: 20 }}>
                    {renderDot('#3BE9DE')}
                    <Text style={{ color: 'white' }}>Balance: {balancePercentage.toFixed(1)}%</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                    {renderDot('#8F80F3')}
                    <Text style={{ color: 'white' }}>Expense: {expensePercentage.toFixed(1)}%</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: 120, marginRight: 20 }}>
                    {renderDot('#FF7F97')}
                    <Text style={{ color: 'white' }}>Transfer: {transferPercentage.toFixed(1)}%</Text>
                </View>
            </View>
        </>
    );

    return (
        <>
            <View style={{ paddingVertical: 2, backgroundColor: '#34448B', flex: 1 }}>
                <View style={{ margin: 20, padding: 16, borderRadius: 20, backgroundColor: '#232B5D' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Performance</Text>
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <PieChart
                            data={pieData}
                            donut
                            showGradient
                            sectionAutoFocus
                            radius={90}
                            innerRadius={60}
                            innerCircleColor={'#232B5D'}
                            centerLabelComponent={() => (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
                                        {balancePercentage.toFixed(1)}%
                                    </Text>
                                    <Text style={{ fontSize: 14, color: 'white' }}>Remaining</Text>
                                </View>
                            )}
                        />
                    </View>
                    {renderLegendComponent()}
                </View>
            </View>

            <Button title="Go to Add Budget" onPress={() => navigation.navigate("AddBudget")} />
        </>
    );
};

export default Home;
