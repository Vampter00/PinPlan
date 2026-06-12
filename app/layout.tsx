export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0,fontFamily:'Arial',background:'#0B0F14',color:'#E5E7EB'}}>
        {children}
      </body>
    </html>
  );
}
