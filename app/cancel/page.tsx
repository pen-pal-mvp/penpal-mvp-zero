export default function CancelPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm text-center text-black">
        <h1 className="text-2xl font-bold mb-4 text-red-600">決済キャンセル</h1>
        <p className="text-gray-600 mb-6">
          決済手続きが中断されました。課金は発生していません。
        </p>
        <a href="/" className="inline-block text-blue-600 hover:underline font-bold">
          トップページへ戻る
        </a>
      </div>
    </div>
  )
}