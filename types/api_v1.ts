import { AssistantContent, AssistantMessage, CoreMessage, ToolCallPart, ToolContent } from 'ai';
import { z } from 'zod';

export const ChatCloseReason = z.union([
    z.literal('user-closed-chat'),
    z.literal('assistant-closed-chat'),
    z.literal('timeout'),
    z.literal('error'),
]);

export const Chat = z.object({
    version: z.literal('v1'),
    projectId: z.string(),
    user_id: z.string(),
    createdAt: z.string().datetime(),
    closed: z.boolean().optional(),
    closedAt: z.string().datetime().optional(),
    closeReason: ChatCloseReason.optional(),
});

const BaseChatMessage = z.object({
    version: z.literal('v1'),
    chatId: z.string(),
    createdAt: z.string().datetime(),
});

export const ChatMessage = BaseChatMessage.and(z.custom<CoreMessage>());

export const ApiCreateChatRequest = z.object({
    user_id: z.string().optional(), // if not provided, we will generate a random user_id
});

export const ApiCreateChatResponse = Chat
    .and(z.object({
        id: z.string(),
    }));

export const ApiGetChatResponse = ApiCreateChatResponse;

export const ApiGetChatsResponse = z.object({
    chats: z.array(Chat.and(z.object({
        id: z.string(),
    }))),
    next: z.string().optional(),
    previous: z.string().optional(),
});

export const ApiChatTurnRequest = z.object({
    message: z.string(), // user message
});

export const ApiChatTurnResponse = ChatMessage
    .and(BaseChatMessage)
    .and(z.custom<AssistantMessage>())
    .and(z.object({
        id: z.string(),
    }));

export const ApiGetChatMessagesResponse = z.object({
    messages: z.array(ChatMessage.and(z.object({
        id: z.string(),
    }))),
    next: z.string().optional(),
    previous: z.string().optional(),
});
