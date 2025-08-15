import './globals.css'
export const metadata={title:'TLP Edu CRM',description:'Education CRM'}
export default function RootLayout({children}:{children:React.ReactNode}){return(<html lang='en'><body><main className='container py-6'>{children}</main></body></html>)}
