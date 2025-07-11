import { StoreProvider } from '@/lib/providers/StoreProvider';
import './globals.css';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body>
        <StoreProvider>
            {children}
        </StoreProvider>
        </body>
        </html>
    );
}