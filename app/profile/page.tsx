import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Profile() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">マイプロフィール / 마이 프로필</CardTitle>
          <CardDescription className="text-center">
            現在の登録情報です。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1 border-b pb-2">
            <p className="text-sm font-medium text-gray-500">ペンネーム / 닉네임</p>
            <p className="text-lg font-semibold">선우 (仮データ)</p>
          </div>
          <div className="space-y-1 border-b pb-2">
            <p className="text-sm font-medium text-gray-500">MBTI</p>
            <p className="text-lg font-semibold">INTP</p>
          </div>
          <div className="space-y-1 border-b pb-2">
            <p className="text-sm font-medium text-gray-500">自己紹介 / 자기소개</p>
            <p className="text-md bg-gray-100 p-3 rounded-md min-h-[80px]">
              はじめまして！ / 만나서 반갑습니다!
            </p>
          </div>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/letters" className="w-full">
              <Button className="w-full">レター一覧へ / 편지 목록으로</Button>
            </Link>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">ログアウト / 로그아웃</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}