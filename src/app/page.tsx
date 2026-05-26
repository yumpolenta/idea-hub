'use client';

import { useEffect, useState } from 'react';
import { POST } from './api/ideas/route';

type Idea = {
  id: string;
  title: string;
  content: string;
  status: string;
  tags: string[];
  createdAt: string;
};

type ListIdeasResponse = {
  items: Idea[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

type ApiError = {
  code: string;
  message: string;
  requestId: string;
  details?: unknown;
};

export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function loadIdeas() {
    setError(null);
    const response = await fetch('/api/ideas?page=1&pageSize=10');
    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? 'Failed to load ideas');
      return;
    }
    setIdeas(data.items);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const response = await fetch('/api/ideas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        content,
        status: 'draft',
        tags: ['manual'],
      }),
    });
    const data = await response.json();
    if (!response.ok){
      setError(data.message ?? 'Failed to create idea')
      return;
    }
    setTitle('');
    setContent('');
    await loadIdeas();

  }

  useEffect(() => {
    loadIdeas();
  }, []);

  return (
    <main>
      <h1>Idea Hub</h1>

      {error && <p>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Idea title"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Idea content"
        />
        <button type="submit">Create Idea</button>
      </form>

      <ul>
        {ideas.map((idea) => (
          <li key={idea.id}>
            <h2>{idea.title}</h2>
            <p>{idea.content}</p>
          </li>
        ))}
      </ul>
    </main>
  );

}