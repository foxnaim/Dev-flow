'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useChatStore } from '../../store/useChatStore';
import ChatMessage from '../../components/ChatMessage';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Menu, Search, UserPlus, Check, X, Users, UserCheck, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface FriendUser {
  _id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const currentUserId = session?.user?.id;

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, addMessage, isLoading, chats, selectedChatId, selectChat } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // New states for friend management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<FriendUser[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendUser[]>([]);
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [searchLoading, setSearchLoading] = useState(false);
  const [friendActionLoading, setFriendActionLoading] = useState<string | null>(null);

  const filteredMessages = messages.filter(message => message.chatId === selectedChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages, selectedChatId]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (selectedChatId !== null && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [selectedChatId, isSidebarOpen]);

  // --- Fetch friends and friend requests ---
  const fetchFriendsAndRequests = useCallback(async () => {
    if (status !== 'authenticated') return;

    try {
      // Fetch friends
      const friendsRes = await fetch('/api/users/friends');
      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setFriends(data);
      } else {
        console.error('Failed to fetch friends:', await friendsRes.text());
      }

      // Fetch friend requests
      const requestsRes = await fetch('/api/users/friend-requests');
      if (requestsRes.ok) {
        const data = await requestsRes.json();
        setFriendRequests(data);
      } else {
        console.error('Failed to fetch friend requests:', await requestsRes.text());
      }
    } catch (error) {
      console.error('Error fetching friends or requests:', error);
    }
  }, [status]);

  useEffect(() => {
    fetchFriendsAndRequests();
  }, [fetchFriendsAndRequests]);

  // --- User Search Functionality ---
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const res = await fetch(`/api/users/search?email=${encodeURIComponent(searchTerm.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      } else {
        console.error('Failed to search users:', await res.text());
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error during user search:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // --- Friend Request Actions ---
  const sendFriendRequest = async (recipientId: string) => {
    setFriendActionLoading(recipientId);
    try {
      const res = await fetch('/api/users/friend-requests/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId }),
      });
      if (res.ok) {
        alert('Friend request sent!');
        setSearchResults(prev => prev.filter(user => user._id !== recipientId));
        fetchFriendsAndRequests();
      } else {
        const errorData = await res.json();
        alert(`Failed to send request: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Error sending friend request.');
    } finally {
      setFriendActionLoading(null);
    }
  };

  const respondToFriendRequest = async (senderId: string, action: 'accept' | 'reject') => {
    setFriendActionLoading(senderId);
    try {
      const res = await fetch('/api/users/friend-requests/respond', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, action }),
      });
      if (res.ok) {
        alert(`Friend request ${action}ed!`);
        fetchFriendsAndRequests();
      } else {
        const errorData = await res.json();
        alert(`Failed to ${action} request: ${errorData.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      alert(`Error ${action}ing friend request.`);
    } finally {
      setFriendActionLoading(null);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !selectedChatId) return;

    addMessage({
      role: 'user',
      content: inputMessage.trim(),
    });

    setInputMessage('');
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow relative">
      {/* Десктопный статичный сайдбар */}
      <div className="hidden md:flex md:flex-col md:w-72 bg-surface-light p-4 border-r border-border">
        {/* Tab Navigation */}
        <div className="flex justify-around mb-4 border-b border-border pb-2">
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'friends' ? 'bg-accent text-white' : 'text-foreground hover:bg-surface/80'}`}
            onClick={() => setActiveTab('friends')}
          >
            <Users className="inline-block mr-1 w-4 h-4" /> Friends
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'requests' ? 'bg-accent text-white' : 'text-foreground hover:bg-surface/80'}`}
            onClick={() => setActiveTab('requests')}
          >
            <UserCheck className="inline-block mr-1 w-4 h-4" /> Requests ({friendRequests.length})
          </button>
          <button
            className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'search' ? 'bg-accent text-white' : 'text-foreground hover:bg-surface/80'}`}
            onClick={() => { setActiveTab('search'); setSearchResults([]); setSearchTerm(''); }}
          >
            <Search className="inline-block mr-1 w-4 h-4" /> Search
          </button>
        </div>

        {/* Content based on activeTab */}
        <div className="flex-grow overflow-y-auto">
          {activeTab === 'friends' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Your Friends</h2>
              {friends.length === 0 ? (
                <p className="text-secondary-text">No friends yet. Find someone!</p>
              ) : (
                <ul className="space-y-2">
                  {isClient && friends.map(friend => (
                    <li key={friend._id}>
                      <button
                        className={`w-full text-left p-2 rounded ${selectedChatId === friend._id ? 'bg-accent text-white' : 'hover:bg-surface/80'}`}
                        onClick={() => selectChat(friend._id)}
                      >
                        {friend.username || friend.email}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>
              {friendRequests.length === 0 ? (
                <p className="text-secondary-text">No pending friend requests.</p>
              ) : (
                <ul className="space-y-2">
                  {friendRequests.map(request => (
                    <li key={request._id} className="p-2 rounded flex items-center justify-between bg-surface/50">
                      <span>{request.username || request.email}</span>
                      <div className="flex space-x-2">
                        <button
                          className="p-1 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                          onClick={() => respondToFriendRequest(request._id, 'accept')}
                          disabled={friendActionLoading === request._id}
                        >
                          {friendActionLoading === request._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                          onClick={() => respondToFriendRequest(request._id, 'reject')}
                          disabled={friendActionLoading === request._id}
                        >
                          {friendActionLoading === request._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'search' && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Find Users</h2>
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                  type="email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by email"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-accent text-white disabled:opacity-50"
                  disabled={searchLoading}
                >
                  {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                </button>
              </form>
              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-md font-medium mb-2">Search Results</h3>
                  <ul className="space-y-2">
                    {searchResults.map(user => (
                      <li key={user._id} className="p-2 rounded flex items-center justify-between bg-surface/50">
                        <span>{user.username || user.email}</span>
                        <button
                          className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                          onClick={() => sendFriendRequest(user._id)}
                          disabled={friendActionLoading === user._id}
                        >
                          {friendActionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Мобильный сайдбар */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-surface-light p-4 border-r border-border flex flex-col z-40 md:hidden"
          >
            {/* Tab Navigation for Mobile */}
            <div className="flex justify-around mb-4 border-b border-border pb-2">
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'friends' ? 'bg-accent text-white' : 'text-foreground hover:bg-surface/80'}`}
                onClick={() => setActiveTab('friends')}
              >
                Friends
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'requests' ? 'bg-accent text-white' : 'text-foreground hover:bg-surface/80'}`}
                onClick={() => setActiveTab('requests')}
              >
                Requests ({friendRequests.length})
              </button>
              <button
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'search' ? 'bg-accent text-white' : 'text-foreground hover:bg-surface/80'}`}
                onClick={() => { setActiveTab('search'); setSearchResults([]); setSearchTerm(''); }}
              >
                Search
              </button>
            </div>

            {/* Content for Mobile Sidebar */}
            <div className="flex-grow overflow-y-auto">
              {activeTab === 'friends' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Your Friends</h2>
                  {friends.length === 0 ? (
                    <p className="text-secondary-text">No friends yet. Find someone!</p>
                  ) : (
                    <ul className="space-y-2">
                      {friends.map(friend => (
                        <li key={friend._id}>
                          <button
                            className={`w-full text-left p-2 rounded ${selectedChatId === friend._id ? 'bg-accent text-white' : 'hover:bg-surface/80'}`}
                            onClick={() => { selectChat(friend._id); setIsSidebarOpen(false); }}
                          >
                            {friend.username || friend.email}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === 'requests' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Friend Requests</h2>
                  {friendRequests.length === 0 ? (
                    <p className="text-secondary-text">No pending friend requests.</p>
                  ) : (
                    <ul className="space-y-2">
                      {friendRequests.map(request => (
                        <li key={request._id} className="p-2 rounded flex items-center justify-between bg-surface/50">
                          <span>{request.username || request.email}</span>
                          <div className="flex space-x-2">
                            <button
                              className="p-1 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                              onClick={() => respondToFriendRequest(request._id, 'accept')}
                              disabled={friendActionLoading === request._id}
                            >
                              {friendActionLoading === request._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              className="p-1 rounded-full bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                              onClick={() => respondToFriendRequest(request._id, 'reject')}
                              disabled={friendActionLoading === request._id}
                            >
                              {friendActionLoading === request._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === 'search' && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">Find Users</h2>
                  <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <input
                      type="email"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by email"
                      className="flex-1 px-3 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-lg bg-accent text-white disabled:opacity-50"
                      disabled={searchLoading}
                    >
                      {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                  </form>
                  {searchResults.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium mb-2">Search Results</h3>
                      <ul className="space-y-2">
                        {searchResults.map(user => (
                          <li key={user._id} className="p-2 rounded flex items-center justify-between bg-surface/50">
                            <span>{user.username || user.email}</span>
                            <button
                              className="p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                              onClick={() => sendFriendRequest(user._id)}
                              disabled={friendActionLoading === user._id}
                            >
                              {friendActionLoading === user._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Затемнение фона при открытом сайдбаре на мобилке */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Основная область чата */}
      <div className="flex flex-col flex-1 ">
        {/* Хедер */}
        <div className="p-4 border-b border-border flex items-center gap-2">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-surface/80 rounded md:hidden"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold">
            {selectedChatId ? friends.find(f => f._id === selectedChatId)?.username || friends.find(f => f._id === selectedChatId)?.email : 'Выберите друга для начала общения'}
          </h1>
        </div>

        {/* Сообщения */}
        {selectedChatId ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {filteredMessages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-secondary-text">
            Выберите друга для начала общения
          </div>
        )}

        {/* Инпут */}
        {selectedChatId && (
          <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-surface">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="p-2 rounded-lg bg-accent text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent/90"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
