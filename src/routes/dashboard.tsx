import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { sortRecommended, useStore } from "@/lib/store";
import { toast } from "sonner";
import { BadgeCheck, Eye, Package, ShieldAlert, Upload } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const { currentUser, items, addItem, deleteItem, submitLicense } = useStore();
  const [search, setSearch] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = sortRecommended(items);
    if (search) list = list.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()));
    if (verifiedOnly) list = list.filter((i) => i.isVerifiedShop);
    return list;
  }, [items, search, verifiedOnly]);

  if (!currentUser) return <Navigate to="/login" />;

  const myItems = items.filter((i) => i.sellerId === currentUser.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {currentUser.type === "shop" ? currentUser.shopName : "Your dashboard"}
          </h1>
          <p className="text-muted-foreground">
            {currentUser.type === "shop" ? "Manage your shop, items and verification." : "Browse the marketplace and sell your items."}
          </p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="flex-wrap">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="sell">Sell an item</TabsTrigger>
            <TabsTrigger value="my">My items</TabsTrigger>
            {currentUser.type === "shop" && <TabsTrigger value="shop">Shop</TabsTrigger>}
          </TabsList>

          <TabsContent value="browse" className="mt-6">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Input placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={verifiedOnly} onCheckedChange={(v) => setVerifiedOnly(!!v)} />
                Verified shops only
              </label>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((item) => (
                <ItemCard key={item.id} item={item} onBuy={() => toast.success(`"${item.title}" bought (mock)`)} />
              ))}
              {filtered.length === 0 && <p className="text-muted-foreground">No items match your search.</p>}
            </div>
          </TabsContent>

          <TabsContent value="sell" className="mt-6">
            <SellForm onAdd={(d) => { addItem(d); toast.success("Item listed!"); }} />
          </TabsContent>

          <TabsContent value="my" className="mt-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {myItems.map((item) => (
                <ItemCard key={item.id} item={item} onDelete={(i) => { deleteItem(i.id); toast("Item removed"); }} />
              ))}
              {myItems.length === 0 && <p className="text-muted-foreground">You haven't listed anything yet.</p>}
            </div>
          </TabsContent>

          {currentUser.type === "shop" && (
            <TabsContent value="shop" className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Package className="h-4 w-4" /> Items sold</div>
                  <div className="mt-2 text-3xl font-bold">{currentUser.itemsSold ?? 0}</div>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Eye className="h-4 w-4" /> Views</div>
                  <div className="mt-2 text-3xl font-bold">{currentUser.views ?? 0}</div>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">Status</div>
                  <div className="mt-2">
                    {currentUser.verified ? (
                      <Badge className="gap-1 bg-primary/15 text-primary hover:bg-primary/15"><BadgeCheck className="h-3 w-3" /> Verified</Badge>
                    ) : currentUser.licenseStatus === "pending" ? (
                      <Badge variant="secondary">Pending review</Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1"><ShieldAlert className="h-3 w-3" /> Unverified</Badge>
                    )}
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold">Shop verification</h3>
                <p className="mt-1 text-sm text-muted-foreground">Upload your business license to get a verified badge and priority in recommendations.</p>
                <LicenseUpload status={currentUser.licenseStatus} verified={currentUser.verified} onSubmit={submitLicense} />
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

function SellForm({ onAdd }: { onAdd: (d: { title: string; price: number; description: string; imageUrl: string }) => void }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <Card className="max-w-2xl p-6">
      <h3 className="font-semibold">List a new item</h3>
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onAdd({ title, price: Number(price) || 0, description, imageUrl: imageUrl || "https://images.unsplash.com/photo-1513708927688-890fe46c91ab?w=600" });
          setTitle(""); setPrice(""); setDescription(""); setImageUrl("");
        }}
      >
        <div><Label>Title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label>Price (Nu)</Label><Input required type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
        <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div><Label>Image URL</Label><Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." /></div>
        <Button type="submit">Post item</Button>
      </form>
    </Card>
  );
}

function LicenseUpload({ status, verified, onSubmit }: { status?: string; verified: boolean; onSubmit: () => void }) {
  const [fileName, setFileName] = useState<string | null>(null);

  if (verified) return <p className="mt-4 text-sm text-primary">Your shop is verified ✓</p>;
  if (status === "pending") return <p className="mt-4 text-sm text-muted-foreground">License under review...</p>;

  return (
    <div className="mt-4 space-y-3">
      <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border p-4 hover:bg-muted/50">
        <Upload className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">{fileName || "Choose license file"}</span>
        <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
      </label>
      <Button disabled={!fileName} onClick={() => { onSubmit(); toast("Submitted for verification"); }}>
        Submit for Verification
      </Button>
    </div>
  );
}