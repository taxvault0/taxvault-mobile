import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mileageAPI } from '../services/api';
import { useAuth } from './AuthContext';

const LOCATION_TASK_NAME = 'background-location-task';
const MileageContext = createContext();

export const useMileage = () => {
  const context = useContext(MileageContext);
  if (!context) {
    throw new Error('useMileage must be used within a MileageProvider');
  }
  return context;
};

// Define background task
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('Location task error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    // Handle location updates in background
    // Store in AsyncStorage to sync later
    const stored = await AsyncStorage.getItem('pendingTrips');
    const pending = stored ? JSON.parse(stored) : [];
    pending.push({
      timestamp: new Date().toISOString(),
      locations,
    });
    await AsyncStorage.setItem('pendingTrips', JSON.stringify(pending));
  }
});

export const MileageProvider = ({ children }) => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [location, setLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    checkPermissions();
    loadRecentTrips();
  }, []);

  const checkPermissions = async () => {
    const { status: foregroundStatus } = await Location.getForegroundPermissionsAsync();
    const { status: backgroundStatus } = await Location.getBackgroundPermissionsAsync();
    setPermissionStatus({ foreground: foregroundStatus, background: backgroundStatus });
  };

  const requestPermissions = async () => {
    const foreground = await Location.requestForegroundPermissionsAsync();
    const background = await Location.requestBackgroundPermissionsAsync();
    setPermissionStatus({ foreground: foreground.status, background: background.status });
    return foreground.status === 'granted' && background.status === 'granted';
  };

  const loadRecentTrips = async () => {
    try {
      const response = await mileageAPI.getMileage(new Date().getFullYear());
      setRecentTrips(response.data.trips.slice(0, 10));
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  };

  const startTracking = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      console.log('Location permissions not granted');
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 10000, // 10 seconds
      distanceInterval: 100, // 100 meters
      deferredUpdatesInterval: 60000, // 1 minute
      showsBackgroundLocationIndicator: true,
    });

    setIsTracking(true);
    setCurrentTrip({
      startTime: new Date().toISOString(),
      locations: [],
    });
  };

  const stopTracking = async () => {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    
    // Calculate total distance
    const pending = await AsyncStorage.getItem('pendingTrips');
    if (pending) {
      const trips = JSON.parse(pending);
      // Process and save trip
      await saveTrip(trips);
      await AsyncStorage.removeItem('pendingTrips');
    }

    setIsTracking(false);
    setCurrentTrip(null);
  };

  const saveTrip = async (tripData) => {
    try {
      // Calculate distance from locations
      const totalDistance = calculateDistance(tripData);
      
      await mileageAPI.addTrip({
        date: new Date().toISOString(),
        distance: totalDistance,
        purpose: 'business',
        startLocation: tripData[0]?.locations[0],
        endLocation: tripData[tripData.length - 1]?.locations[0],
      });

      await loadRecentTrips();
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const calculateDistance = (tripData) => {
    // Implement distance calculation using Haversine formula
    // This is simplified - you'd want to calculate actual distance traveled
    return tripData.length * 0.1; // Placeholder
  };

  const addManualTrip = async (trip) => {
    try {
      await mileageAPI.addTrip(trip);
      await loadRecentTrips();
    } catch (error) {
      console.error('Error adding manual trip:', error);
    }
  };

  const value = {
    isTracking,
    currentTrip,
    location,
    permissionStatus,
    recentTrips,
    startTracking,
    stopTracking,
    addManualTrip,
    requestPermissions,
  };

  return (
    <MileageContext.Provider value={value}>
      {children}
    </MileageContext.Provider>
  );
};
