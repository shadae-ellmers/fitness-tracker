import { auth0 } from '@/lib/auth0'

export default async function Page({ params }: { params: { slug: string } }) {
  const session = await auth0.getSession()

  return (
    <div>
      <p>hello</p>
    </div>
  )
}
