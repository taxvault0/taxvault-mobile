import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Header from '@/components/layout/AppHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { colors } from '@/styles/theme';
import { typography } from '@/styles/theme';
import { spacing, borderRadius } from '@/styles/theme';

const ShopOwnerDashboardScreen = () => {
  const navigation = useNavigation();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [documentStats, setDocumentStats] = useState({
    total: 45,
    uploaded: 28,
    required: 17,
    overdue: 3,
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'upload', document: 'March Sales Summary', date: '2024-03-15', status: 'verified' },
    { id: 2, type: 'reminder', document: 'April Rent Receipt', date: '2024-03-14', status: 'pending' },
    { id: 3, type: 'upload', document: 'Q1 GST/HST Return', date: '2024-03-10', status: 'verified' },
    { id: 4, type: 'alert', document: 'Payroll Records - March', date: '2024-03-05', status: 'missing' },
  ]);

  const [upcomingDeadlines, setUpcomingDeadlines] = useState([
    { id: 1, task: 'GST/HST Return Filing', dueDate: '2024-04-30', daysLeft: 15, priority: 'high' },
    { id: 2, task: 'April Rent Payment Receipt', dueDate: '2024-04-05', daysLeft: 3, priority: 'high' },
    { id: 3, task: 'Monthly Sales Summary - March', dueDate: '2024-04-10', daysLeft: 8, priority: 'medium' },
    { id: 4, task: 'Payroll Source Deductions', dueDate: '2024-04-15', daysLeft: 13, priority: 'medium' },
  ]);

  const years = [2025, 2024, 2023, 2022];
  
  const documentCategories = [
    { 
      id: 'business-info', 
      title: 'Business Information', 
      icon: 'store',
      count: '2/4',
      color: colors.primary[500],
      screen: 'ShopBusinessInfo'
    },
    { 
      id: 'sales-income', 
      title: 'Sales & Income', 
      icon: 'cash-multiple',
      count: '6/12',
      color: colors.success,
      screen: 'ShopSalesIncome'
    },
    { 
      id: 'expenses', 
      title: 'Rent & Utilities', 
      icon: 'home',
      count: '3/6',
      color: colors.warning,
      screen: 'ShopRentUtilities'
    },
    { 
      id: 'payroll', 
      title: 'Payroll & Employees', 
      icon: 'account-group',
      count: '4/8',
      color: colors.info,
      screen: 'ShopPayroll'
    },
    { 
      id: 'franchise', 
      title: 'Franchise Documents', 
      icon: 'file-tree',
      count: '1/3',
      color: colors.gold,
      screen: 'ShopFranchise'
    },
    { 
      id: 'inventory', 
      title: 'Inventory & COGS', 
      icon: 'package-variant',
      count: '5/10',
      color: colors.secondary[500],
      screen: 'ShopInventory'
    },
    { 
      id: 'gst', 
      title: 'GST/HST Records', 
      icon: 'percent',
      count: '2/4',
      color: '#9C27B0',
      screen: 'ShopGSTRecords'
    },
  ];

  // Recommended CAs for Shop Owners
  const recommendedCAs = [
    { 
      id: 1, 
      initials: 'DC', 
      name: 'David Chen', 
      distance: '2.3', 
      rating: 4.8, 
      specialty: 'Retail Expert',
      firm: 'Chen & Associates'
    },
    { 
      id: 2, 
      initials: 'LW', 
      name: 'Lisa Wong', 
      distance: '4.1', 
      rating: 4.9, 
      specialty: 'Franchise Specialist',
      firm: 'Wong Financial'
    },
    { 
      id: 3, 
      initials: 'RS', 
      name: 'Raj Singh', 
      distance: '5.3', 
      rating: 4.7, 
      specialty: 'Inventory & COGS',
      firm: 'Singh & Co.'
    },
    { 
      id: 4, 
      initials: 'JT', 
      name: 'Jennifer Thompson', 
      distance: '1.8', 
      rating: 4.9, 
      specialty: 'GST/HST Expert',
      firm: 'Thompson Tax'
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return colors.warning;
      case 'medium': return colors.gold;
      case 'low': return colors.success;
      default: return colors.gray[400];
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'upload': return 'cloud-upload';
      case 'reminder': return 'bell';
      case 'alert': return 'alert';
      default: return 'file-document';
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <Header 
        title="Shop Owner Dashboard" 
        showBack 
        rightIcon="cog"
        onRightPress={() => navigation.navigate('ShopSettings')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: spacing.lg }}>
        {/* Welcome & Year Selector */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
          <View>
            <Text style={[typography.styles.h5]}>Welcome back,</Text>
            <Text style={[typography.styles.h4, { color: colors.primary[500] }]}>Marcus' Convenience</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxWidth: 200 }}>
            {years.map(year => (
              <TouchableOpacity
                key={year}
                style={{
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: borderRadius.full,
                  backgroundColor: year === selectedYear ? colors.primary[500] : colors.gray[100],
                  marginLeft: spacing.sm,
                }}
                onPress={() => setSelectedYear(year)}
              >
                <Text style={{
                  color: year === selectedYear ? colors.white : colors.text.secondary,
                  fontSize: typography.sizes.sm,
                }}>
                  {year}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Business Info Card */}
        <Card style={{ marginBottom: spacing.lg, backgroundColor: colors.primary[50] }}>
          <Card.Body>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Business Number</Text>
                <Text style={[typography.styles.body1, { fontWeight: typography.weights.semibold }]}>
                  123456789 RT0001
                </Text>
                <Text style={[typography.styles.caption, { color: colors.text.secondary, marginTop: spacing.xs }]}>
                  Franchise: 7-Eleven #12345
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('ShopBusinessInfo')}>
                <Badge status="info" text="Update" />
              </TouchableOpacity>
            </View>
          </Card.Body>
        </Card>

        {/* Document Progress Overview */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Card.Body>
            <Text style={[typography.styles.h6, { marginBottom: spacing.md }]}>Document Status</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={[typography.styles.h3, { color: colors.primary[500] }]}>{documentStats.total}</Text>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Total Required</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[typography.styles.h3, { color: colors.success }]}>{documentStats.uploaded}</Text>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Uploaded</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[typography.styles.h3, { color: colors.warning }]}>{documentStats.required}</Text>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Pending</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={[typography.styles.h3, { color: colors.warning }]}>{documentStats.overdue}</Text>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>Overdue</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={{
              height: 8,
              backgroundColor: colors.gray[200],
              borderRadius: borderRadius.full,
              marginTop: spacing.md,
              overflow: 'hidden',
            }}>
              <View style={{
                width: `${(documentStats.uploaded / documentStats.total) * 100}%`,
                height: '100%',
                backgroundColor: colors.success,
              }} />
            </View>
            <Text style={[typography.styles.caption, { color: colors.text.secondary, marginTop: spacing.xs }]}>
              {Math.round((documentStats.uploaded / documentStats.total) * 100)}% Complete
            </Text>
          </Card.Body>
        </Card>

        {/* Find a CA - Shop Owner Specific */}
        <Card
          style={{
            marginBottom: spacing.lg,
            backgroundColor: colors.primary[50],
            borderColor: colors.primary[200],
            borderWidth: 1,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate('FindCA', { userType: 'shop-owner' })}>
            <Card.Body>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
                <View style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.primary[500],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Icon name="store" size={24} color={colors.white} />
                </View>
                
                <View style={{ flex: 1, marginLeft: spacing.md }}>
                  <Text style={[typography.styles.body1, { fontWeight: typography.weights.semibold, color: colors.primary[700] }]}>
                    Find a Retail Specialist CA
                  </Text>
                  <Text style={[typography.styles.caption, { color: colors.primary[600] }]}>
                    CAs specializing in retail & franchise accounting
                  </Text>
                </View>
                
                <Icon name="chevron-right" size={24} color={colors.primary[500]} />
              </View>

              {/* Recommended CAs Preview */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendedCAs.map((ca) => (
                  <TouchableOpacity
                    key={ca.id}
                    style={{
                      backgroundColor: colors.white,
                      borderRadius: borderRadius.lg,
                      padding: spacing.sm,
                      marginRight: spacing.sm,
                      width: 140,
                      ...spacing.shadows.sm,
                    }}
                    onPress={() => navigation.navigate('FindCA', { caId: ca.id })}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs }}>
                      <View style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: colors.primary[100],
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                        <Text style={[typography.styles.body2, { fontWeight: typography.weights.bold, color: colors.primary[500] }]}>
                          {ca.initials}
                        </Text>
                      </View>
                      <View style={{ marginLeft: spacing.xs, flex: 1 }}>
                        <Text style={[typography.styles.caption, { fontWeight: typography.weights.semibold }]}>
                          {ca.name}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={[typography.styles.caption, { color: colors.text.secondary, fontSize: 10 }]} numberOfLines={1}>
                      {ca.firm}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs }}>
                      <Icon name="map-marker" size={10} color={colors.gray[400]} />
                      <Text style={[typography.styles.caption, { color: colors.gray[500], marginLeft: 2, fontSize: 10 }]}>
                        {ca.distance} km
                      </Text>
                      <Icon name="star" size={10} color={colors.gold} style={{ marginLeft: spacing.xs }} />
                      <Text style={[typography.styles.caption, { color: colors.gray[500], marginLeft: 2, fontSize: 10 }]}>
                        {ca.rating}
                      </Text>
                    </View>
                    
                    <View style={{
                      backgroundColor: colors.primary[50],
                      paddingHorizontal: spacing.xs,
                      paddingVertical: 2,
                      borderRadius: borderRadius.sm,
                      alignSelf: 'flex-start',
                      marginTop: spacing.xs,
                    }}>
                      <Text style={[typography.styles.caption, { color: colors.primary[600], fontSize: 8 }]}>
                        {ca.specialty}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
                
                {/* View All Card */}
                <TouchableOpacity
                  style={{
                    backgroundColor: colors.white,
                    borderRadius: borderRadius.lg,
                    padding: spacing.sm,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.primary[200],
                    borderStyle: 'dashed',
                  }}
                  onPress={() => navigation.navigate('FindCA', { userType: 'shop-owner' })}
                >
                  <Icon name="arrow-right" size={20} color={colors.primary[500]} />
                  <Text style={[typography.styles.caption, { color: colors.primary[500], marginTop: spacing.xs }]}>
                    View All
                  </Text>
                </TouchableOpacity>
              </ScrollView>

              {/* Match Indicator */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.md }}>
                <Icon name="check-circle" size={14} color={colors.success} />
                <Text style={[typography.styles.caption, { color: colors.success, marginLeft: spacing.xs }]}>
                  {recommendedCAs.length} CAs match your industry
                </Text>
              </View>
            </Card.Body>
          </TouchableOpacity>
        </Card>

        {/* Document Categories Grid */}
        <Text style={[typography.styles.h6, { marginBottom: spacing.md }]}>Document Categories</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg }}>
          {documentCategories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={{
                width: '47%',
                backgroundColor: colors.white,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                ...spacing.shadows.sm,
              }}
              onPress={() => navigation.navigate(cat.screen)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: borderRadius.md,
                  backgroundColor: cat.color + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.sm,
                }}>
                  <Icon name={cat.icon} size={20} color={cat.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.styles.body2, { fontWeight: typography.weights.semibold }]} numberOfLines={2}>
                    {cat.title}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                  {cat.count} documents
                </Text>
                <Icon name="chevron-right" size={16} color={colors.gray[400]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Deadlines */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Card.Header>
            <Text style={[typography.styles.h6]}>Upcoming Deadlines</Text>
          </Card.Header>
          <Card.Body>
            {upcomingDeadlines.map(deadline => (
              <TouchableOpacity
                key={deadline.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: spacing.sm,
                  borderBottomWidth: deadline.id !== upcomingDeadlines.length ? 1 : 0,
                  borderBottomColor: colors.gray[200],
                }}
              >
                <View style={{
                  width: 36,
                  height: 36,
                  borderRadius: borderRadius.md,
                  backgroundColor: getPriorityColor(deadline.priority) + '20',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: spacing.md,
                }}>
                  <Icon 
                    name={deadline.daysLeft <= 5 ? 'alert' : 'calendar-clock'} 
                    size={18} 
                    color={getPriorityColor(deadline.priority)} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[typography.styles.body2, { fontWeight: typography.weights.medium }]}>
                    {deadline.task}
                  </Text>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                    Due: {deadline.dueDate}
                  </Text>
                </View>
                <Badge 
                  status={deadline.daysLeft <= 5 ? 'warning' : 'info'} 
                  text={`${deadline.daysLeft} days`} 
                />
              </TouchableOpacity>
            ))}
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Card style={{ marginBottom: spacing.lg }}>
          <Card.Header>
            <Text style={[typography.styles.h6]}>Recent Activity</Text>
          </Card.Header>
          <Card.Body>
            {recentActivity.map(activity => (
              <View
                key={activity.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: spacing.sm,
                  borderBottomWidth: activity.id !== recentActivity.length ? 1 : 0,
                  borderBottomColor: colors.gray[200],
                }}
              >
                <Icon 
                  name={getActivityIcon(activity.type)} 
                  size={20} 
                  color={activity.status === 'verified' ? colors.success : colors.warning} 
                />
                <View style={{ marginLeft: spacing.md, flex: 1 }}>
                  <Text style={[typography.styles.body2]}>{activity.document}</Text>
                  <Text style={[typography.styles.caption, { color: colors.text.secondary }]}>
                    {activity.date}
                  </Text>
                </View>
                <Badge 
                  status={
                    activity.status === 'verified' ? 'success' : 
                    activity.status === 'pending' ? 'warning' : 'error'
                  } 
                  text={activity.status}
                />
              </View>
            ))}
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <Card>
          <Card.Header>
            <Text style={[typography.styles.h6]}>Quick Actions</Text>
          </Card.Header>
          <Card.Body>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '47%',
                  padding: spacing.sm,
                  backgroundColor: colors.gray[50],
                  borderRadius: borderRadius.md,
                }}
                onPress={() => navigation.navigate('Camera', { mode: 'document' })}
              >
                <Icon name="camera" size={20} color={colors.primary[500]} />
                <Text style={[typography.styles.body2, { marginLeft: spacing.sm }]}>Scan Receipt</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '47%',
                  padding: spacing.sm,
                  backgroundColor: colors.gray[50],
                  borderRadius: borderRadius.md,
                }}
                onPress={() => navigation.navigate('ShopMonthlySales')}
              >
                <Icon name="cash" size={20} color={colors.success} />
                <Text style={[typography.styles.body2, { marginLeft: spacing.sm }]}>Add Sales</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '47%',
                  padding: spacing.sm,
                  backgroundColor: colors.gray[50],
                  borderRadius: borderRadius.md,
                }}
                onPress={() => navigation.navigate('ShopPayroll')}
              >
                <Icon name="account-group" size={20} color={colors.info} />
                <Text style={[typography.styles.body2, { marginLeft: spacing.sm }]}>Payroll</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '47%',
                  padding: spacing.sm,
                  backgroundColor: colors.gray[50],
                  borderRadius: borderRadius.md,
                }}
                onPress={() => navigation.navigate('ShopGSTRecords')}
              >
                <Icon name="percent" size={20} color={colors.gold} />
                <Text style={[typography.styles.body2, { marginLeft: spacing.sm }]}>GST/HST</Text>
              </TouchableOpacity>
            </View>
          </Card.Body>
        </Card>

        {/* Bottom Padding */}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopOwnerDashboardScreen;

