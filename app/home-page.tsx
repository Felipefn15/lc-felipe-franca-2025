'use client'

interface Author {
  name: string | null
}

interface Post {
  id: number
  title: string
  content: string | null
  author: Author
}

interface Props {
  posts: Post[]
}

export const revalidate = 0

export default function HomePage({ posts }: Props) {
  console.log({posts})
  return (
    <>
      <h1 className="text-center font-bold text-lg my-4">Posts</h1>
      <ul className="flex flex-wrap gap-4">
        {posts.map(post => (
          <li className="border border-gray-500 rounded-md shadow-md p-4 bg-white w-96" key={post.id}>
            <h2 className="font-semibold">{post.title}</h2>
            <p>{post.content}</p>
            <span className="text-sm text-gray-500">By {post.author.name}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
