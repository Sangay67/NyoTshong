import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const Route = createFileRoute("/signup")({ component: SignupPage });

function SignupPage() {
  const { signup } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"individual" | "shop">("individual");
  const [shopName, setShopName] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = signup({ email, password, type, shopName: type === "shop" ? shopName : undefined });
    if (!u) return toast.error("Email already registered");
    toast.success("Account created!");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">Create an account</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label>Account type</Label>
              <RadioGroup value={type} onValueChange={(v) => setType(v as "individual" | "shop")} className="mt-2 grid grid-cols-2 gap-2">
                <Label className={`cursor-pointer rounded-md border p-3 text-sm ${type === "individual" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="individual" className="sr-only" /> Individual
                </Label>
                <Label className={`cursor-pointer rounded-md border p-3 text-sm ${type === "shop" ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value="shop" className="sr-only" /> Shop
                </Label>
              </RadioGroup>
            </div>
            {type === "shop" && (
              <div>
                <Label>Shop name</Label>
                <Input required value={shopName} onChange={(e) => setShopName(e.target.value)} />
              </div>
            )}
            <div>
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Have an account? <Link to="/login" className="text-primary underline">Login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}