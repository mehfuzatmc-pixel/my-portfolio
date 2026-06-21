import './globals.css';

export const metadata = {
  title: 'IdeaSite Studio',
  description: 'I will turn your ideas into responsive, polished websites.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
