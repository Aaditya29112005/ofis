import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    RefreshControl, 
    ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import { FONTS } from '../theme/typography';
import DashboardLayout from '../components/DashboardLayout';
import FilterTabs from '../components/Community/FilterTabs';
import PostCard from '../components/Community/PostCard';
import FloatingButton from '../components/Community/FloatingButton';
import CreatePostModal from '../components/Community/CreatePostModal';
import CommentModal from '../components/Community/CommentModal';
import SearchBar from '../components/Community/SearchBar';
import { usePosts } from '../hooks/usePosts';
import Haptics from '../utils/Haptics';

const CommunityScreen = ({ navigation }) => {
    const { colors, isDark } = useTheme();
    const { 
        posts, 
        refreshing, 
        handleRefresh, 
        handleLoadMore, 
        handleFilterChange, 
        handleSearch,
        filter,
        addPostLocally
    } = usePosts();

    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [selectedPostForComments, setSelectedPostForComments] = useState(null);
    const [screenLoading, setScreenLoading] = useState(true);

    const tabs = ['Event', 'Announcement', 'General'];

    // Initial load simulation
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setScreenLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const onTabChange = (tab) => {
        handleFilterChange(tab);
        setScreenLoading(true);

        const timer = setTimeout(() => {
            setScreenLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.titleSection}>
                <Text style={[styles.title, { color: colors.text }]}>Community</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Connect with the Ofis Square community</Text>
            </View>

            <SearchBar onSearch={handleSearch} />

            <View style={[styles.inputBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: colors.border }]}>
                <View style={styles.avatarMini}>
                    <Text style={styles.avatarMiniText}>N</Text>
                </View>
                <TouchableOpacity 
                    style={styles.inputDummy} 
                    onPress={() => { Haptics.impactLight(); setCreateModalVisible(true); }}
                >
                    <Text style={[styles.inputDummyText, { color: colors.textMuted }]}>Share something with the wall...</Text>
                </TouchableOpacity>
            </View>

            <FilterTabs 
                tabs={tabs} 
                activeTab={filter} 
                onTabChange={onTabChange} 
            />
        </View>
    );

    const renderFooter = () => {
        if (screenLoading || posts.length === 0) return <View style={{ height: 100 }} />;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator color="#FF8A00" />
            </View>
        );
    };

    return (
        <DashboardLayout 
            activeTab="Community" 
            onTabPress={(id) => {
                Haptics.selection();
                navigation.navigate(id);
            }}
        >
            <FlatList
                data={screenLoading ? [1, 2, 3] : posts}
                keyExtractor={(item, index) => screenLoading ? `skeleton-${index}` : (item.id || `post-${index}`)}
                renderItem={({ item, index }) => {
                    if (screenLoading) {
                        return <PostCard isLoading index={index} />;
                    }
                    return (
                        <Animated.View entering={FadeInUp.delay(index * 100).duration(400).springify()}>
                            <PostCard 
                                post={item} 
                                onComment={(post) => setSelectedPostForComments(post)}
                                onShare={(post) => Haptics.success()}
                            />
                        </Animated.View>
                    );
                }}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
                refreshControl={
                    <RefreshControl 
                        refreshing={refreshing} 
                        onRefresh={handleRefresh} 
                        tintColor="#FF8A00"
                        colors={["#FF8A00"]}
                    />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
            />

            <FloatingButton onPress={() => setCreateModalVisible(true)} />

            <CreatePostModal 
                visible={isCreateModalVisible} 
                onClose={() => setCreateModalVisible(false)}
                onPostCreated={addPostLocally}
            />

            <CommentModal 
                visible={!!selectedPostForComments}
                post={selectedPostForComments}
                onClose={() => setSelectedPostForComments(null)}
            />
        </DashboardLayout>
    );
};

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 140,
    },
    scrollArea: {
        paddingTop: 16,
        paddingBottom: 140,
    },
    headerContainer: {
        paddingTop: 20,
    },
    titleSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontFamily: FONTS.bold,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: FONTS.medium,
        marginTop: 4,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        padding: 12,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 20,
    },
    avatarMini: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FF8A00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarMiniText: {
        color: '#FFF',
        fontFamily: FONTS.bold,
        fontSize: 14,
    },
    inputDummy: {
        flex: 1,
        marginLeft: 12,
    },
    inputDummyText: {
        fontSize: 14,
        fontFamily: FONTS.medium,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
    }
});

export default CommunityScreen;
