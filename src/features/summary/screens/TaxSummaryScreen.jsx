import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaxSummaryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tax Summary</Text>
      <Text style={styles.subtitle}>
        Refund estimate, income summary, and optimization will come here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default TaxSummaryScreen;
