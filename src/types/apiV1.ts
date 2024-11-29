import { z } from 'zod';

export const SystemMessage = z.object({
    role: z.literal("system"),
    content: z.string(),
});

export const UserMessage = z.object({
    role: z.literal("user"),
    content: z.string(),
});

export const AssistantMessage = z.object({
    role: z.literal("assistant"),
    content: z.string(),
    agentName: z.string().optional(),
    sender: z.string().optional(),
});

export const AssistantMessageWithToolCalls = z.object({
    role: z.literal("assistant"),
    content: z.string().optional(),
    tool_calls: z.array(z.object({
        id: z.string(),
        type: z.literal("function"),
        function: z.object({
            name: z.string(),
            arguments: z.string(),
        }),
    })),
    sender: z.string().optional(),
});

export const ToolMessage = z.object({
    role: z.literal("tool"),
    content: z.string(),
    tool_call_id: z.string(),
    tool_name: z.string(),
});

const BaseChatMessage = z.object({
    version: z.literal('v1'),
    chatId: z.string(),
    createdAt: z.string().datetime(),
    relevantAgents: z.array(z.string()).optional(),
    currentTurn: z.boolean().optional(),
});

export const ChatMessage = BaseChatMessage
    .and(z.union([
        SystemMessage,
        UserMessage,
        AssistantMessage,
        AssistantMessageWithToolCalls,
        ToolMessage,
    ]));

export const ChatCloseReason = z.union([
    z.literal('user-closed-chat'),
    z.literal('assistant-closed-chat'),
    z.literal('timeout'),
    z.literal('error'),
]);

export const Chat = z.object({
    version: z.literal('v1'),
    projectId: z.string(),
    userId: z.string(),
    createdAt: z.string().datetime(),
    closed: z.boolean().optional(),
    closedAt: z.string().datetime().optional(),
    closeReason: ChatCloseReason.optional(),
    lastAgentName: z.string().optional(),
});

export const ApiCreateChatRequest = z.object({});

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
    .and(AssistantMessage)
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

export const ApiCreateGuestSessionRequest = z.object({});

export const ApiCreateGuestSessionResponse = z.object({
    sessionId: z.string(),
});
