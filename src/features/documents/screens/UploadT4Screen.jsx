import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation } from '@react-navigation/native';

const UploadT4Screen = () => {
  const navigation = useNavigation();
  const [files, setFiles] = useState([]);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
    });

    if (!result.canceled) {
      setFiles((prev) => [...prev, result.assets[0]]);
    }
  };

  const removeFile = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload T4</Text>
      <Text style={styles.subtitle}>
        Upload your employment income document
      </Text>

      <TouchableOpacity style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>Choose File</Text>
      </TouchableOpacity>

      <FlatList
        data={files}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.fileItem}>
            <Text numberOfLines={1} style={styles.fileName}>
              {item.name}
            </Text>
            <TouchableOpacity onPress={() => removeFile(index)}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('Deductions')}
      >
        <Text style={styles.nextText}>Continue to Deductions</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UploadT4Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  fileName: {
    flex: 1,
    marginRight: 10,
  },
  remove: {
    color: '#DC2626',
    fontWeight: '600',
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#16A34A',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontWeight: '700',
  },
});
