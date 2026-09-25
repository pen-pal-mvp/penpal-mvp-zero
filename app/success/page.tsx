export default function SuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm text-center text-black">
        <h1 className="text-2xl font-bold mb-4 text-green-600">決済完了</h1>
        <p className="text-gray-600 mb-6">
          サブスクリプションの登録が正常に完了しました。
        </p>
        <a href="/letters" className="inline-block text-blue-600 hover:underline font-bold">
          受信箱へ進む
        </a>
      </div>
    </div>
  )
}