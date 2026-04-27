import React from 'react';
import { 
    Modal, 
    View, 
    Image, 
    StyleSheet, 
    TouchableOpacity, 
    Dimensions 
} from 'react-native';
import Animated, { 
    FadeIn, 
    FadeOut,
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const FullscreenImageModal = ({ visible, imageUrl, onClose }) => {
    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Animated.View 
                entering={FadeIn} 
                exiting={FadeOut}
                style={styles.overlay}
            >
                <TouchableOpacity 
                    style={styles.closeBtn} 
                    onPress={onClose}
                    activeOpacity={0.8}
                >
                    <Icon name="close" size={32} color="#FFF" />
                </TouchableOpacity>

                <Animated.Image 
                    source={{ uri: imageUrl }} 
                    style={styles.image}
                    resizeMode="contain"
                />
            </Animated.View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeBtn: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 5,
    },
    image: {
        width: width,
        height: height * 0.8,
    }
});

export default FullscreenImageModal;
