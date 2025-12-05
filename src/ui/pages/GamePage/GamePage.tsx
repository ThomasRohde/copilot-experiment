import { useGameStore } from '@/state/gameStore';
import { Pile, StockPile, GameStats, GameControls, SettingsPanel, WinModal } from '@/ui/components';
import './GamePage.css';

export function GamePage() {
    const waste = useGameStore((state) => state.waste);
    const foundations = useGameStore((state) => state.foundations);
    const tableau = useGameStore((state) => state.tableau);
    const clearSelection = useGameStore((state) => state.clearSelection);

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
                        <Pile pile={waste} maxVisible={3} />
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
