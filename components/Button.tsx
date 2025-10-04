import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'social';
  style?: ViewStyle;
  textStyle?: TextStyle;
  activeOpacity?: number;
  children?: React.ReactNode;
}

export default function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
  activeOpacity = 0.8,
  children,
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[variant]];
    if (disabled || loading) {
      baseStyle.push(styles.disabled);
    }
    if (style) {
      baseStyle.push(style);
    }
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${variant}Text`]];
    if (textStyle) {
      baseTextStyle.push(textStyle);
    }
    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={getButtonStyle()}
      activeOpacity={activeOpacity}
    >
      {children || (
        <Text style={getTextStyle()}>
          {loading ? 'Loading...' : title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#333',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primary: {
    backgroundColor: '#333',
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(51, 51, 51, 0.3)',
  },
  social: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1.5,
    borderColor: 'rgba(51, 51, 51, 0.3)',
    paddingVertical: 0,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#333',
  },
  socialText: {
    color: '#333',
  },
});
