import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function CommercePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            特定商取引法に基づく表記
          </h1>
          <p className="text-gray-600 text-lg">
            法令に基づく事業者情報の開示
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-xl md:text-2xl text-center">
              事業者情報
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="grid gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="min-w-0 md:min-w-[200px]">
                    <Badge variant="outline" className="text-sm font-medium">
                      事業者の名称
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">株式会社創挙</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="min-w-0 md:min-w-[200px]">
                    <Badge variant="outline" className="text-sm font-medium">
                      運営責任者
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-900">趙 文拳</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <div className="min-w-0 md:min-w-[200px]">
                    <Badge variant="outline" className="text-sm font-medium">
                      所在地
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-900">〒340-0826 埼玉県八潮市大字大曽根705-1</p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <div className="min-w-0 md:min-w-[200px]">
                    <Badge variant="outline" className="text-sm font-medium">
                      連絡先
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-900">電話番号：048-951-1089</p>
                    <p className="text-lg text-gray-900">メールアドレス：rentalcar@soukyo-motors.jp</p>
                    <p className="text-sm text-gray-600 mt-2">
                      受付時間：09:00 - 18:00（年中無休）
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <div className="min-w-0 md:min-w-[200px]">
                    <Badge variant="outline" className="text-sm font-medium">
                      ホームページURL
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <a 
                      href="https://www.soukyo-rent-a-car.com" 
                      className="text-lg text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.soukyo-rent-a-car.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card className="pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-6">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
            <CardTitle className="text-xl md:text-2xl text-center">
              販売価格（税込）
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-2 font-semibold text-gray-900">車種</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900">6時間</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900">12時間</th>
                    <th className="text-center py-3 px-2 font-semibold text-gray-900">24時間</th>
                  </tr>
                </thead>
                <tbody className="text-sm md:text-base">
                  {[
                    ["BMW X1", "8,500", "9,500", "10,500"],
                    ["BMW 1", "5,000", "6,000", "7,000"],
                    ["BMW 3", "7,000", "8,000", "9,000"],
                    ["POLO", "5,000", "6,000", "7,000"],
                    ["GOLF", "7,000", "8,000", "9,000"],
                    ["ライズ", "8,000", "9,000", "10,000"],
                    ["Xbee", "5,000", "6,000", "7,000"],
                    ["A4", "7,000", "8,000", "9,000"],
                    ["鈴木小K", "4,500", "5,500", "6,500"],
                    ["Note/Aqua/Fit/ヤリス", "5,000", "6,000", "7,000"],
                    ["カローラ/プリウス", "7,000", "8,000", "9,000"],
                    ["BMW 5シリーズ", "12,800", "13,800", "15,800"],
                    ["BMW 7シリーズ", "9,800", "10,800", "12,800"],
                    ["BMW Z4", "10,800", "11,800", "13,800"],
                    ["メルセデス Sクラス", "16,800", "19,800", "23,800"],
                    ["マセラティ ギブリ", "20,800", "23,800", "25,800"],
                    ["BMW X5", "15,800", "16,800", "18,800"],
                    ["JUKE", "8,000", "9,000", "10,000"],
                    ["CX-5/エクストレイル", "8,500", "9,500", "10,500"],
                    ["シエンタ/フリード", "5,800", "6,800", "7,800"],
                    ["オデッセイ", "7,500", "8,500", "9,500"],
                    ["ノア/ヴォクシー/セレナ/ステップワゴン", "6,800", "7,800", "8,800"],
                    ["アルファード 2代目", "7,800", "8,800", "10,800"],
                    ["アルファード/ヴェルファイア 3代目", "13,800", "14,800", "16,800"],
                    ["ハイエース", "12,800", "13,800", "15,800"],
                  ].map(([car, h6, h12, h24], index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-3 px-2 font-medium text-gray-900">{car}</td>
                      <td className="py-3 px-2 text-center text-gray-700">¥{h6}</td>
                      <td className="py-3 px-2 text-center text-gray-700">¥{h12}</td>
                      <td className="py-3 px-2 text-center text-gray-700">¥{h24}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              ※ 上記価格は消費税込みの表示です
            </p>
          </CardContent>
        </Card>

        {/* Payment and Service Information */}
        <div className="grid gap-6 mt-6 md:grid-cols-2">
          <Card className="pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <CardTitle className="text-lg md:text-xl">
                お支払い・その他費用
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    商品代金以外の必要料金
                  </Badge>
                  <ul className="text-gray-700 space-y-1">
                    <li>• 保険料（お客様負担）</li>
                    <li>• 燃料費（お客様負担）</li>
                    <li>• 高速道路料金（お客様負担）</li>
                    <li>• 駐車場料金（お客様負担）</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <Badge variant="outline" className="mb-2">
                    受付可能な決済方法
                  </Badge>
                  <p className="text-gray-700">クレジットカード決済（Stripe）</p>
                  <p className="text-sm text-gray-600">
                    VISA、MasterCard、American Express、JCB
                  </p>
                </div>
                <Separator />
                <div>
                  <Badge variant="outline" className="mb-2">
                    支払時期
                  </Badge>
                  <p className="text-gray-700">
                    予約確定時に即座に決済処理を行います
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
              <CardTitle className="text-lg md:text-xl">
                サービス提供期間
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Badge variant="outline" className="mb-2">
                    引渡時期
                  </Badge>
                  <p className="text-gray-700">
                    予約確定後、指定された日時にお車をお引き渡しいたします
                  </p>
                </div>
                <Separator />
                <div>
                  <Badge variant="outline" className="mb-2">
                    営業時間
                  </Badge>
                  <p className="text-gray-700">
                    09:00 - 20:00<br />
                    年中無休
                  </p>
                </div>
                <Separator />
                <div>
                  <Badge variant="outline" className="mb-2">
                    貸出・返却場所
                  </Badge>
                  <p className="text-gray-700">
                    埼玉県八潮市大字大曽根705-1<br />
                    （その他指定場所での受け渡しも可能）
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Return Policy */}
        <Card className="pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-6">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <CardTitle className="text-xl md:text-2xl text-center">
              返品・交換について
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">お客様のご都合による返品・交換</h4>
                <p className="text-blue-700 text-sm">
                  レンタカーサービスの性質上、お客様のご都合による返品・交換は承っておりません。<br />
                  キャンセルについては下記のキャンセルポリシーをご確認ください。
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">車両の不具合・事故等による対応</h4>
                <p className="text-green-700 text-sm">
                  車両に不具合がある場合や、当社の責任による問題が発生した場合は、<br />
                  代替車両の提供または料金の返金を行います。<br />
                  お気づきの際は速やかにご連絡ください。<br />
                  <strong>連絡先：048-951-1089</strong>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cancellation Policy */}
        <Card className="pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-6">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardTitle className="text-xl md:text-2xl text-center">
              キャンセルポリシー
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  ご利用開始時刻の168時間前〜72時間前
                </p>
                <p className="text-sm text-yellow-700">
                  キャンセル料：レンタル料金の30%
                </p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-orange-800 mb-2">
                  ご利用開始時刻の72時間前〜24時間前
                </p>
                <p className="text-sm text-orange-700">
                  キャンセル料：レンタル料金の50%
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800 mb-2">
                  ご利用開始時刻の24時間前以降
                </p>
                <p className="text-sm text-red-700">
                  キャンセル料：レンタル料金の100%
                </p>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  ※ キャンセルのご連絡は営業時間内（09:00-18:00）にお願いいたします<br />
                  ※ 天災・事故等やむを得ない事情の場合は、個別に対応いたします
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Conditions */}
        <Card className="pt-0 shadow-lg border-0 bg-white/80 backdrop-blur-sm mt-6">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
            <CardTitle className="text-xl md:text-2xl text-center">
              その他特記事項
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">利用条件</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 有効な運転免許証をお持ちの方（国際免許証可）</li>
                  <li>• 年齢21歳以上の方</li>
                  <li>• 免許取得から1年以上経過している方</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">禁止事項</h4>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 車両の又貸し</li>
                  <li>• 喫煙（全車禁煙）</li>
                  <li>• ペットの同乗</li>
                  <li>• 法令に違反する使用</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>本表記は特定商取引法第11条に基づき記載しております</p>
          <p className="mt-2">最終更新日：{new Date().toLocaleDateString('ja-JP')}</p>
        </div>
      </div>
    </div>
  );
}
