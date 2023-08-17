export default function RootLayout({ children }) {
    return(
        <html lang="en">
            <body style={{ margin: '0', backgroundColor: '#353535' }}>{children}</body>
        </html>
    )
}