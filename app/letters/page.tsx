import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function LettersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: letters, error } = await supabase
    .from('letters')
    .select('*')
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch error:', error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm">
        <h1 className="text-2xl font-bold mb-6">受信箱 / 받은 편지함</h1>
        
        {letters && letters.length > 0 ? (
          <div className="space-y-4">
            {letters.map((letter: any) => (
              <div key={letter.id} className="border border-gray-200 p-4 rounded-md">
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(letter.created_at).toLocaleString()}
                </p>
                <p className="whitespace-pre-wrap">{letter.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">手紙はまだありません。</p>
        )}
      </div>
    </div>
  )
}