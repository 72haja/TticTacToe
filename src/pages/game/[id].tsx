import { useRouter } from 'next/router'

export default function Game() {
  const router = useRouter()
  return <p>Post: {router.query.id}</p>
}