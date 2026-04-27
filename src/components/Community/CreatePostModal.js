import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform,
    Image,
    ScrollView
} from 'react-native';
import Animated, { 
    FadeIn, 
    SlideInDown, 
    SlideOutDown, 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring 
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';
import Haptics from '../../utils/Haptics';
import postApi from '../../services/postApi';

const CreatePostModal = ({ visible, onClose, onPostCreated }) => {
    const { colors, isDark } = useTheme();
    const [text, setText] = useState('');
    const [isPosting, setIsPosting] = useState(false);
    const [selectedTags, setSelectedTags] = useState(['General']);
    const [selectedImage, setSelectedImage] = useState(null);
    const charLimit = 280;

    const inputHeight = useSharedValue(120);
    const pulseScale = useSharedValue(1);

    const animatedInputStyle = useAnimatedStyle(() => ({
        height: withSpring(inputHeight.value, { damping: 15 }),
    }));

    const animatedPulseStyle = useAnimatedStyle(() => ({
        transform: [{ scale: pulseScale.value }]
    }));

    const handlePickImage = () => {
        Haptics.impactLight();
        // Simulating image selection
        setSelectedImage('https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=400&q=80');
        inputHeight.value = 80; // Shrink input when image is added
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        inputHeight.value = 120;
    };

    const tags = ['General', 'Events', 'Announcements', 'Help', 'Marketplace'];

    const handlePost = async () => {
        if (!text.trim() || isPosting) return;
        
        setIsPosting(true);
        Haptics.impactMedium();
        
        try {
            const newPost = {
                user: { name: 'Nasir Ansari', role: 'Business Owner' }, // Simulated user
                content: text,
                tags: selectedTags,
                type: selectedTags[0] || 'General',
                createdAt: new Date().toISOString(),
                likes: 0,
                comments: 0,
                viewCount: 0
            };
            
            const response = await postApi.createPost(newPost);
            if (response.success) {
                onPostCreated(response.data);
                setText('');
                onClose();
            }
        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsPosting(false);
        }
    };

    const toggleTag = (tag) => {
        Haptics.selection();
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <Animated.View 
                        entering={SlideInDown.springify().damping(15)}
                        exiting={SlideOutDown}
                        style={[styles.modalContent, { backgroundColor: colors.surface }]}
                    >
                        {/* Header */}
                        <View style={[styles.header, { borderBottomColor: colors.border }]}>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Icon name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.title, { color: colors.text }]}>Create Post</Text>
                            <TouchableOpacity 
                                onPress={handlePost} 
                                disabled={!text.trim() || isPosting}
                                style={[
                                    styles.postBtn, 
                                    { backgroundColor: text.trim() ? colors.primary : colors.primaryMuted }
                                ]}
                            >
                                <Text style={styles.postBtnText}>{isPosting ? 'Posting...' : 'Post'}</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView bounces={false}>
                            {/* User Info */}
                            <View style={styles.userInfo}>
                                <View style={styles.avatarMini}>
                                    <Text style={styles.avatarMiniLabel}>N</Text>
                                </View>
                                <View style={styles.userMeta}>
                                    <Text style={[styles.userName, { color: colors.text }]}>Nasir Ansari</Text>
                                    <Text style={[styles.userRole, { color: colors.textSecondary }]}>Business Owner</Text>
                                </View>
                            </View>

                            {/* Input */}
                            <Animated.View style={animatedInputStyle}>
                                <TextInput
                                    multiline
                                    placeholder="Share something with the wall..."
                                    placeholderTextColor={colors.textMuted}
                                    style={[styles.input, { color: colors.text }]}
                                    value={text}
                                    onChangeText={setText}
                                    maxLength={charLimit}
                                    autoFocus
                                />
                            </Animated.View>

                            {/* Image Preview */}
                            {selectedImage && (
                                <Animated.View entering={FadeIn} style={styles.previewContainer}>
                                    <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                                    <TouchableOpacity 
                                        style={styles.removeImageBtn} 
                                        onPress={handleRemoveImage}
                                    >
                                        <Icon name="close-circle" size={24} color="#FFF" />
                                    </TouchableOpacity>
                                </Animated.View>
                            )}

                            {/* Tags Selection */}
                            <View style={styles.tagsSection}>
                                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Add Tags</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagContainer}>
                                    {tags.map(tag => (
                                        <TouchableOpacity 
                                            key={tag}
                                            onPress={() => toggleTag(tag)}
                                            style={[
                                                styles.tagPill, 
                                                { 
                                                    backgroundColor: selectedTags.includes(tag) ? '#FF8A00' : 'rgba(255,255,255,0.05)',
                                                    borderColor: selectedTags.includes(tag) ? '#FF8A00' : colors.border
                                                }
                                            ]}
                                        >
                                            <Text style={[
                                                styles.tagText, 
                                                { color: selectedTags.includes(tag) ? '#FFF' : colors.textMuted }
                                            ]}>#{tag}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Footer Actions */}
                            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                                <View style={styles.counterContainer}>
                                    <Text style={[
                                        styles.counterText, 
                                        { color: text.length > charLimit * 0.9 ? '#FF3B30' : colors.textMuted }
                                    ]}>
                                        {text.length}/{charLimit}
                                    </Text>
                                </View>
                                <View style={styles.actionIcons}>
                                    <TouchableOpacity 
                                        style={styles.actionIconBtn} 
                                        onPress={handlePickImage}
                                    >
                                        <Animated.View style={animatedPulseStyle}>
                                            <Icon name="image-outline" size={24} color="#FF8A00" />
                                        </Animated.View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionIconBtn} onPress={() => Haptics.selection()}>
                                        <Icon name="videocam-outline" size={24} color="#FF8A00" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.actionIconBtn} onPress={() => Haptics.selection()}>
                                        <Icon name="happy-outline" size={24} color="#FF8A00" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '92%',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    closeBtn: {
        padding: 4,
    },
    title: {
        fontSize: 17,
        fontFamily: FONTS.bold,
    },
    postBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postBtnText: {
        color: '#FFF',
        fontFamily: FONTS.bold,
        fontSize: 14,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    avatarMini: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FF8A00',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarMiniLabel: {
        color: '#FFF',
        fontFamily: FONTS.bold,
        fontSize: 18,
    },
    userMeta: {
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    userRole: {
        fontSize: 13,
        fontFamily: FONTS.medium,
        marginTop: 2,
    },
    input: {
        fontSize: 18,
        fontFamily: FONTS.regular,
        paddingHorizontal: 20,
        textAlignVertical: 'top',
    },
    previewContainer: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 16,
        overflow: 'hidden',
        height: 180,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
    },
    tagsSection: {
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: FONTS.bold,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    tagContainer: {
        paddingHorizontal: 20,
        gap: 10,
    },
    tagPill: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    tagText: {
        fontSize: 13,
        fontFamily: FONTS.bold,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 30,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
    },
    counterContainer: {
        flex: 1,
    },
    counterText: {
        fontSize: 13,
        fontFamily: FONTS.medium,
    },
    actionIcons: {
        flexDirection: 'row',
        gap: 20,
    },
    actionIconBtn: {
        padding: 4,
    }
});

export default CreatePostModal;
