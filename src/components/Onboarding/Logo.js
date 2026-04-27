import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DEFAULT_LOGO_WIDTH = SCREEN_WIDTH * 0.6;
const DEFAULT_LOGO_HEIGHT = DEFAULT_LOGO_WIDTH * 0.5;

const Logo = ({ width = DEFAULT_LOGO_WIDTH, height = DEFAULT_LOGO_HEIGHT, style }) => {
    return (
        <Animated.View 
            entering={FadeIn.duration(1200)} 
            style={[styles.container, style]}
        >
            <Image 
                source={require('../../assets/images/logo.png')}
                style={{
                    width: width,
                    height: height,
                    maxWidth: '100%',
                    resizeMode: 'contain'
                }}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Logo;
