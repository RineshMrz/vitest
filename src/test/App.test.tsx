// // App.test.js

// import { render, screen, act } from '@testing-library/react';
// import App from '../App';

// // Import and configure MSW (Mock Service Worker)
// import { setupServer } from 'msw/node';
// import { rest } from 'msw';

// const server = setupServer(
//   rest.get('https://jsonplaceholder.typicode.com/posts', (req, res, ctx) => {
//     return res(
//       ctx.json([
//         { id: 1, title: 'Post 1' },
//         { id: 2, title: 'Post 2' },
//       ])
//     );
//   })
// );

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

// test('it fetches and renders posts', async () => {
//   render(<App />);
//   await screen.findByText('Post 1');
//   await screen.findByText('Post 2');
//   expect(screen.getByText('Posts')).toBeInTheDocument();
// });


import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getTodos } from './todos'
import { failure, success } from '../handler'
import { Client } from 'pg'


const jsonTestData = {
  key1: 'value1',
  key2: 'value2'
};

vi.mock('pg', () => {
  const Client = vi.fn()
  Client.prototype.connect = vi.fn()
  Client.prototype.query = vi.fn()
  Client.prototype.end = vi.fn()

  return { Client }
})

vi.mock('./handlers.js', () => {
  return {
    success: vi.fn(),
    failure: vi.fn(),
  }
})

describe('get a list of todo items', () => {
  let client:any

  beforeEach(() => {
    client = new Client()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should return items successfully', async () => {
    client.query.mockResolvedValueOnce({ rows: [], rowCount: 0 })

    await getTodos({ event: { body: JSON.stringify(jsonTestData) }, context: { getRemainingTimeInMillis: () => 1000 } });

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith("SELECT * FROM todos")
    expect(client.end).toBeCalledTimes(1)

    expect(success).toBeCalledWith({
      message: '0 item(s) returned',
      data: [],
      status: true,
    })
  })

  it('should throw an error', async () => {
    const mError = new Error('Unable to retrieve rows')
    client.query.mockRejectedValueOnce(mError)

    await getTodos({ event: { body: JSON.stringify(jsonTestData) }, context: { getRemainingTimeInMillis: () => 1000 } });

    expect(client.connect).toBeCalledTimes(1)
    expect(client.query).toBeCalledWith("SELECT * FROM todos")
    expect(client.end).toBeCalledTimes(1)
    expect(failure).toBeCalledWith({ message: mError, status: false })
  })
})