import {
    GET_CONVERSATIONS_REQUEST,
    GET_CONVERSATIONS_SUCCESS,
    GET_CONVERSATIONS_FAILURE,
    GET_MESSAGES_REQUEST,
    GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAILURE,
    RECEIVE_MESSAGE,
    SET_ACTIVE_CONVERSATION,
    RESET_UNREAD_COUNT
} from './ActionType';

const initialState = {
    conversations: [],
    messages: [],
    activeConversation: null,
    loading: false,
    error: null,
    unreadCount: 0,
};

const chatReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_CONVERSATIONS_REQUEST:
        case GET_MESSAGES_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_CONVERSATIONS_FAILURE:
        case GET_MESSAGES_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case GET_CONVERSATIONS_SUCCESS:
            return { ...state, loading: false, conversations: action.payload };

        case GET_MESSAGES_SUCCESS:
            return { ...state, loading: false, messages: action.payload };

        case SET_ACTIVE_CONVERSATION:
            return {
                ...state,
                activeConversation: action.payload,
                messages: [],
            };

        case RECEIVE_MESSAGE:
            const newMessage = action.payload;

            let updatedConversations = state.conversations.map(conv => {
                if (String(conv.id) === String(newMessage.conversation.id)) {
                    return { ...conv, lastMessageAt: newMessage.timestamp };
                }
                return conv;
            });

            updatedConversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

            const currentConvId = state.activeConversation?.id;
            const messageConvId = newMessage.conversation?.id;

            const isCurrentConversation = currentConvId && messageConvId && (String(currentConvId) === String(messageConvId));

            const updatedMessages = isCurrentConversation
                ? [...state.messages, newMessage]
                : state.messages;

            const newUnreadCount = isCurrentConversation ? state.unreadCount : state.unreadCount + 1;

            return {
                ...state,
                conversations: updatedConversations,
                messages: updatedMessages,
                unreadCount: newUnreadCount
            };

        case RESET_UNREAD_COUNT:
            return {
                ...state,
                unreadCount: 0
            };

        default:
            return state;
    }
};

export default chatReducer;