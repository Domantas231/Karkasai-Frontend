import * as signalR from '@microsoft/signalr';
import config from './config';
import appState from './appState';

/**
 * Notification types received from SignalR
 */
export interface PostNotification {
    postId: number;
    groupId: number;
    groupTitle: string;
    postTitle: string;
    authorName: string;
    createdAt: string;
}

export interface PostDeletedNotification {
    groupId: number;
    postId: number;
}

export interface PostUpdatedNotification {
    groupId: number;
    post: {
        id: number;
        title: string;
        dateCreated: string;
        imageUrl: string;
        user: { userName: string };
    };
}

export interface CommentNotification {
    groupId: number;
    postId: number;
    comment: {
        id: number;
        content: string;
        dateCreated: string;
        imageUrl: string;
        user: { userName: string };
    };
}

/**
 * Callback types for notification handlers
 */
type NewPostHandler = (notification: PostNotification) => void;
type PostDeletedHandler = (notification: PostDeletedNotification) => void;
type PostUpdatedHandler = (notification: PostUpdatedNotification) => void;
type NewCommentHandler = (notification: CommentNotification) => void;
type ConnectionStateHandler = (isConnected: boolean) => void;

/**
 * SignalR connection manager for real-time notifications
 */
class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private isConnecting: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private joinedGroups: Set<number> = new Set();

    // Event handlers
    private onNewPostHandlers: NewPostHandler[] = [];
    private onPostDeletedHandlers: PostDeletedHandler[] = [];
    private onPostUpdatedHandlers: PostUpdatedHandler[] = [];
    private onNewCommentHandlers: NewCommentHandler[] = [];
    private onConnectionStateHandlers: ConnectionStateHandler[] = [];

    /**
     * Get the SignalR hub URL
     */
    private getHubUrl(): string {
        // Convert API URL to hub URL
        // e.g., "http://localhost:5000/api/" -> "http://localhost:5000/hubs/notifications"
        const baseUrl = config.backendUrl.replace('/api/', '');
        return `${baseUrl}/hubs/notifications`;
    }

    /**
     * Notify all connection state handlers
     */
    private notifyConnectionState(isConnected: boolean): void {
        this.onConnectionStateHandlers.forEach(handler => handler(isConnected));
    }

    /**
     * Start the SignalR connection
     */
    async start(): Promise<void> {
        // Don't connect if not logged in
        if (!appState.authJwt) {
            console.log('SignalR: Not connecting - user not logged in');
            return;
        }

        // Don't start if already connected or connecting
        if (this.connection?.state === signalR.HubConnectionState.Connected) {
            console.log('SignalR: Already connected');
            return;
        }

        if (this.isConnecting) {
            console.log('SignalR: Connection already in progress');
            return;
        }

        this.isConnecting = true;
        this.notifyConnectionState(false);

        try {
            // Create new connection
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl(this.getHubUrl(), {
                    accessTokenFactory: () => appState.authJwt || ''
                })
                .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            // Set up event handlers
            this.setupEventHandlers();

            // Set up connection state handlers
            this.connection.onreconnecting((error) => {
                console.log('SignalR: Reconnecting...', error);
                this.notifyConnectionState(false);
            });

            this.connection.onreconnected((connectionId) => {
                console.log('SignalR: Reconnected with ID:', connectionId);
                this.reconnectAttempts = 0;
                this.notifyConnectionState(true);
                // Rejoin all groups after reconnection
                this.rejoinGroups();
            });

            this.connection.onclose((error) => {
                console.log('SignalR: Connection closed', error);
                this.notifyConnectionState(false);
                this.handleConnectionClosed();
            });

            // Start the connection
            await this.connection.start();
            console.log('SignalR: Connected successfully');
            this.reconnectAttempts = 0;
            this.notifyConnectionState(true);

            // Join all user's groups after successful connection
            await this.joinAllUserGroups();

        } catch (error) {
            console.error('SignalR: Connection failed', error);
            this.notifyConnectionState(false);
            this.handleConnectionError();
        } finally {
            this.isConnecting = false;
        }
    }

    /**
     * Fetch and join all groups the user is a member of
     */
    private async joinAllUserGroups(): Promise<void> {
        try {
            // Dynamically import to avoid circular dependency
            const { default: backend } = await import('./backend');
            
            // Fetch all groups
            const response = await backend.get(config.backendUrl + 'groups');
            const groups = response.data;

            // Join each group's notification channel
            for (const group of groups) {
                for(const user of group.members){
                    if(user.userName === appState.userTitle){
                        await this.joinGroup(group.id);
                    }
                }
            }

            console.log(`SignalR: Joined ${groups.length} group channels`);
        } catch (error) {
            console.error('SignalR: Error fetching user groups', error);
        }
    }

    /**
     * Stop the SignalR connection
     */
    async stop(): Promise<void> {
        if (this.connection) {
            try {
                await this.connection.stop();
                console.log('SignalR: Disconnected');
            } catch (error) {
                console.error('SignalR: Error stopping connection', error);
            }
            this.connection = null;
            this.joinedGroups.clear();
            this.notifyConnectionState(false);
        }
    }

    /**
     * Join a group to receive notifications for that group
     */
    async joinGroup(groupId: number): Promise<void> {
        // Already joined this group
        if (this.joinedGroups.has(groupId)) {
            return;
        }

        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            console.log('SignalR: Cannot join group - not connected, will join when connected');
            // Store the group to join when connected
            this.joinedGroups.add(groupId);
            return;
        }

        try {
            await this.connection.invoke('JoinGroup', groupId);
            this.joinedGroups.add(groupId);
            console.log(`SignalR: Joined group ${groupId}`);
        } catch (error) {
            console.error(`SignalR: Error joining group ${groupId}`, error);
        }
    }

    /**
     * Leave a group to stop receiving notifications for that group
     */
    async leaveGroup(groupId: number): Promise<void> {
        if (!this.connection || this.connection.state !== signalR.HubConnectionState.Connected) {
            this.joinedGroups.delete(groupId);
            return;
        }

        try {
            await this.connection.invoke('LeaveGroup', groupId);
            this.joinedGroups.delete(groupId);
            console.log(`SignalR: Left group ${groupId}`);
        } catch (error) {
            console.error(`SignalR: Error leaving group ${groupId}`, error);
        }
    }

    /**
     * Subscribe to new post notifications
     */
    onNewPost(handler: NewPostHandler): () => void {
        this.onNewPostHandlers.push(handler);
        return () => {
            this.onNewPostHandlers = this.onNewPostHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Subscribe to post deleted notifications
     */
    onPostDeleted(handler: PostDeletedHandler): () => void {
        this.onPostDeletedHandlers.push(handler);
        return () => {
            this.onPostDeletedHandlers = this.onPostDeletedHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Subscribe to post updated notifications
     */
    onPostUpdated(handler: PostUpdatedHandler): () => void {
        this.onPostUpdatedHandlers.push(handler);
        return () => {
            this.onPostUpdatedHandlers = this.onPostUpdatedHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Subscribe to new comment notifications
     */
    onNewComment(handler: NewCommentHandler): () => void {
        this.onNewCommentHandlers.push(handler);
        return () => {
            this.onNewCommentHandlers = this.onNewCommentHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Subscribe to connection state changes
     */
    onConnectionStateChange(handler: ConnectionStateHandler): () => void {
        this.onConnectionStateHandlers.push(handler);
        // Immediately notify with current state
        handler(this.isConnected());
        return () => {
            this.onConnectionStateHandlers = this.onConnectionStateHandlers.filter(h => h !== handler);
        };
    }

    /**
     * Check if connected
     */
    isConnected(): boolean {
        return this.connection?.state === signalR.HubConnectionState.Connected;
    }

    /**
     * Get the number of joined groups
     */
    getJoinedGroupsCount(): number {
        return this.joinedGroups.size;
    }

    /**
     * Set up SignalR event handlers
     */
    private setupEventHandlers(): void {
        if (!this.connection) return;

        this.connection.on('NewPost', (notification: PostNotification) => {
            console.log('SignalR: New post received', notification);
            this.onNewPostHandlers.forEach(handler => handler(notification));
        });

        this.connection.on('PostDeleted', (notification: PostDeletedNotification) => {
            console.log('SignalR: Post deleted', notification);
            this.onPostDeletedHandlers.forEach(handler => handler(notification));
        });

        this.connection.on('PostUpdated', (notification: PostUpdatedNotification) => {
            console.log('SignalR: Post updated', notification);
            this.onPostUpdatedHandlers.forEach(handler => handler(notification));
        });

        this.connection.on('NewComment', (notification: CommentNotification) => {
            console.log('SignalR: New comment received', notification);
            this.onNewCommentHandlers.forEach(handler => handler(notification));
        });
    }

    /**
     * Rejoin all groups after reconnection
     */
    private async rejoinGroups(): Promise<void> {
        const groupsToRejoin = Array.from(this.joinedGroups);
        this.joinedGroups.clear(); // Clear so joinGroup doesn't skip them
        
        for (const groupId of groupsToRejoin) {
            try {
                await this.connection?.invoke('JoinGroup', groupId);
                this.joinedGroups.add(groupId);
                console.log(`SignalR: Rejoined group ${groupId}`);
            } catch (error) {
                console.error(`SignalR: Error rejoining group ${groupId}`, error);
            }
        }
    }

    /**
     * Handle connection closed
     */
    private handleConnectionClosed(): void {
        // Attempt manual reconnection if automatic reconnection fails
        if (this.reconnectAttempts < this.maxReconnectAttempts && appState.authJwt) {
            this.reconnectAttempts++;
            const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts));
            console.log(`SignalR: Attempting reconnection in ${delay}ms (attempt ${this.reconnectAttempts})`);
            setTimeout(() => this.start(), delay);
        }
    }

    /**
     * Handle connection error
     */
    private handleConnectionError(): void {
        this.handleConnectionClosed();
    }
}

// Export singleton instance
const signalRService = new SignalRService();
export default signalRService;