import type {Metadata} from 'next';
import { Inter, Oswald, IBM_Plex_Mono, Baloo_2 } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const oswald = Oswald({ subsets: ['latin'], variable: '--font-heading', weight: ['400', '500', '700'] });
const ibmPlexMono = IBM_Plex_Mono({ subsets: ['latin'], variable: '--font-mono', weight: ['400', '500', '600'] });
const baloo = Baloo_2({ subsets: ['latin'], variable: '--font-baloo', weight: ['800'] });

export const metadata: Metadata = {
  title: 'Town Chicken Point | Crisp Flame Chicken',
  description: 'Order the best crispy and flame-grilled chicken online via WhatsApp.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${ibmPlexMono.variable} ${baloo.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-[#FAFAFA]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

