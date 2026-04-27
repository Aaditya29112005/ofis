import { useState, useEffect, useCallback } from 'react';
import postApi from '../services/postApi';
import Haptics from '../utils/Haptics';

export const usePosts = (initialFilter = 'Event') => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState(initialFilter);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPosts = async (isRefresh = false) => {
        const pageToFetch = isRefresh ? 1 : page;
        if (loading && !isRefresh) return;

        setLoading(true);
        try {
            const response = await postApi.getPosts({ 
                page: pageToFetch, 
                type: filter === 'All' ? null : filter,
                search: searchQuery
            });
            if (response.success) {
                setPosts(prev => isRefresh ? response.data : [...prev, ...response.data]);
                setPage(pageToFetch + 1);
            }
        } catch (error) {
            console.error('Fetch posts error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    useEffect(() => {
        fetchPosts(true);
    }, [filter, searchQuery]);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchPosts(true);
    };

    const handleLoadMore = () => {
        fetchPosts();
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const addPostLocally = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    return {
        posts,
        loading,
        refreshing,
        handleRefresh,
        handleLoadMore,
        handleFilterChange,
        handleSearch,
        filter,
        addPostLocally
    };
};
