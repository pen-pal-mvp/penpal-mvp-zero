export default function ErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm text-center text-black">
        <h1 className="text-2xl font-bold mb-4 text-red-600">認証エラー</h1>
        <p className="text-gray-600">
          リンクの有効期限が切れているか、不正なリクエストです。<br />
          もう一度ログイン画面からやり直してください。
        </p>
        <a href="/" className="inline-block mt-6 text-blue-600 hover:underline font-bold">
          ログイン画面へ戻る
        </a>
      </div>
    </div>
  )
}