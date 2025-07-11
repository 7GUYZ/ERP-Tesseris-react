export default function PostList({ posts }) {
    return (
      <ul className="space-y-2">
        {posts.map(post => (
          <li key={post.id} className="p-4 border rounded">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    );
  }