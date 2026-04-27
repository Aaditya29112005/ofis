import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_WIDTH = SCREEN_WIDTH * 0.6;
const LOGO_HEIGHT = LOGO_WIDTH * 0.5;

const OfisLogo = ({ scale = 1 }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { width: LOGO_WIDTH * scale, height: LOGO_HEIGHT * scale }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // Width and height controlled via props
  }
});

export default OfisLogo;
