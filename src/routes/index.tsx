import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { sortRecommended, useStore } from "@/lib/store";
import { toast } from "sonner";
import { ShoppingBag, Store, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { items, currentUser } = useStore();
  const featured = sortRecommended(items).slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Bhutan's community marketplace
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Buy & Sell — <span className="text-primary">Individual or Shop</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            NyoTshong connects everyday sellers and verified shops in one trusted, friendly marketplace.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            {currentUser ? (
              <Link to="/dashboard"><Button size="lg">Go to dashboard</Button></Link>
            ) : (
              <>
                <Link to="/signup"><Button size="lg">Sign Up</Button></Link>
                <Link to="/login"><Button size="lg" variant="outline">Login</Button></Link>
              </>
            )}
          </div>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: ShoppingBag, t: "List in seconds", d: "Post an item with a photo, price and you're live." },
              { icon: Store, t: "Shops welcome", d: "Run your shop, manage items, track sales." },
              { icon: ShieldCheck, t: "Verified sellers", d: "Licensed shops get a verified badge and priority." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="rounded-xl border border-border bg-card p-5 text-left shadow-sm">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-2 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured items</h2>
            <p className="text-sm text-muted-foreground">Verified shops shown first.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <ItemCard key={item.id} item={item} onBuy={() => toast.success(`"${item.title}" bought (mock)`)} />
          ))}
        </div>
      </section>
    </div>
  );
}
