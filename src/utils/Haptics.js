import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const Haptics = {
  impactLight: () => {
    ReactNativeHapticFeedback.trigger('impactLight', options);
  },
  impactMedium: () => {
    ReactNativeHapticFeedback.trigger('impactMedium', options);
  },
  impactHeavy: () => {
    ReactNativeHapticFeedback.trigger('impactHeavy', options);
  },
  selection: () => {
    ReactNativeHapticFeedback.trigger('selection', options);
  },
  success: () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
  },
  notificationSuccess: () => {
    ReactNativeHapticFeedback.trigger('notificationSuccess', options);
  },
  warning: () => {
    ReactNativeHapticFeedback.trigger('notificationWarning', options);
  },
  notificationWarning: () => {
    ReactNativeHapticFeedback.trigger('notificationWarning', options);
  },
  error: () => {
    ReactNativeHapticFeedback.trigger('notificationError', options);
  },
  notificationError: () => {
    ReactNativeHapticFeedback.trigger('notificationError', options);
  },
};

export default Haptics;
