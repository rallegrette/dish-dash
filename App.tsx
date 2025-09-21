import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
} from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

/* ================== Types ================== */
type Drop = {
  id: string;
  restaurantName: string;
  title: string;
  imageUrl: string;
  priceCents: number;
  qtyRemaining: number;
  pickupStartISO: string;
  pickupEndISO: string;
  dietary: string[];
  distanceMi: number;
};

type RootStackParamList = {
  Home: undefined;
  DropDetail: { drop: Drop };
  OrderQR: { orderId: string; drop: Drop };
};

/* ================== Mock Data ================== */
const now = Date.now();
const MOCK_DROPS: Drop[] = [
  {
    id: "aa1",
    restaurantName: "Maize & Blue Deli",
    title: "Surprise Bag (Sandwiches & Sides)",
    // nicer deli shot
    imageUrl:
       "https://images.unsplash.com/photo-1606756790138-261d2b21cd34?q=80&w=1600&auto=format&fit=crop",
    priceCents: 799,
    qtyRemaining: 5,
    pickupStartISO: new Date(now + 30 * 60 * 1000).toISOString(),
    pickupEndISO: new Date(now + 120 * 60 * 1000).toISOString(),
    dietary: ["veg"],
    distanceMi: 1.2,
  },
  {
    id: "bb2",
    restaurantName: "Fleetwood Diner",
    title: "Closing Time Combo",
    imageUrl:
       "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop",
      
    priceCents: 599,
    qtyRemaining: 2,
    pickupStartISO: new Date(now + 60 * 60 * 1000).toISOString(),
    pickupEndISO: new Date(now + 150 * 60 * 1000).toISOString(),
    dietary: [],
    distanceMi: 2.3,
  },
  {
    id: "cc3",
    restaurantName: "Seva Ann Arbor",
    title: "Veggie Entrees Mix",
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
    priceCents: 899,
    qtyRemaining: 8,
    pickupStartISO: new Date(now + 20 * 60 * 1000).toISOString(),
    pickupEndISO: new Date(now + 90 * 60 * 1000).toISOString(),
    dietary: ["veg", "gluten-free"],
    distanceMi: 0.8,
  },
];

/* ================== Helpers ================== */
const dollars = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const timeRange = (startISO: string, endISO: string) => {
  const f = (d: Date) =>
    d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const s = new Date(startISO);
  const e = new Date(endISO);
  return `${f(s)}–${f(e)}`;
};

