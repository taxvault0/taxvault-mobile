import React, { useState, useEffect, useRef } from 'react'; 
import {

  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
   
import { Camera } from 'expo-camera';
   
import * as ImagePicker from 'expo-image-picker';
   
import * as ImageManipulator from 'expo-image-manipulator';
   
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
   
import { useNavigation, useRoute } from '@react-navigation/native';
   
import { useMutation, useQueryClient } from '@tanstack/react-query';
   
import Slider from '@react-native-community/slider';
   
import { colors, typography, spacing, borderRadius } from '@/styles/theme';
   
import Button from '@/components/ui/Button';
   
import Card from '@/components/ui/Card';
   
import { createReceipt, uploadReceiptImage } from '@/services/receiptAPI';
   
import { extractReceiptData } from '@/services/ocrService'; // We'll create this next

const CameraScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const queryClient = useQueryClient();
  const { mode = 'receipt', tripId } = route.params || {};

  // Camera states
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  // Editing states
  const [showEditor, setShowEditor] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);

  // OCR and receipt data states
  const [showReceiptForm, setShowReceiptForm] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [receiptData, setReceiptData] = useState({
    vendor: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'other',
    notes: '',
    taxAmount: '',
    taxRate: '',
  });

  // Create receipt mutation
  const createMutation = useMutation({
    mutationFn: createReceipt,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['receipts'] });
      Alert.alert(
        'Success',
        'Receipt saved successfully',
        [
          {
            text: 'View Receipt',
            onPress: () => navigation.replace('ReceiptDetail', { id: data.id })
          },
          {
            text: 'Scan Another',
            onPress: () => resetCamera()
          },
          {
            text: 'Done',
            onPress: () => navigation.goBack()
          }
        ]
      );
    },
    onError: (error) => {
      Alert.alert('Error', error.message || 'Failed to save receipt');
      setIsProcessing(false);
    }
  });

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const resetCamera = () => {
    setCapturedImage(null);
    setEditedImage(null);
    setShowEditor(false);
    setShowReceiptForm(false);
    setExtractedData(null);
    setReceiptData({
      vendor: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'other',
      notes: '',
      taxAmount: '',
      taxRate: '',
    });
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          exif: false,
        });
        setCapturedImage(photo.uri);
        setEditedImage(photo.uri);
        setShowEditor(true);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0].uri);
        setEditedImage(result.assets[0].uri);
        setShowEditor(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const applyEdits = async () => {
    try {
      setIsProcessing(true);
      const manipulations = [];
      
      if (brightness !== 1 || contrast !== 1) {
        manipulations.push({
          resize: { width: 1080 },
          brightness: brightness,
          contrast: contrast,
        });
      }

      if (cropMode) {
        // You can implement custom crop UI here
        // For now, we'll use a simple square crop
        manipulations.push({
          crop: {
            originX: 0,
            originY: 0,
            width: 1080,
            height: 1080,
          },
        });
      }

      const result = await ImageManipulator.manipulateAsync(
        capturedImage,
        manipulations.length ? manipulations : [{ resize: { width: 1080 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      setEditedImage(result.uri);
      
      // After editing, process with OCR
      await processReceiptOCR(result.uri);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
      setIsProcessing(false);
    }
  };

  const processReceiptOCR = async (imageUri) => {
    try {
      setIsProcessing(true);
      
      // Upload image first
      const uploadResult = await uploadReceiptImage(imageUri);
      
      // Extract data using OCR
      const ocrResult = await extractReceiptData(uploadResult.imageUrl);
      
      setExtractedData(ocrResult);
      setReceiptData({
        vendor: ocrResult.vendor || '',
        amount: ocrResult.amount ? ocrResult.amount.toString() : '',
        date: ocrResult.date || new Date().toISOString().split('T')[0],
        category: ocrResult.category || 'other',
        notes: ocrResult.notes || '',
        taxAmount: ocrResult.taxAmount ? ocrResult.taxAmount.toString() : '',
        taxRate: ocrResult.taxRate ? ocrResult.taxRate.toString() : '',
      });
      
      setShowEditor(false);
      setShowReceiptForm(true);
      
    } catch (error) {
      Alert.alert('OCR Failed', 'Could not extract text. Please enter manually.');
      setShowEditor(false);
      setShowReceiptForm(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveReceipt = async () => {
    if (!receiptData.vendor || !receiptData.amount) {
      Alert.alert('Error', 'Please enter vendor and amount');
      return;
    }

    setIsProcessing(true);

    const formData = new FormData();
    formData.append('image', {
      uri: editedImage,
      type: 'image/jpeg',
      name: 'receipt.jpg',
    });
    formData.append('vendor', receiptData.vendor);
    formData.append('amount', parseFloat(receiptData.amount));
    formData.append('date', receiptData.date);
    formData.append('category', receiptData.category);
    formData.append('notes', receiptData.notes);
    formData.append('taxAmount', receiptData.taxAmount ? parseFloat(receiptData.taxAmount) : 0);
    formData.append('taxRate', receiptData.taxRate ? parseFloat(receiptData.taxRate) : 0);
    
    if (tripId) {
      formData.append('tripId', tripId);
    }

    createMutation.mutate(formData);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary[500]} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Icon name="camera-off" size={64} color={colors.error} />
        <Text style={styles.noPermissionText}>
          No access to camera. Please enable camera permissions in settings.
        </Text>
        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={styles.permissionButton}
        />
      </View>
    );
  }

  // Camera View
  if (!capturedImage) {
    return (
      <View style={styles.container}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          flashMode={flash}
        >
          <View style={styles.cameraOverlay}>
            {/* Header */}
            <View style={styles.cameraHeader}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.cameraButton}
              >
                <Icon name="close" size={24} color={colors.white} />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() =>
                  setFlash(
                    flash === Camera.Constants.FlashMode.off
                      ? Camera.Constants.FlashMode.on
                      : Camera.Constants.FlashMode.off
                  )
                }
                style={styles.cameraButton}
              >
                <Icon
                  name={flash === Camera.Constants.FlashMode.off ? 'flash-off' : 'flash'}
                  size={24}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>

            {/* Receipt Guide Frame */}
            {mode === 'receipt' && (
              <View style={styles.guideFrame}>
                <View style={styles.guideCorner} />
                <View style={[styles.guideCorner, styles.guideCornerTopRight]} />
                <View style={[styles.guideCorner, styles.guideCornerBottomLeft]} />
                <View style={[styles.guideCorner, styles.guideCornerBottomRight]} />
                <Text style={styles.guideText}>Align receipt in frame</Text>
              </View>
            )}

            {/* Bottom Controls */}
            <View style={styles.cameraControls}>
              <TouchableOpacity onPress={pickImage} style={styles.galleryButton}>
                <Icon name="image" size={24} color={colors.white} />
              </TouchableOpacity>

              <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  setCameraType(
                    cameraType === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  )
                }
                style={styles.flipButton}
              >
                <Icon name="camera-flip" size={24} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
    );
  }

  // Image Editor View
  if (showEditor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.editorContainer}>
          <View style={styles.editorHeader}>
            <TouchableOpacity onPress={resetCamera}>
              <Icon name="close" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.editorTitle}>Edit Image</Text>
            <TouchableOpacity onPress={applyEdits} disabled={isProcessing}>
              <Text style={styles.editorDone}>Done</Text>
            </TouchableOpacity>
          </View>

          <Image source={{ uri: editedImage }} style={styles.editorImage} />

          <ScrollView style={styles.editorTools}>
            <Card style={styles.toolCard}>
              <Text style={styles.toolLabel}>Brightness</Text>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={1.5}
                value={brightness}
                onValueChange={setBrightness}
                minimumTrackTintColor={colors.primary[500]}
                maximumTrackTintColor={colors.gray[300]}
              />
            </Card>

            <Card style={styles.toolCard}>
              <Text style={styles.toolLabel}>Contrast</Text>
              <Slider
                style={styles.slider}
                minimumValue={0.5}
                maximumValue={1.5}
                value={contrast}
                onValueChange={setContrast}
                minimumTrackTintColor={colors.primary[500]}
                maximumTrackTintColor={colors.gray[300]}
              />
            </Card>

            <TouchableOpacity
              style={[styles.cropButton, cropMode && styles.cropButtonActive]}
              onPress={() => setCropMode(!cropMode)}
            >
              <Icon name="crop" size={24} color={cropMode ? colors.white : colors.primary[500]} />
              <Text style={[styles.cropText, cropMode && styles.cropTextActive]}>
                {cropMode ? 'Crop Mode Active' : 'Crop Image'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.processingText}>Processing receipt...</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Receipt Form View
  if (showReceiptForm) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.formContainer}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formHeader}>
            <TouchableOpacity onPress={resetCamera}>
              <Icon name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.formTitle}>Receipt Details</Text>
            <View style={{ width: 24 }} />
          </View>

          <Image source={{ uri: editedImage }} style={styles.previewImage} />

          {extractedData && (
            <Card style={styles.ocrCard}>
              <View style={styles.ocrHeader}>
                <Icon name="text-recognition" size={20} color={colors.primary[500]} />
                <Text style={styles.ocrTitle}>Extracted Information</Text>
              </View>
              <Text style={styles.ocrNote}>
                Please review and correct if needed
              </Text>
            </Card>
          )}

          <Card style={styles.formCard}>
            <Text style={styles.inputLabel}>Vendor *</Text>
            <TextInput
              style={styles.input}
              value={receiptData.vendor}
              onChangeText={(text) => setReceiptData({ ...receiptData, vendor: text })}
              placeholder="Store or vendor name"
              placeholderTextColor={colors.gray[400]}
            />

            <Text style={styles.inputLabel}>Amount *</Text>
            <TextInput
              style={styles.input}
              value={receiptData.amount}
              onChangeText={(text) => setReceiptData({ ...receiptData, amount: text })}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.gray[400]}
            />

            <Text style={styles.inputLabel}>Date</Text>
            <TextInput
              style={styles.input}
              value={receiptData.date}
              onChangeText={(text) => setReceiptData({ ...receiptData, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.gray[400]}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {['fuel', 'meals', 'office-supplies', 'travel', 'software', 'other'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    receiptData.category === cat && styles.categoryChipSelected
                  ]}
                  onPress={() => setReceiptData({ ...receiptData, category: cat })}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      receiptData.category === cat && styles.categoryTextSelected
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.inputLabel}>Tax Amount (GST/HST)</Text>
            <TextInput
              style={styles.input}
              value={receiptData.taxAmount}
              onChangeText={(text) => setReceiptData({ ...receiptData, taxAmount: text })}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.gray[400]}
            />

            <Text style={styles.inputLabel}>Tax Rate (%)</Text>
            <TextInput
              style={styles.input}
              value={receiptData.taxRate}
              onChangeText={(text) => setReceiptData({ ...receiptData, taxRate: text })}
              placeholder="13"
              keyboardType="decimal-pad"
              placeholderTextColor={colors.gray[400]}
            />

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={receiptData.notes}
              onChangeText={(text) => setReceiptData({ ...receiptData, notes: text })}
              placeholder="Add notes about this receipt..."
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              placeholderTextColor={colors.gray[400]}
            />
          </Card>

          <View style={styles.formActions}>
            <Button
              title="Save Receipt"
              onPress={saveReceipt}
              loading={createMutation.isLoading}
              style={styles.saveButton}
            />
            <Button
              title="Discard"
              variant="outline"
              onPress={resetCamera}
              style={styles.discardButton}
            />
          </View>
        </ScrollView>

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.processingText}>Saving receipt...</Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideFrame: {
    position: 'relative',
    width: '80%',
    height: 200,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: borderRadius.lg,
  },
  guideCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.white,
    borderWidth: 3,
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  guideCornerTopRight: {
    right: -3,
    left: undefined,
    borderLeftWidth: 0,
    borderRightWidth: 3,
  },
  guideCornerBottomLeft: {
    bottom: -3,
    top: undefined,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  guideCornerBottomRight: {
    bottom: -3,
    right: -3,
    top: undefined,
    left: undefined,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  guideText: {
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: typography.sizes.sm,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: spacing.xl * 2,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPermissionText: {
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: typography.sizes.lg,
    paddingHorizontal: spacing.xl,
  },
  permissionButton: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.xl,
  },
  editorContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editorTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  editorDone: {
    ...typography.body,
    color: colors.primary[500],
    fontWeight: typography.weights.semibold,
  },
  editorImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  editorTools: {
    flex: 1,
    padding: spacing.lg,
  },
  toolCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  toolLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  cropButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary[500],
    gap: spacing.sm,
  },
  cropButtonActive: {
    backgroundColor: colors.primary[500],
  },
  cropText: {
    ...typography.body,
    color: colors.primary[500],
  },
  cropTextActive: {
    color: colors.white,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    ...typography.body,
    color: colors.white,
    marginTop: spacing.md,
  },
  formContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  formContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  formTitle: {
    ...typography.h6,
    color: colors.text.primary,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  ocrCard: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.primary[50],
  },
  ocrHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  ocrTitle: {
    ...typography.body,
    color: colors.primary[700],
    fontWeight: typography.weights.medium,
  },
  ocrNote: {
    ...typography.caption,
    color: colors.primary[600],
  },
  formCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...typography.body,
    color: colors.text.primary,
  },
  textArea: {
    minHeight: 80,
  },
  categoryScroll: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    marginRight: spacing.sm,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary[500],
  },
  categoryText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  categoryTextSelected: {
    color: colors.white,
  },
  formActions: {
    gap: spacing.md,
  },
  saveButton: {
    marginBottom: spacing.sm,
  },
  discardButton: {
    marginBottom: spacing.lg,
  },
});

export default CameraScreen;






