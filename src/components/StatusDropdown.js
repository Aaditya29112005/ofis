import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring 
} from 'react-native-reanimated';
import { ChevronDown, Check } from 'lucide-react-native';
import { FONTS } from '../theme/typography';
import { useTheme } from '../context/ThemeContext';

const StatusDropdown = ({ selected, onSelect }) => {
  const { colors, isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  
  const options = ['All Status', 'Booked', 'Completed', 'Cancelled', 'Ongoing'];

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        style={[styles.trigger, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : colors.surface, borderColor: colors.border }]}
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={[styles.triggerText, { color: colors.text }]}>{selected || 'All Status'}</Text>
        <ChevronDown size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <Animated.View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border, shadowColor: '#000' }]}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.option}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={[
                      styles.optionText, 
                      { color: selected === item ? colors.primary : colors.textSecondary },
                      selected === item && { fontFamily: FONTS.bold }
                  ]}>
                    {item}
                  </Text>
                  {selected === item && <Check size={16} color={colors.primary} />}
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 140,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  triggerText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: 200,
    borderRadius: 20,
    borderWidth: 1,
    padding: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  optionText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
  }
});

export default StatusDropdown;
