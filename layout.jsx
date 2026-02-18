export const metadata = {
  title: 'Deriva — Travel with Intent',
  description: 'Be the first in your friend group to go. Curated travel destinations matched to how you actually travel.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
