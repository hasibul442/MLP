import "./globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MuiThemeProvider from '@/Components/MuiThemeProvider';

export const metadata = {
  title: "MLP - Math Learning Platform",
  description: "A comprehensive math learning platform offering solved examples, multiple learning methods, and a rich library to enhance your math skills.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true} data-scroll-behavior="smooth">
      <body className="page-background">
        <MuiThemeProvider>
          {children}
        </MuiThemeProvider>
      </body>
    </html>
  );
}
