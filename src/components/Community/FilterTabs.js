import React from 'react';
import { 
    TouchableOpacity, 
    Text, 
    StyleSheet, 
    View, 
    useWindowDimensions 
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring,
    withTiming
} from 'react-native-reanimated';
import { useTheme } from '../../context/ThemeContext';
import { FONTS } from '../../theme/typography';
import Haptics from '../../utils/Haptics';

const FilterTabs = ({ tabs, activeTab, onTabChange }) => {
    const { colors, isDark } = useTheme();
    const { width: screenWidth } = useWindowDimensions();
    
    // Tab width is screenWidth minus horizontal padding (40) divided by number of tabs
    const containerPadding = 40;
    const tabWidth = (screenWidth - containerPadding) / tabs.length;
    
    const activeIndex = tabs.indexOf(activeTab);
    const indicatorX = useSharedValue(activeIndex * tabWidth);

    React.useEffect(() => {
        indicatorX.value = withSpring(activeIndex * tabWidth, {
            damping: 20,
            stiffness: 150,
            mass: 1
        });
    }, [activeIndex, tabWidth]);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorX.value }],
        width: tabWidth,
    }));

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Animated.View style={[
                    styles.indicator, 
                    { backgroundColor: colors.primary || '#FF7A00' },
                    animatedIndicatorStyle
                ]} />
                
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={0.7}
                            onPress={() => {
                                Haptics.selection();
                                onTabChange(tab);
                            }}
                            style={styles.tab}
                        >
                            <Animated.Text
                                style={[
                                    styles.tabText,
                                    { 
                                        color: isActive ? (colors.primary || '#FF7A00') : colors.textMuted,
                                        fontWeight: isActive ? '700' : '500'
                                    }
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                                minimumFontScale={0.6}
                            >
                                {tab}
                            </Animated.Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 16,
        marginTop: 8,
        paddingHorizontal: 20,
    },
    container: {
        flexDirection: 'row',
        height: 48,
        alignItems: 'center',
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    indicator: {
        position: 'absolute',
        height: 3,
        bottom: -1,
        borderRadius: 3,
        zIndex: 1,
    },
    tab: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabText: {
        fontSize: 11,
        fontFamily: FONTS.bold,
        textAlign: 'center',
        paddingHorizontal: 2,
    }
});

export default FilterTabs;
