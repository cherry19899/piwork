const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://workpro-api.onrender.com';

function getUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const user = JSON.parse(localStorage.getItem('piUser') || 'null');
    return user?.uid || user?.id || null;
  } catch { return null; }
}

function getAuthHeaders(): Record<string, string> {
  const userId = getUserId();
  return {
    'Content-Type': 'application/json',
    ...(userId ? { 'x-user-id': userId } : {}),
  };
}

async function apiRequest<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...getAuthHeaders(), ...(options.headers as Record<string, string> || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `API error ${res.status}`);
  return data as T;
}

// ─── Auth ──────────────────────────────────────────────
export async function loginUser(userId: string, username: string, accessToken?: string) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ userId, username, accessToken }),
  });
}

export async function getMe() {
  return apiRequest('/api/auth/me');
}

// ─── Jobs ──────────────────────────────────────────────
export interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  budget: number;
  skills: string | null;
  images: string | null;
  deadline: string | null;
  status: string;
  posted_by: string;
  posted_by_name: string;
  applications: number;
  apply_cost: number;
  created_at: string;
}

export async function getJobs(params?: {
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ jobs: Job[]; total: number; page: number; total_pages: number }> {
  const q = new URLSearchParams();
  if (params?.status) q.set('status', params.status);
  if (params?.category && params.category !== 'All') q.set('category', params.category);
  if (params?.search) q.set('search', params.search);
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  return apiRequest(`/api/jobs?${q.toString()}`);
}

export async function getJob(id: number | string): Promise<{ job: Job; applications: any[] }> {
  return apiRequest(`/api/jobs/${id}`);
}

export async function createJob(data: {
  title: string;
  description: string;
  category: string;
  budget: number;
  skills?: string;
  deadline?: string;
}): Promise<{ job: Job; success: boolean }> {
  return apiRequest('/api/jobs', { method: 'POST', body: JSON.stringify(data) });
}

export async function applyToJob(jobId: number | string, message: string) {
  return apiRequest(`/api/jobs/${jobId}/apply`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export async function deleteJob(jobId: number | string) {
  return apiRequest(`/api/jobs/${jobId}`, { method: 'DELETE' });
}

export async function hireFreelancer(jobId: number | string, applicationId: number, freelancerId: string): Promise<{ success: boolean; room_id: string; freelancer_name: string }> {
  return apiRequest(`/api/jobs/${jobId}/hire`, {
    method: 'POST',
    body: JSON.stringify({ application_id: applicationId, freelancer_id: freelancerId }),
  });
}

export async function completeJob(jobId: number | string): Promise<{ success: boolean }> {
  return apiRequest(`/api/jobs/${jobId}/complete`, { method: 'POST' });
}

export async function getMyJobs() {
  const userId = getUserId();
  if (!userId) return { jobs: [], total: 0, page: 1, total_pages: 0 };
  return getJobs({ status: 'open', page: 1, limit: 50 });
}

// ─── Users ──────────────────────────────────────────────
export async function getUser(id: string) {
  return apiRequest(`/api/users/${id}`);
}

export async function updateUser(id: string, data: {
  username?: string;
  email?: string;
  bio?: string;
  skills?: string;
  availability?: string;
  avatar?: string;
}) {
  return apiRequest(`/api/users/${id}`, { method: 'POST', body: JSON.stringify(data) });
}

export async function getUserRatings(id: string) {
  return apiRequest(`/api/users/${id}/ratings`);
}

// ─── Applications ──────────────────────────────────────────────
export async function getMyApplications() {
  return apiRequest('/api/applications');
}

// ─── Chat ──────────────────────────────────────────────
export interface ChatRoom {
  id: string;
  client_id: string;
  freelancer_id: string;
  job_id: number;
  job_title: string | null;
  other_user_id: string | null;
  other_user_name: string | null;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  room_id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

export async function getChatRooms(): Promise<{ rooms: ChatRoom[] }> {
  return apiRequest('/api/chat/rooms');
}

export async function createChatRoom(clientId: string, freelancerId: string, jobId: number) {
  return apiRequest('/api/chat/rooms', {
    method: 'POST',
    body: JSON.stringify({ client_id: clientId, freelancer_id: freelancerId, job_id: jobId }),
  });
}

export async function startDirectChat(otherUserId: string): Promise<{ id: string; conversation?: any }> {
  return apiRequest('/api/chat/start', {
    method: 'POST',
    body: JSON.stringify({ other_user_id: otherUserId }),
  });
}

export async function getChatMessages(roomId: string): Promise<{ messages: ChatMessage[] }> {
  return apiRequest(`/api/chat/rooms/${roomId}/messages`);
}

export async function sendMessage(roomId: string, message: string): Promise<{ message: ChatMessage }> {
  return apiRequest(`/api/chat/rooms/${roomId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

// ─── Connects ──────────────────────────────────────────────
export async function getConnectsBalance(): Promise<{ balance: number }> {
  return apiRequest('/api/connects/balance');
}

export async function purchaseConnects(amount: number, paymentId?: string) {
  return apiRequest('/api/connects/purchase', {
    method: 'POST',
    body: JSON.stringify({ amount, payment_id: paymentId }),
  });
}

// ─── Payments ──────────────────────────────────────────────
export async function approvePayment(paymentId: string, metadata?: Record<string, any>) {
  return apiRequest(`/api/payments/${paymentId}/approve`, {
    method: 'POST',
    body: JSON.stringify({ metadata }),
  });
}

export async function completePayment(paymentId: string, txid: string, metadata?: Record<string, any>) {
  return apiRequest(`/api/payments/${paymentId}/complete`, {
    method: 'POST',
    body: JSON.stringify({ txid, metadata }),
  });
}

export async function handleIncompletePayment(paymentId: string) {
  return apiRequest('/api/payments/incomplete', {
    method: 'POST',
    body: JSON.stringify({ paymentId }),
  });
}

// ─── Escrow ──────────────────────────────────────────────
export async function getEscrows() {
  return apiRequest('/api/escrow');
}

export async function createEscrow(jobId: number, freelancerId: string, amount: number, paymentId?: string) {
  return apiRequest('/api/escrow', {
    method: 'POST',
    body: JSON.stringify({ job_id: jobId, freelancer_id: freelancerId, amount, payment_id: paymentId }),
  });
}

export async function releaseEscrow(escrowId: number) {
  return apiRequest(`/api/escrow/${escrowId}/release`, { method: 'POST' });
}

// ─── Ratings ──────────────────────────────────────────────
export async function submitRating(toUserId: string, jobId: number, rating: number, comment: string) {
  return apiRequest('/api/ratings', {
    method: 'POST',
    body: JSON.stringify({ to_user_id: toUserId, job_id: jobId, rating, comment }),
  });
}

export async function getUserReviews(userId: string): Promise<{ reviews: any[] }> {
  return apiRequest(`/api/reviews/user/${userId}`).catch(() => ({ reviews: [] }));
}

// ─── Jobs (extra) ──────────────────────────────────────────────
export async function submitWork(jobId: number | string): Promise<{ success: boolean }> {
  return apiRequest(`/api/jobs/${jobId}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'submitted' }),
  });
}

export async function getMyJobsAsFreelancer(): Promise<{ jobs: any[] }> {
  return apiRequest('/api/jobs/as-freelancer').catch(() => ({ jobs: [] }));
}

// ─── Portfolio ──────────────────────────────────────────────
export async function getUserPortfolio(userId: string): Promise<{ items: any[] }> {
  return apiRequest(`/api/users/${userId}/portfolio`).catch(() => ({ items: [] }));
}

export async function addPortfolioItem(item: { title: string; description?: string; url?: string }) {
  return apiRequest('/api/users/me/portfolio/items', {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

export async function deletePortfolioItem(itemId: number) {
  return apiRequest(`/api/users/me/portfolio/items/${itemId}`, { method: 'DELETE' });
}

// ─── Connects purchase ──────────────────────────────────────────────
export async function buyConnectsPackage(piAmount: number, connectsAmount: number, paymentId: string) {
  return apiRequest('/api/connects/buy', {
    method: 'POST',
    body: JSON.stringify({ pi_amount: piAmount, amount: connectsAmount, payment_id: paymentId }),
  });
}

// ─── Notifications ──────────────────────────────────────────────
export async function getNotifications(): Promise<{ notifications: any[]; unread_count: number }> {
  return apiRequest('/api/notifications');
}

export async function markNotificationsRead() {
  return apiRequest('/api/notifications/mark-read', { method: 'POST' });
}

export async function getMyPostedJobs(): Promise<{ jobs: any[] }> {
  return apiRequest('/api/jobs/my').catch(() => ({ jobs: [] }));
}

export async function getUnreadChatCount(): Promise<{ count: number }> {
  return apiRequest('/api/chat/unread').catch(() => ({ count: 0 }));
}

export async function openDispute(escrowId: number, reason: string) {
  return apiRequest(`/api/escrows/${escrowId}/dispute`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export async function deleteAccount() {
  return apiRequest('/api/users/me', { method: 'DELETE' });
}
