import { Link, useNavigate } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, User as UserIcon, LogOut } from "lucide-react";

export function Navbar() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="rounded-md bg-primary px-2 py-1 text-primary-foreground">Nyo</span>
          <span>Tshong</span>
        </Link>
        <nav className="flex items-center gap-3">
          {currentUser ? (
            <>
              <Badge variant="secondary" className="gap-1">
                {currentUser.type === "shop" ? <Store className="h-3 w-3" /> : <UserIcon className="h-3 w-3" />}
                {currentUser.type === "shop" ? currentUser.shopName : "Individual"}
                {currentUser.verified && <span className="ml-1 text-primary">✓</span>}
              </Badge>
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate({ to: "/" }); }}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/signup"><Button size="sm">Sign Up</Button></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}