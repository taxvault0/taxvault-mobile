import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CACard = ({ item, onView, onBook }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>
          <Icon name={item?.avatarIcon || 'account-tie-outline'} size={22} color="#2563EB" />
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.location}>{item?.location}</Text>
        </View>
      </View>

      <View style={styles.tagsRow}>
        {item?.specialization?.slice(0, 3)?.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Consultation ${item?.consultationFee}</Text>
        <Text style={styles.metaText}>From ${item?.filingFeeFrom}</Text>
        <Text style={styles.metaText}>⭐ {item?.rating}</Text>
      </View>

      <View style={styles.availabilityRow}>
        <Icon name="calendar-clock-outline" size={16} color="#0F766E" />
        <Text style={styles.availabilityText}>{item?.nextAvailable}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => onView?.(item)}>
          <Text style={styles.secondaryButtonText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={() => onBook?.(item)}>
          <Text style={styles.primaryButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CACard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5EAF2',
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#EEF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  title: {
    marginTop: 4,
    fontSize: 13,
    color: '#475569',
    fontWeight: '700',
  },
  location: {
    marginTop: 3,
    fontSize: 13,
    color: '#64748B',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5EAF2',
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '700',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  availabilityText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  secondaryButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 14,
  },
  primaryButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});