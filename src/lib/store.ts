import { useEffect, useState, useCallback } from "react";

export type User = {
  id: string;
  email: string;
  password: string;
  type: "individual" | "shop";
  shopName?: string;
  verified: boolean;
  licenseStatus?: "none" | "pending" | "verified";
  itemsSold?: number;
  views?: number;
};

export type Item = {
  id: string;
  sellerId: string;
  sellerType: "individual" | "shop";
  sellerName: string;
  isVerifiedShop: boolean;
  title: string;
  price: number;
  description: string;
  imageUrl: string;
};

const USERS_KEY = "nyo_users";
const ITEMS_KEY = "nyo_items";
const SESSION_KEY = "nyo_session";

const seedUsers: User[] = [
  { id: "u1", email: "shop@demo.com", password: "demo", type: "shop", shopName: "Lhasa Crafts", verified: true, licenseStatus: "verified", itemsSold: 24, views: 318 },
  { id: "u2", email: "shop2@demo.com", password: "demo", type: "shop", shopName: "Thimphu Threads", verified: false, licenseStatus: "none", itemsSold: 4, views: 80 },
  { id: "u3", email: "user@demo.com", password: "demo", type: "individual", verified: false },
];

const seedItems: Item[] = [
  { id: "i1", sellerId: "u1", sellerType: "shop", sellerName: "Lhasa Crafts", isVerifiedShop: true, title: "Handwoven Wool Scarf", price: 1200, description: "Traditional handwoven scarf in natural dyes.", imageUrl: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600" },
  { id: "i2", sellerId: "u1", sellerType: "shop", sellerName: "Lhasa Crafts", isVerifiedShop: true, title: "Copper Singing Bowl", price: 3500, description: "7-metal handcrafted singing bowl.", imageUrl: "https://images.unsplash.com/photo-1602178141046-ac2c6cdbbc97?w=600" },
  { id: "i3", sellerId: "u2", sellerType: "shop", sellerName: "Thimphu Threads", isVerifiedShop: false, title: "Cotton Kira Set", price: 2800, description: "Modern cotton kira in pastel tones.", imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600" },
  { id: "i4", sellerId: "u3", sellerType: "individual", sellerName: "Tenzin", isVerifiedShop: false, title: "Vintage Film Camera", price: 4500, description: "35mm camera, fully working, lightly used.", imageUrl: "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=600" },
  { id: "i5", sellerId: "u3", sellerType: "individual", sellerName: "Tenzin", isVerifiedShop: false, title: "Wooden Mountain Bike", price: 8000, description: "Hardtail bike, recently serviced.", imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600" },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("nyo:update"));
}

export function ensureSeed() {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(USERS_KEY)) write(USERS_KEY, seedUsers);
  if (!window.localStorage.getItem(ITEMS_KEY)) write(ITEMS_KEY, seedItems);
}

export function getUsers(): User[] { return read(USERS_KEY, seedUsers); }
export function getItems(): Item[] { return read(ITEMS_KEY, seedItems); }
export function setUsers(u: User[]) { write(USERS_KEY, u); }
export function setItems(i: Item[]) { write(ITEMS_KEY, i); }

export function getSession(): string | null {
  return read<string | null>(SESSION_KEY, null);
}
export function setSession(id: string | null) {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(SESSION_KEY, JSON.stringify(id));
  else window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent("nyo:update"));
}

export function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => {
    ensureSeed();
    const h = () => setTick((t) => t + 1);
    window.addEventListener("nyo:update", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("nyo:update", h);
      window.removeEventListener("storage", h);
    };
  }, []);

  const users = getUsers();
  const items = getItems();
  const sessionId = getSession();
  const currentUser = users.find((u) => u.id === sessionId) || null;

  const login = useCallback((email: string, password: string) => {
    const u = getUsers().find((x) => x.email === email && x.password === password);
    if (u) { setSession(u.id); return u; }
    return null;
  }, []);

  const signup = useCallback((data: Omit<User, "id" | "verified">) => {
    const list = getUsers();
    if (list.some((u) => u.email === data.email)) return null;
    const user: User = {
      ...data,
      id: "u" + Date.now(),
      verified: false,
      licenseStatus: data.type === "shop" ? "none" : undefined,
      itemsSold: 0,
      views: 0,
    };
    setUsers([...list, user]);
    setSession(user.id);
    return user;
  }, []);

  const logout = useCallback(() => setSession(null), []);

  const addItem = useCallback((data: Omit<Item, "id" | "sellerId" | "sellerType" | "sellerName" | "isVerifiedShop">) => {
    const sid = getSession();
    const seller = getUsers().find((u) => u.id === sid);
    if (!seller) return;
    const item: Item = {
      ...data,
      id: "i" + Date.now(),
      sellerId: seller.id,
      sellerType: seller.type,
      sellerName: seller.type === "shop" ? seller.shopName || "Shop" : seller.email.split("@")[0],
      isVerifiedShop: seller.type === "shop" && !!seller.verified,
    };
    setItems([item, ...getItems()]);
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(getItems().filter((i) => i.id !== id));
  }, []);

  const submitLicense = useCallback(() => {
    const sid = getSession();
    if (!sid) return;
    const list = getUsers();
    setUsers(list.map((u) => u.id === sid ? { ...u, licenseStatus: "pending" } : u));
    setTimeout(() => {
      const cur = getUsers();
      setUsers(cur.map((u) => u.id === sid ? { ...u, licenseStatus: "verified", verified: true } : u));
      // mark their items as verified
      setItems(getItems().map((i) => i.sellerId === sid ? { ...i, isVerifiedShop: true } : i));
    }, 2000);
  }, []);

  return { users, items, currentUser, login, signup, logout, addItem, deleteItem, submitLicense };
}

export function sortRecommended(items: Item[]): Item[] {
  return [...items].sort((a, b) => {
    const rank = (i: Item) => i.isVerifiedShop ? 0 : i.sellerType === "shop" ? 1 : 2;
    return rank(a) - rank(b);
  });
}