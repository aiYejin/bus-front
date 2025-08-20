import "./globals.css";

export const metadata = {
  title: "버스알리미 - 실시간 버스 정보",
  description: "실시간 버스 위치와 도착 시간을 확인하는 스마트한 버스 정보 서비스",
  keywords: "버스, 실시간, 도착시간, 버스알리미, 대중교통",
  authors: [{ name: "버스알리미 팀" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
