import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const { width } = Dimensions.get('window');

const MileageScreen = () => {
  const navigation = useNavigation();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Sample data - replace with API data
  const [trips, setTrips] = useState([
    { 
      id: '1', 
      purpose: 'business', 
      distance: 23.4, 
      date: '2024-03-15T10:30:00', 
      start: 'Home', 
      end: 'Client Office',
      duration: 45,
      notes: 'Client meeting'
    },
    { 
      id: '2', 
      purpose: 'commute', 
      distance: 12.1, 
      date: '2024-03-14T08:15:00', 
      start: 'Home', 
      end: 'Work',
      duration: 25,
      notes: 'Regular commute'
    },
    { 
      id: '3', 
      purpose: 'business', 
      distance: 45.2, 
      date: '2024-03-13T14:20:00', 
      start: 'Office', 
      end: 'Supplier',
      duration: 65,
      notes: 'Pick up supplies'
    },
    { 
      id: '4', 
      purpose: 'personal', 
      distance: 8.5, 
      date: '2024-03-12T18:30:00', 
      start: 'Home', 
      end: 'Grocery Store',
      duration: 20,
      notes: 'Personal errand'
    },
    { 
      id: '5', 
      purpose: 'business', 
      distance: 15.7, 
      date: '2024-03-11T09:00:00', 
      start: 'Home', 
      end: 'Client Site',
      duration: 30,
      notes: 'Site visit'
    },
  ]);

  const years = [2025, 2024, 2023, 2022];

  // Calculate statistics
  const businessTrips = trips.filter(t => t.purpose === 'business');
  const totalBusinessKm = businessTrips.reduce((sum, t) => sum + t.distance, 0);
  const totalCommuteKm = trips.filter(t => t.purpose === 'commute').reduce((sum, t) => sum + t.distance, 0);
  const totalPersonalKm = trips.filter(t => t.purpose === 'personal').reduce((sum, t) => sum + t.distance, 0);
  
  const deductionRate = 0.61; // CRA rate per km for 2024
  const estimatedDeduction = totalBusinessKm * deductionRate;
  
  const averageTripDistance = businessTrips.length > 0 
    ? totalBusinessKm / businessTrips.length 
    : 0;

  // Chart data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [23.4, 12.1, 45.2, 0, 15.7, 8.5, 0],
      color: (opacity = 1) => colors.primary[500],
      strokeWidth: 2
    }]
  };

  const chartConfig = {
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    color: (opacity = 1) => `rgba(0, 90, 156, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    style: {
      borderRadius: spacing.radius.lg,
    },
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-CA', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-CA', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDeleteTrip = (id) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            setTrips(trips.filter(t => t.id !== id));
          },
          style: 'destructive'
        },
      ]
    );
  };

  const renderTripItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={() => handleDeleteTrip(item.id)}
      style={{
        backgroundColor: colors.white,
        borderRadius: spacing.radius.lg,
        marginBottom: spacing.md,
        padding: spacing.md,
        ...spacing.shadows.sm,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: spacing.radius.md,
          backgroundColor: item.purpose === 'business' 
            ? colors.success.light 
            : item.purpose === 'commute' 
              ? colors.info.light 
              : colors.warning.light,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}>
          <Icon 
            name={item.purpose === 'business' ? 'briefcase' : item.purpose === 'commute' ? 'home' : 'account'} 
            size={24} 
            color={item.purpose === 'business' 
              ? colors.success.main 
              : item.purpose === 'commute' 
                ? colors.info.main 
                : colors.warning.main} 
          />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[typography.styles.body1, { fontWeight: typography.weights.medium }]}>
              {item.start} → {item.end}
            </Text>
            <Badge status={item.purpose} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="calendar" size={14} color={colors.gray[400]} />
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginLeft: 4, marginRight: spacing.md }]}>
                {formatDate(item.date)}
              </Text>
              <Icon name="clock-outline" size={14} color={colors.gray[400]} />
              <Text style={[typography.styles.caption, { color: colors.text.secondary, marginLeft: 4 }]}>
                {formatTime(item.date)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="map-marker-distance" size={14} color={colors.primary[500]} />
              <Text style={[typography.styles.body1, { fontWeight: typography.weights.semiBold, marginLeft: 4 }]}>
                {item.distance} km
              </Text>
            </View>
          </View>

          {item.notes && (
            <Text style={[typography.styles.caption, { color: colors.gray[400], marginTop: spacing.xs }]}>
              {item.notes}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header 
        title="Mileage" 
        rightIcon="plus"
        onRightPress={() => navigation.navigate('MileageTracker')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing['2xl'] }}>
        {/* Year Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}
        >
          {years.map(year => (
            <TouchableOpacity
              key={year}
              onPress={() => setSelectedYear(year)}
              style={{
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                borderRadius: spacing.radius.full,
                backgroundColor: year === selectedYear ? colors.primary[500] : colors.white,
                marginRight: spacing.sm,
                borderWidth: 1,
                borderColor: year === selectedYear ? colors.primary[500] : colors.gray[200],
              }}
            >
              <Text style={{
                color: year === selectedYear ? colors.white : colors.text.secondary,
                fontSize: typography.sizes.sm,
                fontWeight: typography.weights.medium,
              }}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: spacing.lg, gap: spacing.md }}>
          <Card style={{ width: '47%', marginBottom: spacing.md }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Business KM</Text>
              <Text style={[typography.styles.h3, { color: colors.success.main, marginVertical: spacing.xs }]}>
                {totalBusinessKm.toFixed(1)}
              </Text>
              <Text style={[typography.styles.caption, { color: colors.gray[400] }]}>km</Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '47%', marginBottom: spacing.md }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Est. Deduction</Text>
              <Text style={[typography.styles.h3, { color: colors.gold.main, marginVertical: spacing.xs }]}>
                ${estimatedDeduction.toFixed(2)}
              </Text>
              <Text style={[typography.styles.caption, { color: colors.gray[400] }]}>@ $0.61/km</Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '30%' }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Commute</Text>
              <Text style={[typography.styles.h5, { color: colors.info.main }]}>
                {totalCommuteKm.toFixed(1)}
              </Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '30%' }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Personal</Text>
              <Text style={[typography.styles.h5, { color: colors.warning.main }]}>
                {totalPersonalKm.toFixed(1)}
              </Text>
            </Card.Body>
          </Card>

          <Card style={{ width: '30%' }}>
            <Card.Body>
              <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Avg Trip</Text>
              <Text style={[typography.styles.h5, { color: colors.primary[500] }]}>
                {averageTripDistance.toFixed(1)}
              </Text>
            </Card.Body>
          </Card>
        </View>

        {/* Chart */}
        <Card style={{ marginHorizontal: spacing.lg, marginBottom: spacing.lg }}>
          <Card.Header>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={[typography.styles.h6]}>Weekly Activity</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: spacing.radius.full,
                    backgroundColor: selectedPeriod === 'week' ? colors.primary[500] : colors.gray[100],
                    marginRight: spacing.sm,
                  }}
                  onPress={() => setSelectedPeriod('week')}
                >
                  <Text style={{ color: selectedPeriod === 'week' ? colors.white : colors.text.secondary }}>
                    Week
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: spacing.radius.full,
                    backgroundColor: selectedPeriod === 'month' ? colors.primary[500] : colors.gray[100],
                  }}
                  onPress={() => setSelectedPeriod('month')}
                >
                  <Text style={{ color: selectedPeriod === 'month' ? colors.white : colors.text.secondary }}>
                    Month
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Header>
          <Card.Body>
            <LineChart
              data={chartData}
              width={width - spacing.lg * 4}
              height={180}
              chartConfig={chartConfig}
              bezier
              style={{
                borderRadius: spacing.radius.md,
              }}
            />
          </Card.Body>
        </Card>

        {/* Recent Trips Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: spacing.lg,
          marginBottom: spacing.md,
        }}>
          <Text style={[typography.styles.h6]}>Recent Trips</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MileageTracker')}>
            <Text style={[typography.styles.caption, { color: colors.primary[500] }]}>
              Start New Trip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trips List */}
        {trips.length > 0 ? (
          <FlatList
            data={trips}
            renderItem={renderTripItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
            }}
          />
        ) : (
          <EmptyState
            icon="map-marker-distance"
            title="No trips recorded"
            message="Start tracking your mileage for tax deductions"
            buttonText="Start Tracking"
            onButtonPress={() => navigation.navigate('MileageTracker')}
          />
        )}

        {/* CRA Rate Info */}
        <Card style={{ margin: spacing.lg, backgroundColor: colors.primary[50] }}>
          <Card.Body>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="information" size={20} color={colors.primary[500]} />
              <Text style={[typography.styles.body2, { color: colors.primary[700], marginLeft: spacing.sm, flex: 1 }]}>
                2024 CRA mileage rate: $0.61 per km for business travel
              </Text>
            </View>
          </Card.Body>
        </Card>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
};

export default MileageScreen;
