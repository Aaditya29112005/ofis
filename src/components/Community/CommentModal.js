import React, { useState, useEffect } from 'react';
import { 
    Modal, 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import Animated, { 
    SlideInDown, 
    SlideOutDown, 
    useSharedValue, 
    useAnimatedStyle, 
    withSpring, 
    withTiming,
    runOnJS,
    interpolate,
    Extrapolate,
    FadeIn
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';
import Haptics from '../../utils/Haptics';

const CommentItem = ({ comment, isReply = false, onReply }) => {
    const { colors, isDark } = useTheme();
    const [isLiked, setIsLiked] = useState(false);

    return (
        <Animated.View 
            entering={FadeIn.duration(400)}
            style={[styles.commentContainer, isReply && styles.replyContainer]}
        >
            <View style={styles.commentHeader}>
                <View style={[styles.avatarMini, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <Text style={[styles.avatarText, { color: colors.text }]}>{comment.user.name[0]}</Text>
                </View>
                <View style={styles.commentContent}>
                    <View style={styles.commentMeta}>
                        <Text style={[styles.commentUserName, { color: colors.text }]}>{comment.user.name}</Text>
                        <Text style={[styles.commentTime, { color: colors.textMuted }]}>
                            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                    <Text style={[styles.commentText, { color: colors.textSecondary }]}>{comment.text}</Text>
                    
                    <View style={styles.commentActions}>
                        <TouchableOpacity 
                            style={styles.actionBtn} 
                            onPress={() => { setIsLiked(!isLiked); Haptics.impactLight(); }}
                        >
                            <Icon name={isLiked ? "heart" : "heart-outline"} size={14} color={isLiked ? "#FF3B30" : colors.textMuted} />
                            <Text style={[styles.actionText, { color: isLiked ? "#FF3B30" : colors.textMuted }]}>{comment.likes + (isLiked ? 1 : 0)}</Text>
                        </TouchableOpacity>
                        
                        {!isReply && (
                            <TouchableOpacity style={styles.actionBtn} onPress={() => onReply(comment)}>
                                <Text style={[styles.actionText, { color: colors.textMuted }]}>Reply</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {comment.replies && comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} isReply onReply={onReply} />
            ))}
        </Animated.View>
    );
};

// Restore missing imports
import postApi from '../../services/postApi';
import Skeleton from '../Skeleton';

const CommentModal = ({ visible, post, onClose }) => {
    const { colors, isDark } = useTheme();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);

    const translateY = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: Math.max(0, translateY.value) }],
    }));

    const onGestureEvent = (event) => {
        translateY.value = event.nativeEvent.translationY;
    };

    const onHandlerStateChange = (event) => {
        if (event.nativeEvent.state === 5) { // END
            if (event.nativeEvent.translationY > 100) {
                runOnJS(onClose)();
            } else {
                translateY.value = withSpring(0);
            }
        }
    };

    useEffect(() => {
        if (visible) translateY.value = 0;
    }, [visible]);

    useEffect(() => {
        if (visible && post) {
            loadComments();
        }
    }, [visible, post]);

    const loadComments = async () => {
        setLoading(true);
        try {
            const data = await postApi.getComments(post.id);
            setComments(data);
        } catch (error) {
            console.error('Error loading comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!commentText.trim()) return;
        
        Haptics.impactMedium();
        const newComment = {
            user: { name: 'Nasir Ansari', role: 'Business Owner' },
            text: commentText,
            likes: 0,
            createdAt: new Date().toISOString(),
        };

        try {
            const response = await postApi.addComment(post.id, newComment);
            if (response.success) {
                setComments(prev => [...prev, response.data]);
                setCommentText('');
                setReplyingTo(null);
            }
        } catch (error) {
            console.error('Error adding comment:', error);
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
            <GestureHandlerRootView style={styles.overlay}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <PanGestureHandler
                        onGestureEvent={onGestureEvent}
                        onHandlerStateChange={onHandlerStateChange}
                    >
                        <Animated.View 
                            entering={SlideInDown.springify().damping(15)}
                            exiting={SlideOutDown}
                            style={[
                                styles.modalContent, 
                                { backgroundColor: colors.surface },
                                animatedStyle
                            ]}
                        >
                            <View style={[styles.handle, { backgroundColor: colors.border }]} />
                        
                        <View style={[styles.header, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.title, { color: colors.text }]}>Comments</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Icon name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={comments}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <CommentItem 
                                    comment={item} 
                                    onReply={(c) => {
                                        setReplyingTo(c);
                                        setCommentText(`@${c.user.name} `);
                                        Haptics.selection();
                                    }} 
                                />
                            )}
                            ListEmptyComponent={() => loading ? (
                                <View style={styles.skeletonContainer}>
                                    <Skeleton width="100%" height={60} borderRadius={12} style={{ marginBottom: 16 }} />
                                    <Skeleton width="100%" height={100} borderRadius={12} style={{ marginBottom: 16 }} />
                                    <Skeleton width="100%" height={60} borderRadius={12} />
                                </View>
                            ) : (
                                <View style={styles.emptyState}>
                                    <Icon name="chatbubbles-outline" size={48} color={colors.textMuted} />
                                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>No comments yet. Be the first to join the conversation!</Text>
                                </View>
                            )}
                            contentContainerStyle={styles.listContent}
                        />

                        {/* Input Area */}
                        <View style={[styles.inputWrapper, { borderTopColor: colors.border, backgroundColor: colors.surface }]}>
                            {replyingTo && (
                                <View style={styles.replyingBar}>
                                    <Text style={[styles.replyingText, { color: colors.textSecondary }]}>
                                        Replying to <Text style={{ fontFamily: FONTS.bold }}>{replyingTo.user.name}</Text>
                                    </Text>
                                    <TouchableOpacity onPress={() => setReplyingTo(null)}>
                                        <Icon name="close-circle" size={16} color={colors.textMuted} />
                                    </TouchableOpacity>
                                </View>
                            )}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    placeholder="Add a comment..."
                                    placeholderTextColor={colors.textMuted}
                                    style={[styles.input, { color: colors.text, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}
                                    value={commentText}
                                    onChangeText={setCommentText}
                                />
                                <TouchableOpacity 
                                    onPress={handleSend}
                                    disabled={!commentText.trim()}
                                    style={[styles.sendBtn, { backgroundColor: commentText.trim() ? '#FF8A00' : 'rgba(255,138,0,0.3)' }]}
                                >
                                    <Icon name="send" size={18} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        </Animated.View>
                    </PanGestureHandler>
                </KeyboardAvoidingView>
            </GestureHandlerRootView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'flex-end',
    },
    container: {
        height: '75%',
    },
    modalContent: {
        flex: 1,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginTop: 12,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 18,
        fontFamily: FONTS.bold,
    },
    closeBtn: {
        padding: 4,
    },
    listContent: {
        padding: 24,
        paddingBottom: 100,
    },
    commentContainer: {
        marginBottom: 24,
    },
    replyContainer: {
        marginLeft: 44,
        marginTop: 16,
        marginBottom: 0,
    },
    commentHeader: {
        flexDirection: 'row',
    },
    avatarMini: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 14,
        fontFamily: FONTS.bold,
    },
    commentContent: {
        flex: 1,
        marginLeft: 12,
    },
    commentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    commentUserName: {
        fontSize: 14,
        fontFamily: FONTS.bold,
    },
    commentTime: {
        fontSize: 11,
        fontFamily: FONTS.medium,
    },
    commentText: {
        fontSize: 14,
        fontFamily: FONTS.regular,
        lineHeight: 20,
    },
    commentActions: {
        flexDirection: 'row',
        marginTop: 8,
        gap: 16,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    actionText: {
        fontSize: 12,
        fontFamily: FONTS.bold,
    },
    skeletonContainer: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        textAlign: 'center',
        marginTop: 16,
        paddingHorizontal: 40,
        lineHeight: 22,
    },
    inputWrapper: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopWidth: 1,
    },
    replyingBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: 'rgba(255,138,0,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    replyingText: {
        fontSize: 12,
        fontFamily: FONTS.medium,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        height: 44,
        borderRadius: 22,
        paddingHorizontal: 16,
        fontSize: 14,
        fontFamily: FONTS.medium,
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default CommentModal;
