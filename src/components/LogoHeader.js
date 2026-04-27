import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LogoHeader = ({ width = 180, height = 90 }) => {
    return (
        <View style={styles.container}>
            <Image 
                source={require('../assets/images/logo.png')}
                style={[styles.logo, { width, height, maxWidth: '100%' }]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        marginTop: 40,
    },
    logo: {
        // Dimensions controlled via props or default width/height
    }
});

export default LogoHeader;
