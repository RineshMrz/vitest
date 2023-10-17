import { useState, useEffect } from 'react';

const App = () => {

  const [data, setData] = useState([]);

  console.log(data)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);
  return (
    <>
      <h1>Posts</h1>
      <ul>
        {data.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </>
  )
}

export default App
