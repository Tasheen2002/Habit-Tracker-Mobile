'use client';

import type React from 'react';
import {
  TouchableOpacity,
  Text,
  type ViewStyle,
  type TextStyle,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const {colors} = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 6,
    };

    const sizeStyles = {
      small: {paddingVertical: 12, paddingHorizontal: 20},
      medium: {paddingVertical: 16, paddingHorizontal: 32},
      large: {paddingVertical: 20, paddingHorizontal: 40},
    };

    const variantStyles = {
      primary: {backgroundColor: colors.primary},
      secondary: {backgroundColor: colors.secondary},
      success: {backgroundColor: colors.success},
      warning: {backgroundColor: colors.warning},
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled || loading ? 0.6 : 1,
      ...style,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeStyles = {
      small: {fontSize: 14},
      medium: {fontSize: 16},
      large: {fontSize: 18},
    };

    const variantStyles = {
      primary: {color: '#FFFFFF'},
      secondary: {color: '#FFFFFF'},
      success: {color: '#FFFFFF'},
      warning: {color: '#FFFFFF'},
      outline: {color: colors.primary},
    };

    return {
      fontWeight: '700',
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};
