"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getConversations() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return [];

  return await prisma.conversation.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function getConversation(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  return await prisma.conversation.findUnique({
    where: { id, userId: session.user.id },
    include: { messages: { orderBy: { createdAt: 'asc' } } }
  });
}

export async function createConversation(title: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.conversation.create({
    data: {
      title,
      userId: session.user.id,
    }
  });
}

export async function deleteConversation(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  return await prisma.conversation.delete({
    where: { id, userId: session.user.id }
  });
}
