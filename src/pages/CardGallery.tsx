import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/landing/Footer';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { permissionGrantedDeck, abundanceDeck, OracleCard as OracleCardType } from '@/data/oracleCards';
import { getCardImage, getCardImageForNumber } from '@/data/cardImageMap';
import { Search, CheckCircle, AlertCircle } from 'lucide-react';

const CardGallery = () => {
  const [search, setSearch] = useState('');
  const [selectedDeck, setSelectedDeck] = useState<'all' | 'permission' | 'abundance'>('all');

  const allCards: OracleCardType[] = [
    ...permissionGrantedDeck,
    ...abundanceDeck,
  ];

  const filteredCards = allCards.filter((card) => {
    const matchesSearch =
      card.title.toLowerCase().includes(search.toLowerCase()) ||
      card.category.toLowerCase().includes(search.toLowerCase());
    const matchesDeck =
      selectedDeck === 'all' ||
      (selectedDeck === 'permission' && card.deck_name === 'Permission Granted') ||
      (selectedDeck === 'abundance' && card.deck_name === 'Abundance');
    return matchesSearch && matchesDeck;
  });

  const getImageStatus = (card: OracleCardType) => {
    const directMatch = getCardImage(card.title);
    const fallbackMatch = getCardImageForNumber(card.card_number);
    return {
      image: directMatch ?? fallbackMatch,
      isDirectMatch: Boolean(directMatch),
    };
  };

  const directMatchCount = allCards.filter((c) => getCardImage(c.title)).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Card Gallery</h1>
          <p className="text-muted-foreground mb-4">
            Browse all oracle cards and verify image mappings
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Direct matches: {directMatchCount}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="w-3 h-3 text-amber-500" />
              Fallback: {allCards.length - directMatchCount}
            </Badge>
            <Badge variant="secondary">Total: {allCards.length}</Badge>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'permission', 'abundance'] as const).map((deck) => (
              <button
                key={deck}
                onClick={() => setSelectedDeck(deck)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedDeck === deck
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {deck === 'all' ? 'All' : deck === 'permission' ? 'Permission' : 'Abundance'}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredCards.map((card) => {
            const { image, isDirectMatch } = getImageStatus(card);
            return (
              <motion.div
                key={`${card.deck_name}-${card.card_number}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative rounded-lg overflow-hidden shadow-md border border-border bg-card"
              >
                {image ? (
                  <img
                    src={image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full aspect-[3/4] object-cover"
                  />
                ) : (
                  <div className="w-full aspect-[3/4] bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">No image</span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                  <p className="text-white text-xs font-semibold line-clamp-2">{card.title}</p>
                  <p className="text-white/70 text-[10px]">{card.category}</p>
                </div>

                {/* Match indicator */}
                <div className="absolute top-1 right-1">
                  {isDirectMatch ? (
                    <CheckCircle className="w-4 h-4 text-green-400 drop-shadow" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 drop-shadow" />
                  )}
                </div>

                {/* Card number */}
                <div className="absolute top-1 left-1 bg-black/50 text-white text-[9px] px-1.5 py-0.5 rounded">
                  #{card.card_number}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            No cards match your search.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CardGallery;
