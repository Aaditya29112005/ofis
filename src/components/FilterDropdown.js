import React, { useRef, useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, Modal, Animated, 
  Pressable, Dimensions, ScrollView, TextInput 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { FONTS, FONT_SIZE } from '../theme/typography';
import { SPACING, BORDER_RADIUS } from '../theme/spacing';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FilterDropdown = ({ 
  visible, 
  onClose, 
  options = [], 
  selectedOption, 
  onSelect, 
  title = "Select Option",
  searchable = false
}) => {
  const { colors, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (visible) {
      setSearchQuery('');
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
          speed: 12,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      onClose();
    });
  };

  const handleSelect = (option) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      onSelect(option);
    });
  };

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlayContainer}>
        <Animated.View 
          style={[styles.backdrop, { opacity: fadeAnim, backgroundColor: 'rgba(0,0,0,0.5)' }]} 
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        <Animated.View 
          style={[
            styles.sheet, 
            { 
              backgroundColor: colors.surface,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <Pressable onPress={handleClose} hitSlop={10}>
              <Icon name="close-outline" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>

          {searchable && (
            <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
              <Icon name="search-outline" size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {filteredOptions.length === 0 ? (
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No options found</Text>
            ) : (
              filteredOptions.map((item, index) => {
                const isSelected = selectedOption?.value === item.value;
                return (
                  <Pressable 
                    key={index} 
                    style={({ pressed }) => [
                      styles.optionItem,
                      {
                        backgroundColor: pressed 
                          ? colors.background 
                          : isSelected ? `${colors.primary}15` : 'transparent',
                      }
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text style={[
                      styles.optionText, 
                      { 
                        color: isSelected ? colors.primary : colors.text,
                        fontFamily: isSelected ? FONTS.semibold : FONTS.regular
                      }
                    ]}>
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Icon name="checkmark-outline" size={20} color={colors.primary} />
                    )}
                  </Pressable>
                );
              })
            )}
            {/* Bottom Padding */}
            <View style={{ height: 40 }} />
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: '100%',
    maxHeight: SCREEN_HEIGHT * 0.7,
    minHeight: SCREEN_HEIGHT * 0.4,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZE.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.md,
  },
  list: {
    flex: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 4,
  },
  optionText: {
    fontSize: FONT_SIZE.md,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginTop: SPACING.xl,
  }
});

export default FilterDropdown;
