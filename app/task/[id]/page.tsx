import TaskPageClient from './TaskPageClient';

export function generateStaticParams() {
  return [{ id: '_placeholder' }];
}

export default function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  return <TaskPageClient params={params} />;
}
