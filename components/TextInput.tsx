import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput as RNTextInput, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface CustomTextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  focused?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  showPasswordToggle?: boolean;
}

export default function CustomTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
  focused = false,
  style,
  inputStyle,
  showPasswordToggle = false,
}: CustomTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.inputContainer];
    if (isFocused || focused) {
      baseStyle.push(styles.inputFocused);
    }
    if (error) {
      baseStyle.push(styles.inputError);
    }
    if (style) {
      baseStyle.push(style);
    }
    return baseStyle;
  };

  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={getContainerStyle()}>
        <RNTextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="rgba(51,51,51,0.5)"
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[styles.input, inputStyle]}
        />
        {showPasswordToggle && (
          <View style={styles.passwordToggle}>
            <RNTextInput
              value=""
              style={styles.hiddenInput}
              secureTextEntry={false}
            />
            <View style={styles.toggleButton}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
                onPress={togglePasswordVisibility}
              />
            </View>
          </View>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(51, 51, 51, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFocused: {
    borderColor: '#f2c44d',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  inputError: {
    borderColor: 'rgba(239, 68, 68, 0.8)',
  },
  input: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
    flex: 1,
  },
  passwordToggle: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  toggleButton: {
    padding: 8,
    marginRight: -8,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
});
