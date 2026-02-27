import "./globals.css";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";

export const metadata = {
  title: "RRe Shop",
  description: "Animated product shop",
  icons: {
    icon: "/icon.png"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnimatedBackground />
        {children}
        <Footer />
      </body>
    </html>
  );
}
