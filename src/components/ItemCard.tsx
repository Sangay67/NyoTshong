import type { Item } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Store, User as UserIcon, Trash2 } from "lucide-react";

export function ItemCard({ item, onBuy, onDelete }: { item: Item; onBuy?: (i: Item) => void; onDelete?: (i: Item) => void }) {
  return (
    <Card className="overflow-hidden flex flex-col group">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight">{item.title}</h3>
          <span className="whitespace-nowrap font-bold text-primary">Nu {item.price}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {item.isVerifiedShop ? (
            <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15"><BadgeCheck className="h-3 w-3" /> Verified Shop</Badge>
          ) : item.sellerType === "shop" ? (
            <Badge variant="outline" className="gap-1"><Store className="h-3 w-3" /> Shop</Badge>
          ) : (
            <Badge variant="outline" className="gap-1"><UserIcon className="h-3 w-3" /> Individual</Badge>
          )}
          <span className="text-muted-foreground">by {item.sellerName}</span>
        </div>
        <div className="mt-auto flex gap-2 pt-2">
          {onBuy && <Button size="sm" className="flex-1" onClick={() => onBuy(item)}>Buy now</Button>}
          {onDelete && (
            <Button size="sm" variant="outline" onClick={() => onDelete(item)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}