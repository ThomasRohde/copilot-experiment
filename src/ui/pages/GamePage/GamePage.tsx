import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameStore } from '@/state/gameStore';
import { Pile, StockPile, GameStats, GameControls, SettingsPanel, WinModal } from '@/ui/components';
import './GamePage.css';

export function GamePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const newGame = useGameStore((state) => state.newGame);
    const waste = useGameStore((state) => state.waste);
    const foundations = useGameStore((state) => state.foundations);
    const tableau = useGameStore((state) => state.tableau);
    const clearSelection = useGameStore((state) => state.clearSelection);

    // Handle PWA shortcut: ?action=new starts a new game
    useEffect(() => {
        if (searchParams.get('action') === 'new') {
            newGame();
            // Remove the query param after handling
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams, newGame]);

    const handleTableClick = () => {
        clearSelection();
    };

    return (
        <div className="game-page" onClick={handleTableClick}>
            <header className="game-page__header">
                <GameControls />
                <GameStats />
                <SettingsPanel />
            </header>

            <main className="game-page__table">
                <div className="game-page__top-row">
                    <div className="game-page__stock-area">
                        <StockPile />
                        <div data-testid="waste-pile">
                            <Pile pile={waste} maxVisible={3} />
                        </div>
                    </div>

                    <div className="game-page__foundations">
                        {foundations.map((foundation) => (
                            <Pile key={foundation.id} pile={foundation} />
                        ))}
                    </div>
                </div>

                <div className="game-page__tableau">
                    {tableau.map((pile) => (
                        <Pile key={pile.id} pile={pile} spread={true} />
                    ))}
                </div>
            </main>

            <WinModal />
        </div>
    );
}