/* ================== Screens ================== */
const HomeScreen = ({ navigation }: any) => {
  const [drops] = useState<Drop[]>(MOCK_DROPS);

  const sorted = useMemo(
    () =>
      [...drops].sort(
        (a, b) =>
          a.distanceMi - b.distanceMi ||
          new Date(a.pickupStartISO).getTime() -
            new Date(b.pickupStartISO).getTime()
      ),
    [drops]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.brand}>Dish Dash</Text>
        <Text style={styles.subtle}>Pickup-only surplus meals near you</Text>
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.listPad}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("DropDetail", { drop: item })}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <View style={styles.cardBody}>
              <Text style={styles.title} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.restaurant} numberOfLines={1}>
                {item.restaurantName} • {item.distanceMi.toFixed(1)} mi
              </Text>
              <View style={styles.rowBetween}>
                <Text style={styles.price}>{dollars(item.priceCents)}</Text>
                <Text style={styles.badge}>
                  {item.qtyRemaining} left ·{" "}
                  {timeRange(item.pickupStartISO, item.pickupEndISO)}
                </Text>
              </View>
              {item.dietary.length > 0 && (
                <Text style={styles.tags}>{item.dietary.join(" • ")}</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-free",
  "Dairy-free",
  "Nut-free",
  "Halal",
  "Kosher",
];

const DropDetailScreen = ({ route, navigation }: any) => {
  const { drop } = route.params as { drop: Drop };

  // dropdown state for dietary preferences
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [selectedPrefs, setSelectedPrefs] = useState<Record<string, boolean>>(
    {}
  );

  const togglePref = (name: string) =>
    setSelectedPrefs((p) => ({ ...p, [name]: !p[name] }));

  const checkout = () => {
    const fakeOrderId = `ORD-${drop.id}-${Math.floor(Math.random() * 1e6)}`;
    Alert.alert("Payment (Test Mode)", "Simulating a successful payment…", [
      {
        text: "OK",
        onPress: () =>
          navigation.replace("OrderQR", { orderId: fakeOrderId, drop }),
      },
    ]);
  };

  const selectedList = Object.entries(selectedPrefs)
    .filter(([_, v]) => v)
    .map(([k]) => k);

  return (
    <SafeAreaView style={styles.safe}>
      <Image source={{ uri: drop.imageUrl }} style={styles.detailImage} />
      <View style={styles.detailBody}>
        <Text style={styles.detailTitle}>{drop.title}</Text>

        {/* Tap restaurant name to open dropdown */}
        <TouchableOpacity
          onPress={() => setPrefsOpen((o) => !o)}
          activeOpacity={0.7}
        >
          <Text style={styles.detailRestaurant}>
            {drop.restaurantName}{" "}
            <Text style={styles.linkish}>
              {prefsOpen ? "▲" : "▼"} dietary preferences
            </Text>
          </Text>
        </TouchableOpacity>

        {prefsOpen && (
          <View style={styles.dropdown}>
            {DIETARY_OPTIONS.map((opt) => {
              const on = !!selectedPrefs[opt];
              return (
                <TouchableOpacity
                  key={opt}
                  style={styles.optRow}
                  onPress={() => togglePref(opt)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, on && styles.checkboxOn]}>
                    {on && <Text style={styles.checkboxMark}>✓</Text>}
                  </View>
                  <Text style={styles.optText}>{opt}</Text>
                </TouchableOpacity>
              );
            })}
            {selectedList.length > 0 && (
              <Text style={styles.selectedNote}>
                Selected: {selectedList.join(", ")}
              </Text>
            )}
          </View>
        )}

        <Text style={styles.detailMeta}>
          {dollars(drop.priceCents)} · {drop.distanceMi.toFixed(1)} mi away
        </Text>
        <Text style={styles.detailMeta}>
          Pickup: {timeRange(drop.pickupStartISO, drop.pickupEndISO)}
        </Text>
        {drop.dietary.length > 0 && (
          <Text style={styles.tags}>{drop.dietary.join(" • ")}</Text>
        )}

        <TouchableOpacity
          style={[styles.cta, drop.qtyRemaining <= 0 && styles.ctaDisabled]}
          disabled={drop.qtyRemaining <= 0}
          onPress={checkout}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaText}>
            {drop.qtyRemaining > 0
              ? `Checkout — ${dollars(drop.priceCents)}`
              : "Sold Out"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const OrderQRScreen = ({ route, navigation }: any) => {
  const { orderId, drop } = route.params as { orderId: string; drop: Drop };
  const pseudoQR = orderId
    .replace(/[^A-Z0-9]/g, "")
    .split("")
    .map((c, i) => ((c.charCodeAt(0) + i) % 2 ? "██" : "  "))
    .join("");

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.qrCard}>
        <Text style={styles.qrTitle}>Pickup QR</Text>
        <View style={styles.qrBox}>
          <Text style={styles.qrMono}>{pseudoQR}</Text>
        </View>
        <Text style={styles.qrHint}>Show this code at {drop.restaurantName}</Text>
        <Text style={styles.detailMeta}>Order ID: {orderId}</Text>
        <TouchableOpacity
          style={styles.secondary}
          onPress={() => navigation.popToTop()}
        >
          <Text style={styles.secondaryText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* ================== Navigation ================== */
const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: "#0e0f12" },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#0e0f12" },
          headerTintColor: "#fff",
          contentStyle: { backgroundColor: "#0e0f12" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Dish Dash" }} />
        <Stack.Screen name="DropDetail" component={DropDetailScreen} options={{ title: "Drop" }} />
        <Stack.Screen name="OrderQR" component={OrderQRScreen} options={{ title: "Your Order" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* ================== Styles ================== */
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0e0f12" },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  brand: { color: "#fff", fontSize: 28, fontWeight: "700" },
  subtle: { color: "#a0a4ad", marginTop: 2 },
  listPad: { padding: 16, paddingBottom: 32 },

  card: {
    backgroundColor: "#171a21",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232733",
  },
  image: { width: "100%", height: 160 },
  cardBody: { padding: 12, gap: 6 },
  title: { color: "#fff", fontSize: 18, fontWeight: "600" },
  restaurant: { color: "#a0a4ad" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { color: "#e6ff57", fontWeight: "700", fontSize: 16 },
  badge: { color: "#a0a4ad", fontSize: 12 },
  tags: { color: "#86e3ff", marginTop: 2 },

  detailImage: { width: "100%", height: 240 },
  detailBody: { padding: 16, gap: 8 },
  detailTitle: { color: "#fff", fontSize: 24, fontWeight: "700" },
  detailRestaurant: { color: "#cbd0d8", fontSize: 16 },
  linkish: { color: "#86e3ff", fontSize: 14 },
  detailMeta: { color: "#a0a4ad" },

  dropdown: {
    marginTop: 8,
    backgroundColor: "#12151b",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#2a2f38",
    padding: 10,
    gap: 8,
  },
  optRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#3b4252",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxOn: { backgroundColor: "#00d47e", borderColor: "#00d47e" },
  checkboxMark: { color: "#0b0d10", fontWeight: "800" },
  optText: { color: "#e5e9f0", fontSize: 15 },
  selectedNote: { color: "#a0a4ad", fontSize: 12, marginTop: 4 },

  cta: {
    marginTop: 16,
    backgroundColor: "#00d47e",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  ctaDisabled: { backgroundColor: "#2a2f38" },
  ctaText: { color: "#0b0d10", fontWeight: "800", fontSize: 16 },

  qrCard: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  qrTitle: { color: "#fff", fontSize: 22, fontWeight: "700" },
  qrBox: {
    width: "100%",
    minHeight: 140,
    borderRadius: 12,
    backgroundColor: "#111318",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#232733",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  qrMono: { color: "#fff", fontFamily: "Courier", letterSpacing: 1 },
  qrHint: { color: "#cbd0d8" },
  secondary: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderColor: "#2f3542",
    borderWidth: 1,
  },
  secondaryText: { color: "#cbd0d8", fontWeight: "600" },
});




//MAIZE AND BLUE :       "https://images.unsplash.com/photo-1606756790138-261d2b21cd34?q=80&w=1600&auto=format&fit=crop",
// FLEETWOOD:       "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1600&auto=format&fit=crop",
//SEVA :       "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop",
