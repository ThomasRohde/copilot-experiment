import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage, GamePage, HelpPage } from '@/ui/pages';
import { ErrorBoundary } from '@/ui/components';
import './App.css';

export function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/game" element={<GamePage />} />
                    <Route path="/help" element={<HelpPage />} />
                </Routes>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
