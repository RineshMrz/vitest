// App.test.js

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../App';

// Import and configure MSW (Mock Service Worker)
import { setupServer } from 'msw/node';
import { rest } from 'msw';

const server = setupServer(
  rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('it fetches and renders posts', async () => {
  render(<App />);
  await screen.findByText('Post 1');
  await screen.findByText('Post 2');
  expect(screen.getByText('Posts')).toBeInTheDocument();
});