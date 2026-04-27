import api from './api';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const mockPosts = [
    {
        id: '1',
        user: { name: 'Nasir Ansari', avatar: null, role: 'Business Owner' },
        content: 'Excited to move into our new premium office at Ofis Square Sohna Road! The hospitality here is truly top-notch. #Community #NewBeginnings',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        tags: ['Community', 'NewBeginnings'],
        likes: 24,
        comments: 12,
        viewCount: 156,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        type: 'General'
    },
    {
        id: '2',
        user: { name: 'Priya Sharma', avatar: null, role: 'Tech Lead' },
        content: "Just hosted our first workshop in the Boardroom Suite. The AV setup worked flawlessly! Highly recommend it for important meetups. #Event #Tech",
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
        tags: ['Event', 'Tech'],
        likes: 18,
        comments: 5,
        viewCount: 89,
        createdAt: new Date(Date.now() - 18000000).toISOString(),
        type: 'Event'
    },
    {
        id: '3',
        user: { name: 'Ofis Square', avatar: null, role: 'Admin' },
        content: "Reminder: Networking mixer tomorrow at 6 PM in the Rooftop Lounge! Don't miss out. #Announcement #Networking",
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        tags: ['Announcement', 'Networking'],
        likes: 45,
        comments: 8,
        viewCount: 320,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        type: 'Announcement'
    }
];

const postApi = {
    getPosts: async ({ page = 1, limit = 10, type = null, search = '' } = {}) => {
        await delay(800);
        let filtered = [...mockPosts];
        
        if (type && type !== 'All') {
            filtered = filtered.filter(p => p.type === type);
        }
        
        if (search) {
            const query = search.toLowerCase();
            filtered = filtered.filter(p => 
                p.content.toLowerCase().includes(query) || 
                p.user.name.toLowerCase().includes(query)
            );
        }
        
        const start = (page - 1) * limit;
        return {
            success: true,
            data: filtered.slice(start, start + limit),
            hasMore: start + limit < filtered.length
        };
    },

    createPost: async (postData) => {
        await delay(1200);
        return { success: true, data: { ...postData, id: Math.random().toString() } };
    },

    likePost: async (id) => {
        await delay(300);
        return { success: true };
    },

    getComments: async (postId) => {
        await delay(600);
        return [
            {
                id: 'c1',
                user: { name: 'Rahul Verma', role: 'Founder' },
                text: 'Great post! The office looks amazing.',
                likes: 2,
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                replies: []
            }
        ];
    },

    addComment: async (postId, comment) => {
        await delay(800);
        return { success: true, data: { ...comment, id: Math.random().toString() } };
    }
};

export default postApi;
