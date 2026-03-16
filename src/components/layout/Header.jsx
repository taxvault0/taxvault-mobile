import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles/colors';
import { typography } from '../../styles/typography';
import { spacing } from '../../styles/spacing';

const Header = ({
  title,
  showBack = false,
  showProfile = true,
  rightIcon,
  onRightPress,
  backgroundColor = colors.white,
}) => {
  const navigation = useNavigation();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: spacing.layout.headerHeight,
          backgroundColor,
          paddingHorizontal: spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {showBack && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: spacing.md }}>
              <Icon name="arrow-left" size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          <Text style={[typography.styles.h6, { color: colors.text.primary }]}>{title}</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {rightIcon && (
            <TouchableOpacity onPress={onRightPress}>
              <Icon name={rightIcon} size={24} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          {showProfile && !rightIcon && (
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: spacing.radius.full,
                  backgroundColor: colors.primary[100],
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={[typography.styles.body1, { color: colors.primary[500] }]}>U</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default Header;
