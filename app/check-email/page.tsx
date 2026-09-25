import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm text-black text-center">
        <h1 className="text-2xl font-bold mb-4">メールを確認してください</h1>
        <p className="text-gray-600 mb-6">
          入力されたメールアドレスにログイン用のマジックリンクを送信しました。<br />
          メール内のリンクをクリックして、ログインを完了させてください。
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          トップページへ戻る
        </Link>
      </div>
    </div>
  )
}