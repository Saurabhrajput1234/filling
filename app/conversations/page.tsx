"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSocket } from "../../lib/socketContext";
import type { RootState } from "../../store/store";

interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: string;
  message: string;
  createdAt: string;
  job: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Conversation {
  id: string;
  userId: string;
  companyId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  messages: Message[];
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

interface ConversationItem {
  application: Application;
  conversation: Conversation | null;
  hasConversation: boolean;
}

export default function ConversationsPage() {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { socket, isConnected, joinConversation, leaveConversation } = useSocket();
  const [conversationItems, setConversationItems] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "COMPANY") {
      router.push("/auth/login");
      return;
    }

    if (user?.companyId) {
      fetchConversations();
    }
  }, [isAuthenticated, user?.companyId, router]);

  // Auto-select conversation from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversationId');
    
    if (conversationId && conversationItems.length > 0) {
      const item = conversationItems.find(item => item.conversation?.id === conversationId);
      if (item && item.conversation) {
        setSelectedConversation(item.conversation);
      }
    }
  }, [conversationItems]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      joinConversation(selectedConversation.id);
    }

    return () => {
      if (selectedConversation) {
        leaveConversation(selectedConversation.id);
      }
    };
  }, [selectedConversation, joinConversation, leaveConversation]);

  // Socket.IO real-time message handling
  useEffect(() => {
    if (!socket) {
      console.log('Socket not available for real-time messages');
      return;
    }

    const handleNewMessage = (data: { conversationId: string; message: Message }) => {
      console.log('Received new message via Socket.IO:', data);
      console.log('Current selected conversation:', selectedConversation?.id);
      if (selectedConversation && data.conversationId === selectedConversation.id) {
        console.log('Adding message to current conversation');
        setMessages(prev => [...prev, data.message]);
      } else {
        console.log('Message not for current conversation or no conversation selected');
      }
    };

    console.log('Setting up Socket.IO message listener');
    socket.on('new-message', handleNewMessage);

    return () => {
      console.log('Cleaning up Socket.IO message listener');
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/conversations?companyId=${user?.companyId}`);
      
      if (response.ok) {
        const data = await response.json();
        setConversationItems(data);
      } else {
        console.error("Failed to fetch conversations:", response.status);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSendingMessage(true);
      console.log('Sending message via API:', {
        conversationId: selectedConversation.id,
        senderId: user?.id,
        content: newMessage.trim(),
      });
      
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          senderId: user?.id,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const message = await response.json();
        console.log('Message sent successfully via API:', message);
        setMessages(prev => [...prev, message]);
        setNewMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const startConversation = async (application: Application) => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: application.userId,
          companyId: user?.companyId,
        }),
      });

      if (response.ok) {
        const conversation = await response.json();
        setSelectedConversation(conversation);
        fetchConversations(); // Refresh to update the conversation list
      }
    } catch (error) {
      console.error("Failed to start conversation:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated || user?.role !== "COMPANY") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
              <p className="text-gray-600">Chat with job applicants</p>
              {isConnected && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Connected
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/company/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications/Conversations List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Applications & Conversations</h2>
                <p className="text-sm text-gray-500">{conversationItems.length} total applications</p>
              </div>
              <div className="divide-y max-h-96 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center text-gray-500">Loading...</div>
                ) : conversationItems.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">No applications yet</div>
                ) : (
                  conversationItems.map((item, index) => (
                    <div
                      key={`${item.application.id}-${item.application.userId}-${index}`}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedConversation?.id === item.conversation?.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => {
                        if (item.conversation) {
                          setSelectedConversation(item.conversation);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {item.application.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.application.user.name}
                            </h3>
                            <p className="text-xs text-gray-500">{item.application.job.title}</p>
                            <p className="text-xs text-gray-400">{item.application.user.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          {item.hasConversation ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Chatting
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startConversation(item.application);
                              }}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                            >
                              Start Chat
                            </button>
                          )}
                          <span className="text-xs text-gray-400 mt-1">
                            {new Date(item.application.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border h-96 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {selectedConversation.user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">
                            {selectedConversation.user.name}
                          </h3>
                          <p className="text-xs text-gray-500">{selectedConversation.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isConnected && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        <span className="text-xs text-gray-500">
                          {isConnected ? 'Online' : 'Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={`${message.id}-${index}`}
                        className={`flex ${
                          message.senderId === user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sendingMessage || !newMessage.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {sendingMessage ? "Sending..." : "Send"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select an application to start chatting with the applicant.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 