import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = login(email, password);
    if (!u) return toast.error("Invalid credentials");
    toast.success(`Welcome back, ${u.type === "shop" ? u.shopName : "friend"}!`);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-16">
        <Card className="p-6">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="mt-1 text-sm text-muted-foreground">Try demo: <code>user@demo.com / demo</code> or <code>shop@demo.com / demo</code></p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No account? <Link to="/signup" className="text-primary underline">Sign up</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}