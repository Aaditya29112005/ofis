import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Eye, ShieldCheck, Coffee, UserPlus } from 'lucide-react-native';

const ActionButton = ({ icon: Icon, label, color, onPress }) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => (scale.value = withSpring(0.92));
  const handlePressOut = () => (scale.value = withSpring(1));

  return (
    <Animated.View style={[animStyle, { flex: 1 }]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        style={[styles.btn, { backgroundColor: color }]}
      >
        <Icon size={14} color="#FFF" />
        <Text style={styles.btnText} numberOfLines={1}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ActionButtons = ({ onAction }) => {
  return (
    <View style={styles.grid}>
      <View style={styles.row}>
        <ActionButton icon={Eye} label="View" color="#475569" onPress={() => onAction('view')} />
        <ActionButton icon={ShieldCheck} label="Give Acc" color="#10B981" onPress={() => onAction('access')} />
      </View>
      <View style={styles.row}>
        <ActionButton icon={Coffee} label="Assign C" color="#F59E0B" onPress={() => onAction('catering')} />
        <ActionButton icon={UserPlus} label="Add Visit" color="#3B82F6" onPress={() => onAction('visitors')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 8,
    gap: 4,
  },
  btnText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  }
});

export default ActionButtons;
