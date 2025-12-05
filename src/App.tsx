import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, GamePage, HelpPage } from '@/ui/pages';
import { ErrorBoundary, OfflineIndicator, InstallPrompt, UpdateNotification } from '@/ui/components';
import { StandaloneModeProvider } from '@/ui/hooks';
import './App.css';

export function App() {
    return (
        <ErrorBoundary>
            <StandaloneModeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/game" element={<GamePage />} />
                        <Route path="/help" element={<HelpPage />} />
                    </Routes>
                    <OfflineIndicator />
                    <InstallPrompt />
                    <UpdateNotification />
                </BrowserRouter>
            </StandaloneModeProvider>
        </ErrorBoundary>
    );
}
