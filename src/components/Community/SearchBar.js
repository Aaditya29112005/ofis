import React, { useState, useEffect, useRef } from 'react';
import { 
    View, 
    TextInput, 
    StyleSheet, 
    TouchableOpacity, 
    Text 
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming,
    FadeInRight,
    FadeOutRight
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import Haptics from '../../utils/Haptics';

const SearchBar = ({ onSearch }) => {
    const { colors, isDark } = useTheme();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    
    const width = useSharedValue(1); // 0 to 1 for expansion
    const inputRef = useRef(null);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        flex: isFocused ? withSpring(1) : 0,
        marginRight: isFocused ? 0 : 12,
        width: isFocused ? '100%' : 44,
        borderColor: isFocused ? '#FF8A00' : 'rgba(255,255,255,0.1)',
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
        shadowColor: '#FF8A00',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: isFocused ? withTiming(0.3) : withTiming(0),
        shadowRadius: isFocused ? withTiming(10) : withTiming(0),
        elevation: isFocused ? 5 : 0,
    }));

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(query);
        }, 300); // 300ms debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleFocus = () => {
        Haptics.impactLight();
        setIsFocused(true);
    };

    const handleCancel = () => {
        setIsFocused(false);
        setQuery('');
        inputRef.current?.blur();
        Haptics.selection();
    };

    return (
        <View style={styles.outerContainer}>
            <Animated.View style={[styles.container, animatedContainerStyle]}>
                <Icon 
                    name="search-outline" 
                    size={20} 
                    color={isFocused ? '#FF8A00' : colors.textMuted} 
                    style={styles.searchIcon}
                />
                <TextInput
                    ref={inputRef}
                    style={[styles.input, { color: colors.text }]}
                    placeholder={isFocused ? "" : "Search posts..."}
                    placeholderTextColor={colors.textMuted}
                    value={query}
                    onChangeText={setQuery}
                    onFocus={handleFocus}
                />
                
                {query.length > 0 && (
                    <Animated.View entering={FadeInRight.duration(200)} exiting={FadeOutRight.duration(200)}>
                        <TouchableOpacity onPress={() => { setQuery(''); Haptics.impactLight(); }}>
                            <Icon name="close-circle" size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </Animated.View>

            {isFocused && (
                <Animated.View entering={FadeInRight} exiting={FadeOutRight}>
                    <TouchableOpacity onPress={handleCancel} style={styles.cancelBtn}>
                        <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
        height: 48,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        paddingHorizontal: 12,
        overflow: 'hidden',
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 14,
        fontFamily: FONTS.medium,
        height: '100%',
        padding: 0,
    },
    cancelBtn: {
        marginLeft: 12,
    },
    cancelText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
    }
});

export default SearchBar;
