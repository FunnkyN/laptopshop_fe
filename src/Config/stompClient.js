import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from './api';

class StompService {
    constructor() {
        this.stompClient = null;
        this.subscriptions = new Map();
        this.currentToken = null;
    }

    connect(token, onConnectedCallback, onErrorCallback) {
        if (this.stompClient && this.stompClient.connected && this.currentToken === token) {
            console.log('STOMP: Đã kết nối ổn định.');
            if (onConnectedCallback) onConnectedCallback();
            return;
        }

        if (this.stompClient) {
            this.disconnect();
        }

        this.currentToken = token;
        const sockJsUrl = `${API_BASE_URL}/ws`;
        const socket = new SockJS(sockJsUrl);

        this.stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            debug: (str) => {
                if (!str.includes("PING") && !str.includes("PONG")) {
                    console.log('STOMP Debug: ' + str);
                }
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
        });

        this.stompClient.onConnect = (frame) => {
            console.log('STOMP: Kết nối thành công!');
            if (onConnectedCallback) {
                onConnectedCallback(frame);
            }
        };

        this.stompClient.onStompError = (frame) => {
            console.error('STOMP: Lỗi Broker:', frame.headers['message']);
            if (onErrorCallback) onErrorCallback(frame);
        };

        this.stompClient.onWebSocketError = (error) => {
             console.error('STOMP: Lỗi WebSocket (Mất kết nối):', error);
             if (onErrorCallback) onErrorCallback(error);
        };

        this.stompClient.activate();
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;
            this.subscriptions.clear();
            this.currentToken = null;
            console.log('STOMP: Đã ngắt kết nối.');
        }
    }

    subscribe(destination, callback) {
        if (!this.stompClient || !this.stompClient.connected) {
            return;
        }

        if (this.subscriptions.has(destination)) {
            this.subscriptions.get(destination).unsubscribe();
            this.subscriptions.delete(destination);
        }

        const subscription = this.stompClient.subscribe(destination, (message) => {
            try {
                if (message.body) {
                    const parsedMessage = JSON.parse(message.body);
                    console.log(`STOMP: Nhận tin nhắn [${destination}]:`, parsedMessage);
                    callback(parsedMessage);
                } else {
                    console.warn(`STOMP: Nhận tin nhắn rỗng từ ${destination}`);
                }
            } catch (e) {
                console.error("STOMP: Lỗi xử lý tin nhắn:", e, message);
            }
        });

        this.subscriptions.set(destination, subscription);
        console.log(`STOMP: Đã đăng ký kênh ${destination}`);
    }

    sendMessage(destination, bodyObject) {
        if (!this.stompClient || !this.stompClient.connected) {
            console.error('STOMP: Chưa kết nối, không thể gửi tin.');
            return;
        }

        try {
            const jsonBody = JSON.stringify(bodyObject);
            this.stompClient.publish({
                destination: destination,
                body: jsonBody,
            });
            console.log(`STOMP: Đã gửi tin đến ${destination}`, bodyObject);
        } catch (e) {
            console.error("STOMP: Lỗi khi gửi tin nhắn:", e);
        }
    }
}

const stompService = new StompService();
export default stompService;