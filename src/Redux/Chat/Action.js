import api from '../../Config/api';
import stompService from '../../Config/stompClient';
import {
    GET_CONVERSATIONS_REQUEST,
    GET_CONVERSATIONS_SUCCESS,
    GET_CONVERSATIONS_FAILURE,
    GET_MESSAGES_REQUEST,
   
export const getMessages = (conversationId) => async (dispatch) => {
    dispatch({ type: GET_MESSAGES_REQUEST });
    try {
        const { data } = await api.get(`/api/conversations/${conversationId}/messages`);
        dispatch({ type: GET_MESSAGES_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_MESSAGES_FAILURE, payload: error.message });
    }
};

export const sendMessage = (messageDTO) => async (dispatch) => {
    try {
        stompService.sendMessage("/app/chat.sendMessage", messageDTO);
    } catch (error) {
        console.error(error);
    }
};

export const receiveMessage = (message) => ({
    type: RECEIVE_MESSAGE,
    payload: message,
});

export const setActiveConversation = (conversation) => ({
    type: SET_ACTIVE_CONVERSATION,
    payload: conversation,
});
 GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAILURE,
    RECEIVE_MESSAGE,
    SET_ACTIVE_CONVERSATION,
    RESET_UNREAD_COUNT
} from './ActionType';

export const getConversations = () => async (dispatch) => {
    dispatch({ type: GET_CONVERSATIONS_REQUEST });
    try {
        const { data } = await api.get('/api/conversations/');
        dispatch({ type: GET_CONVERSATIONS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_CONVERSATIONS_FAILURE, payload: error.message });
    }
};


export const resetUnreadCount = () => ({
    type: RESET_UNREAD_COUNT,
}); GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAILURE,
    RECEIVE_MESSAGE,
    SET_ACTIVE_CONVERSATION,
    RESET_UNREAD_COUNT
} from './ActionType';

export const getConversations = () => async (dispatch) => {
    dispatch({ type: GET_CONVERSATIONS_REQUEST });
    try {
        const { data } = await api.get('/api/conversations/');
        dispatch({ type: GET_CONVERSATIONS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_CONVERSATIONS_FAILURE, payload: error.message });
    }
};

 GET_MESSAGES_SUCCESS,
    GET_MESSAGES_FAILURE,
    RECEIVE_MESSAGE,
    SET_ACTIVE_CONVERSATION,
    RESET_UNREAD_COUNT
} from './ActionType';

export const getConversations = () => async (dispatch) => {
    dispatch({ type: GET_CONVERSATIONS_REQUEST });
    try {
        const { data } = await api.get('/api/conversations/');
        dispatch({ type: GET_CONVERSATIONS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_CONVERSATIONS_FAILURE, payload: error.message });
    }
};
