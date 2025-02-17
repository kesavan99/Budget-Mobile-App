import React from 'react';
import { View, StyleSheet } from 'react-native';
import Forum from '../component/Forum';

const AddBudget: React.FC = () => {
    return (
        <View style={styles.container}>
            <Forum />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
});

export default AddBudget;
