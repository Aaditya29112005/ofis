import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';
import Icon from 'react-native-vector-icons/Ionicons';

const SocialHeader = ({ communityName = "Ofis Square" }) => {
    console.log('--- FLAGSHIP SOCIAL HEADER LOADED ---');
    const { colors } = useTheme();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={[styles.pill, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                    <Text style={[styles.pillText, { color: colors.text }]}>{formatDate(currentTime)}</Text>
                </View>
                <View style={styles.weatherContainer}>
                    <Icon name="cloud-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.weatherText, { color: colors.textSecondary }]}>22°C</Text>
                </View>
            </View>
            <View style={styles.bottomRow}>
                <Text style={[styles.communityName, { color: colors.textMuted }]}>{communityName}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
    },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    pillText: {
        fontSize: 12,
        fontFamily: FONTS.bold,
    },
    weatherContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    weatherText: {
        fontSize: 13,
        fontFamily: FONTS.bold,
    },
    bottomRow: {
        marginTop: 6,
    },
    communityName: {
        fontSize: 12,
        fontFamily: FONTS.bold,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    }
});

export default SocialHeader;
