import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, Star, Filter, ShoppingBag, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { aviniProducts, categoryLabels, bodyTypeLabels, type AviniProduct } from "@/data/aviniProductsData";

const SHOP_URL = "https://AVINIHEALTH.COM/LORIE";

type FilterType = "all" | "recommended" | string;

export function AviniHealthProducts() {
  const { user } = useAuth();
  const [bodyType, setBodyType] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<AviniProduct | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    async function fetchBodyType() {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("body_type")
        .eq("user_id", user.id)
        .single();
      if (data?.body_type) setBodyType(data.body_type);
    }
    fetchBodyType();
  }, [user]);

  const filteredProducts = aviniProducts.filter((p) => {
    if (filter === "all") return true;
    if (filter === "recommended" && bodyType) return p.recommendedFor.includes(bodyType as any);
    return p.category === filter;
  });

  const categories = Object.keys(categoryLabels);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <ShoppingBag className="w-10 h-10 text-primary mx-auto mb-4" />
        <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
          Avini Health <span className="text-primary">Products</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Clean, clinical-grade supplements curated to support your unique body type.
          {bodyType && (
            <span className="block mt-1 text-primary font-medium">
              {bodyTypeLabels[bodyType]?.emoji} Products marked with a star are recommended for your {bodyTypeLabels[bodyType]?.name} body type.
            </span>
          )}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
          className="rounded-full"
        >
          All Products
        </Button>
        {bodyType && (
          <Button
            variant={filter === "recommended" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("recommended")}
            className="rounded-full"
          >
            <Star className="w-3.5 h-3.5 mr-1" />
            For My Type
          </Button>
        )}
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
            className="rounded-full"
          >
            {categoryLabels[cat].label}
          </Button>
        ))}
      </div>

      {/* Product Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, i) => {
            const isRecommended = bodyType ? product.recommendedFor.includes(bodyType as any) : false;
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <Card
                  className={`cursor-pointer hover:shadow-lg transition-all duration-300 h-full group relative ${
                    isRecommended ? "ring-2 ring-primary/30 bg-primary/[0.02]" : ""
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  {isRecommended && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md">
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="text-3xl mb-2">{product.icon}</div>
                      <Badge className={categoryLabels[product.category].color + " border-0 text-[10px]"}>
                        {categoryLabels[product.category].label}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-serif group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{product.tagline}</p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-1.5">
                      {product.benefits.slice(0, 3).map((b) => (
                        <Badge key={b} variant="secondary" className="text-[10px] font-normal">
                          {b}
                        </Badge>
                      ))}
                    </div>
                    {bodyType && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {product.recommendedFor.map((type) => (
                          <span
                            key={type}
                            className={`text-[10px] ${
                              type === bodyType ? "text-primary font-semibold" : "text-muted-foreground"
                            }`}
                          >
                            {bodyTypeLabels[type].emoji}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Shop CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4"
      >
        <Button variant="hero" size="xl" asChild>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop All Products
            <ExternalLink className="w-4 h-4 ml-2" />
          </a>
        </Button>
        <p className="text-xs text-muted-foreground mt-3">AVINIHEALTH.COM/LORIE — Affiliate Partner</p>
      </motion.div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-lg">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-4xl">{selectedProduct.icon}</span>
                  <div>
                    <DialogTitle className="font-serif text-2xl">{selectedProduct.name}</DialogTitle>
                    <p className="text-sm text-primary font-medium">{selectedProduct.tagline}</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="space-y-5">
                <Badge className={categoryLabels[selectedProduct.category].color + " border-0"}>
                  {categoryLabels[selectedProduct.category].label}
                </Badge>

                <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>

                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" /> Key Benefits
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.benefits.map((b) => (
                      <Badge key={b} variant="secondary">{b}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-2">Recommended For</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.recommendedFor.map((type) => (
                      <Badge
                        key={type}
                        className={
                          type === bodyType
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-muted text-muted-foreground border-0"
                        }
                      >
                        {bodyTypeLabels[type].emoji} {bodyTypeLabels[type].name}
                        {type === bodyType && " (You)"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="gold" className="w-full" size="lg" asChild>
                  <a href={SHOP_URL} target="_blank" rel="noopener noreferrer">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop {selectedProduct.name}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
