import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { X, User, Mail, Phone, CheckCircle2 } from 'lucide-react-native';
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInUp, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { FONTS } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const EditProfileModal = ({ visible, onClose, initialData, onSave }) => {
  const { colors, isDark } = useTheme();
  const [formData, setFormData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      setFormData(initialData);
      setShowSuccess(false);
    }
  }, [visible, initialData]);

  const handleSave = () => {
    ReactNativeHapticFeedback.trigger('impactHeavy');
    setIsSaving(true);
    
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 1000);
  };

  const InputField = ({ icon: Icon, label, value, onChangeText, keyboardType }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#181818' : '#F1F3F5', borderColor: colors.border }]}>
        <Icon size={18} color={colors.textSecondary} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          placeholderTextColor={colors.textMuted}
          selectionColor="#FF8A00"
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <Animated.View 
            entering={FadeIn.duration(300)} 
            exiting={FadeOut.duration(200)}
            style={StyleSheet.absoluteFill}
          >
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
          </Animated.View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.contentContainer}
          >
            <Animated.View 
              entering={SlideInUp.springify().damping(20)}
              style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: colors.surfaceElevated }]}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {showSuccess ? (
                <Animated.View entering={FadeIn} style={styles.successContainer}>
                  <CheckCircle2 size={64} color="#34C759" />
                  <Text style={[styles.successText, { color: colors.text }]}>Profile Updated Successfully!</Text>
                </Animated.View>
              ) : (
                <View style={styles.form}>
                  <InputField 
                    icon={User} 
                    label="FULL NAME" 
                    value={formData.name}
                    onChangeText={(text) => setFormData({...formData, name: text})}
                  />
                  <InputField 
                    icon={Mail} 
                    label="EMAIL ADDRESS" 
                    value={formData.email}
                    onChangeText={(text) => setFormData({...formData, email: text})}
                    keyboardType="email-address"
                  />
                  <InputField 
                    icon={Phone} 
                    label="MOBILE NUMBER" 
                    value={formData.mobile}
                    onChangeText={(text) => setFormData({...formData, mobile: text})}
                    keyboardType="phone-pad"
                  />

                  <TouchableOpacity 
                    style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} 
                    onPress={handleSave}
                    disabled={isSaving}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.saveBtnText}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  contentContainer: {
    width: '100%',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 10,
  },
  label: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    letterSpacing: 1.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#FF8A00',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    color: '#FFF', // White on orange — always correct
    fontFamily: FONTS.bold,
    fontSize: 16,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 20,
  },
  successText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default EditProfileModal;
