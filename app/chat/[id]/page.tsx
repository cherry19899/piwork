import ChatPageClient from './ChatPageClient';

export function generateStaticParams() {
  return [{ id: '_placeholder' }];
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  return <ChatPageClient params={params} />;
}
