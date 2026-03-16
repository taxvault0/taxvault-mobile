import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, typography, spacing, borderRadius } from '../../constants/theme';

const CameraScreen = ({ navigation, route }) => {
  const { mode = 'receipt' } = route.params || {};
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });
      setCapturedImage(photo.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const retakePicture = () => {
    setCapturedImage(null);
  };

  const usePicture = () => {
    if (mode === 'receipt') {
      navigation.navigate('ReceiptDetail', {
        imageUri: capturedImage,
        isNew: true,
      });
    } else {
      // Handle other modes (profile picture, etc.)
      navigation.goBack();
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.noPermissionText}>
          No access to camera. Please enable camera permissions in settings.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isFocused && !capturedImage ? (
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={cameraType}
          flashMode={flash}
        >
          <View style={styles.overlay}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerButton}
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
                style={styles.headerButton}
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
            <View style={styles.bottomControls}>
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
      ) : (
        capturedImage && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: capturedImage }} style={styles.preview} />

            {/* Preview Controls */}
            <View style={styles.previewControls}>
              <TouchableOpacity onPress={retakePicture} style={styles.previewButton}>
                <Icon name="close" size={24} color={colors.warning} />
                <Text style={styles.previewButtonText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={usePicture} style={[styles.previewButton, styles.useButton]}>
                <Icon name="check" size={24} color={colors.success} />
                <Text style={[styles.previewButtonText, styles.useButtonText]}>Use Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
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
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: spacing['3xl'],
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContainer: {
    flex: 1,
  },
  preview: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    position: 'absolute',
    bottom: spacing['3xl'],
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
  },
  useButton: {
    backgroundColor: colors.success,
  },
  previewButtonText: {
    marginLeft: spacing.sm,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.warning,
  },
  useButtonText: {
    color: colors.white,
  },
  noPermissionText: {
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing['3xl'],
    fontSize: typography.sizes.lg,
  },
});

export default CameraScreen;
