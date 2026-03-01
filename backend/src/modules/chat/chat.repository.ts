import prisma from '../../config/database';

const getSortOrder = (sort?: string): any => {
  switch (sort) {
    case 'oldest': return { updatedAt: 'asc' as const };
    case 'most-messages': return { messages: { _count: 'desc' as const } };
    case 'a-z': return { user: { firstName: 'asc' as const } };
    case 'z-a': return { user: { firstName: 'desc' as const } };
    default: return { updatedAt: 'desc' as const };
  }
};

export const chatRepository = {
  findConversations: (userId?: string, sort?: string) => {
    const unreadWhere = userId
      ? { isRead: false, sender: { not: 'USER' as const } }
      : { isRead: false, sender: 'USER' as const };

    return prisma.conversation.findMany({
      where: userId ? { userId } : {},
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' as const },
        },
        _count: { select: { messages: { where: unreadWhere } } },
      },
      orderBy: getSortOrder(sort),
    });
  },

  findConversationById: (id: string) =>
    prisma.conversation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    }),

  createConversation: (userId: string, subject?: string) =>
    prisma.conversation.create({
      data: { userId, subject },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        messages: true,
      },
    }),

  addMessage: (data: {
    conversationId: string;
    sender: 'USER' | 'ADMIN' | 'SYSTEM';
    content: string;
  }) => prisma.message.create({ data }),

  markAsRead: (conversationId: string) =>
    prisma.message.updateMany({
      where: { conversationId, isRead: false },
      data: { isRead: true },
    }),

  closeConversation: (id: string) =>
    prisma.conversation.update({
      where: { id },
      data: { isActive: false },
    }),

  getUnreadCount: (userId?: string) =>
    prisma.message.count({
      where: {
        isRead: false,
        ...(userId
          ? { conversation: { userId }, sender: { not: 'USER' } }
          : { sender: 'USER' }),
      },
    }),

  updateConversationSubject: (id: string, subject: string) =>
    prisma.conversation.update({
      where: { id },
      data: { subject },
    }),

  countUnreadBySender: (conversationId: string, sender: 'USER' | 'ADMIN' | 'SYSTEM') =>
    prisma.message.count({
      where: { conversationId, sender, isRead: false },
    }),
};
