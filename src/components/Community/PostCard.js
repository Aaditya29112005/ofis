import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withSequence,
    withTiming,
    FadeIn
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';
import GlassCard from '../GlassCard';
import Haptics from '../../utils/Haptics';
import Skeleton from '../Skeleton';
import FullscreenImageModal from './FullscreenImageModal';

const { width } = Dimensions.get('window');

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const PostCard = ({ post, onLike, onComment, onShare, onMore, index, isLoading }) => {
    const { colors, isDark } = useTheme();
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post?.likes || 0);
    const [showFullContent, setShowFullContent] = useState(false);
    const [isImageModalVisible, setIsImageModalVisible] = useState(false);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const likeScale = useSharedValue(1);
    const cardScale = useSharedValue(1);
    const imageScale = useSharedValue(1);

    const animatedLikeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: likeScale.value }]
    }));

    const animatedCardStyle = useAnimatedStyle(() => ({
        transform: [{ scale: cardScale.value }]
    }));

    const animatedImageStyle = useAnimatedStyle(() => ({
        transform: [{ scale: imageScale.value }]
    }));

    const handleLike = () => {
        Haptics.impactLight();
        likeScale.value = withSequence(
            withSpring(1.4),
            withSpring(1)
        );
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        if (onLike) onLike(post.id);
    };

    if (isLoading) {
        return (
            <GlassCard style={styles.card}>
                <View style={styles.header}>
                    <Skeleton width={44} height={44} borderRadius={22} />
                    <View style={styles.headerInfo}>
                        <Skeleton width={120} height={16} borderRadius={4} />
                        <Skeleton width={80} height={12} borderRadius={4} style={{ marginTop: 6 }} />
                    </View>
                </View>
                <Skeleton width="100%" height={20} borderRadius={4} style={{ marginBottom: 8 }} />
                <Skeleton width="80%" height={20} borderRadius={4} style={{ marginBottom: 16 }} />
                <Skeleton width="100%" height={200} borderRadius={18} />
            </GlassCard>
        );
    }

    return (
        <Animated.View style={[styles.container, animatedCardStyle]}>
            <GlassCard style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={[styles.avatar, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                        {post.user.avatar ? (
                            <Image source={{ uri: post.user.avatar }} style={styles.avatarImage} />
                        ) : (
                            <Text style={[styles.avatarLabel, { color: colors.text }]}>
                                {post.user.name[0]}
                            </Text>
                        )}
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={[styles.userName, { color: colors.text }]}>{post.user.name}</Text>
                        <Text style={[styles.roleText, { color: colors.textSecondary }]}>
                            {post.user.role} • {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => { Haptics.selection(); onMore && onMore(post); }} style={styles.moreBtn}>
                        <Icon name="ellipsis-horizontal" size={20} color={colors.textMuted} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    <Text 
                        style={[styles.content, { color: colors.text }]} 
                        numberOfLines={showFullContent ? 0 : 3}
                    >
                        {post.content.split(' ').map((word, i) => {
                            if (word.startsWith('#')) {
                                return (
                                    <Text 
                                        key={i} 
                                        style={styles.hashtag} 
                                        onPress={() => {
                                            Haptics.impactLight();
                                            // Handle hashtag tap
                                        }}
                                    >
                                        {word}{' '}
                                    </Text>
                                );
                            }
                            return word + ' ';
                        })}
                    </Text>
                </View>
                {post.content.length > 120 && (
                    <TouchableOpacity onPress={() => setShowFullContent(!showFullContent)} style={styles.readMoreBtn}>
                        <Text style={styles.readMoreText}>{showFullContent ? 'Show Less' : 'Read More'}</Text>
                    </TouchableOpacity>
                )}

                {/* Media */}
                {post.image && (
                    <TouchableOpacity 
                        activeOpacity={1} 
                        onPressIn={() => { imageScale.value = withSpring(1.05); }}
                        onPressOut={() => { imageScale.value = withSpring(1); }}
                        onPress={() => {
                            Haptics.impactLight();
                            setIsImageModalVisible(true);
                        }}
                        style={styles.imageContainer}
                    >
                        <View style={styles.imageWrapper}>
                            <Animated.Image 
                                source={{ uri: post.image }} 
                                style={[styles.image, animatedImageStyle]} 
                                onLoad={() => setIsImageLoading(false)}
                            />
                            {isImageLoading && (
                                <View style={styles.shimmerOverlay}>
                                    <Skeleton width="100%" height={240} borderRadius={16} />
                                </View>
                            )}
                        </View>
                        <View style={styles.tagBadge}>
                            <Text style={styles.tagText}>#{post.type}</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {/* Action Bar */}
                <View style={[styles.footer, { borderTopColor: colors.border }]}>
                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
                            <AnimatedIcon 
                                name={isLiked ? "heart" : "heart-outline"} 
                                size={22} 
                                color={isLiked ? "#FF3B30" : colors.textSecondary} 
                                style={animatedLikeStyle}
                            />
                            <Text style={[styles.actionText, { color: colors.textSecondary }]}>{likesCount}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn} onPress={() => { Haptics.impactLight(); onComment && onComment(post); }}>
                            <Icon name="chatbubble-outline" size={20} color={colors.textSecondary} />
                            <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.comments}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionBtn} onPress={() => { Haptics.selection(); onShare && onShare(post); }}>
                            <Icon name="share-social-outline" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.viewCount}>
                        <Icon name="eye-outline" size={14} color={colors.textMuted} />
                        <Text style={[styles.viewText, { color: colors.textMuted }]}>{post.viewCount}</Text>
                    </View>
                </View>
            </GlassCard>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    card: {
        padding: 16,
        borderRadius: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    avatarLabel: {
        fontSize: 18,
        fontFamily: FONTS.bold,
    },
    headerInfo: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontFamily: FONTS.bold,
    },
    roleText: {
        fontSize: 12,
        fontFamily: FONTS.medium,
        marginTop: 2,
    },
    moreBtn: {
        padding: 8,
    },
    content: {
        fontSize: 15,
        fontFamily: FONTS.regular,
        lineHeight: 22,
    },
    hashtag: {
        color: '#FF8A00',
        fontFamily: FONTS.bold,
    },
    readMoreBtn: {
        marginTop: 4,
        marginBottom: 16,
    },
    readMoreText: {
        color: '#FF8A00',
        fontFamily: FONTS.bold,
        fontSize: 13,
    },
    imageContainer: {
        width: '100%',
        height: 240,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    imageWrapper: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    shimmerOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    tagBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: 'rgba(255, 138, 0, 0.9)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    tagText: {
        color: '#FFF',
        fontSize: 10,
        fontFamily: FONTS.bold,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 14,
        borderTopWidth: 1,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
    },
    viewCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewText: {
        fontSize: 11,
        fontFamily: FONTS.medium,
    }
});

export default PostCard;
