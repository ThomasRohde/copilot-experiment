import { useState, useEffect, useCallback } from 'react';
import './InstallPrompt.css';

// Extended interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'pwa-install-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    // Check if user dismissed recently
    const wasDismissedRecently = useCallback(() => {
        const dismissedAt = localStorage.getItem(DISMISS_KEY);
        if (!dismissedAt) return false;
        
        const dismissTime = parseInt(dismissedAt, 10);
        return Date.now() - dismissTime < DISMISS_DURATION;
    }, []);

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
            return;
        }

        const handleBeforeInstall = (e: Event) => {
            // Prevent Chrome 67+ from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            
            // Only show our custom prompt if not recently dismissed
            if (!wasDismissedRecently()) {
                setShowPrompt(true);
            }
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowPrompt(false);
            setDeferredPrompt(null);
            // Clear dismissal on successful install
            localStorage.removeItem(DISMISS_KEY);
            console.log('[PWA] App installed successfully');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, [wasDismissedRecently]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the native install prompt
        await deferredPrompt.prompt();
        
        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log(`[PWA] Install prompt outcome: ${outcome}`);
        
        if (outcome === 'accepted') {
            setShowPrompt(false);
        }
        
        // Clear the deferred prompt - can only be used once
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        // Remember dismissal for 7 days
        localStorage.setItem(DISMISS_KEY, Date.now().toString());
        console.log('[PWA] Install prompt dismissed');
    };

    // Don't render if installed or not showing
    if (isInstalled || !showPrompt) {
        return null;
    }

    return (
        <div className="install-prompt">
            <div className="install-prompt__content">
                <span className="install-prompt__icon">🎴</span>
                <div className="install-prompt__text">
                    <strong>Install Solitaire</strong>
                    <span>Play anytime, even offline!</span>
                </div>
            </div>
            <div className="install-prompt__actions">
                <button 
                    className="install-prompt__button install-prompt__button--dismiss"
                    onClick={handleDismiss}
                    aria-label="Dismiss install prompt"
                >
                    Later
                </button>
                <button 
                    className="install-prompt__button install-prompt__button--install"
                    onClick={() => { void handleInstall(); }}
                    aria-label="Install app"
                >
                    Install
                </button>
            </div>
        </div>
    );
}
