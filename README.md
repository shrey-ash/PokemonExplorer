# 🎮 Pokemon Explorer - React Native Expo App

A modern, performant Pokemon explorer mobile application built with React Native Expo. This project demonstrates clean architecture, mobile-first thinking, and robust state management.

## 📋 Technical Assignment Overview

This application was built as a technical assignment to showcase:
- **Clean Architecture** with organized folder structure
- **Mobile-First Thinking** with responsive layouts
- **Robust State Management** using Zustand
- **Performance Optimizations** throughout the codebase

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Navigate to project directory
cd PokemonExplorer

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

After starting Expo, you can run the app on:
- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Physical Device**: Scan the QR code with Expo Go app

---

## 🏗️ Architecture & Folder Structure

```
src/
├── api/                  # API layer with Axios configuration
│   └── pokemonApi.ts     # PokeAPI endpoints and data transformation
│
├── components/           # Reusable UI components
│   ├── StateHandler.tsx  # Loading, Error, Empty state manager
│   ├── PokemonCard.tsx   # Pokemon list item card
│   ├── SearchBar.tsx     # Debounced search input
│   ├── LoadingFooter.tsx # Pagination loading indicator
│   ├── StatBar.tsx       # Animated stat progress bar
│   ├── TypeBadge.tsx     # Pokemon type badge
│   └── index.ts          # Barrel exports
│
├── hooks/                # Custom React hooks
│   ├── useFetchItems.ts  # List fetching with pagination
│   ├── usePokemonDetail.ts # Detail screen data fetching
│   └── index.ts
│
├── navigation/           # React Navigation configuration
│   ├── AppNavigator.tsx  # Stack navigator setup
│   └── index.ts
│
├── screens/              # Application screens
│   ├── PokemonListScreen.tsx   # Main list with search & pagination
│   ├── PokemonDetailScreen.tsx # Detailed Pokemon view
│   └── index.ts
│
├── store/                # Zustand state management
│   └── pokemonStore.ts   # Global state with selectors
│
├── types/                # TypeScript type definitions
│   └── index.ts          # API & UI types
│
└── utils/                # Utility functions and constants
    └── colors.ts         # Theme colors and Pokemon type colors
```

---

## ✨ Core Features

### 1. **List Screen**
- Grid layout with 2 columns
- Optimized FlatList rendering
- Search/filter functionality
- Pull-to-refresh
- Infinite scroll pagination
- Loading, Empty, and Error states

### 2. **Detail Screen**
- Expanded Pokemon information
- Animated stat bars
- Type badges with colors
- Abilities display
- Physical characteristics
- Graceful error handling

### 3. **Search & Filter**
- Debounced input (300ms)
- Local filtering for instant results
- Clear button
- Empty state for no results

### 4. **State Management (Zustand)**
- Lightweight and scalable
- Selector-based subscriptions
- Minimal boilerplate

---

## 🎯 Performance Best Practices

### FlatList Optimizations
```typescript
// Key optimizations used in PokemonListScreen
<FlatList
  windowSize={10}           // Render 10 screens worth of content
  maxToRenderPerBatch={10}  // Render 10 items per batch
  initialNumToRender={10}   // Initial render count
  removeClippedSubviews={true} // Remove items outside viewport
  keyExtractor={keyExtractor}  // Stable keys for efficient updates
/>
```

### Memoization
- `React.memo` on all list item components
- `useCallback` for event handlers
- `useMemo` for computed values
- Custom comparison functions for memo

### State Subscriptions
```typescript
// Instead of subscribing to entire store:
const { pokemonList, isLoading } = usePokemonStore();

// Subscribe to specific slices:
const pokemonList = usePokemonStore((state) => state.filteredList);
const isLoading = usePokemonStore((state) => state.isLoading);
```

---

## 🎨 Architecture Decisions

### 1. **Zustand over Redux**
- Less boilerplate code
- No Provider wrapper needed
- Built-in selector support
- Simpler learning curve

### 2. **Custom Hooks for Data Fetching**
- Encapsulates complex logic
- Reusable across screens
- Easier to test
- Separates concerns from UI

### 3. **StateHandler Component**
- Single source of truth for async states
- Consistent UI across screens
- Reduces code duplication
- Easy to customize per screen

### 4. **Centralized API Layer**
- Single axios instance
- Global error handling
- Data transformation at source
- Easy to mock for testing

### 5. **Type-Safe Navigation**
- RootStackParamList defines all routes
- Compile-time error checking
- Auto-complete support

---

## 📱 Screens Overview

### Pokemon List Screen
| Feature | Implementation |
|---------|---------------|
| Grid Layout | FlatList with numColumns={2} |
| Search | Debounced local filtering |
| Pull-to-Refresh | RefreshControl component |
| Pagination | onEndReached with threshold |
| Loading State | StateHandler with spinner |
| Error State | Retry button with message |
| Empty State | Friendly message with icon |

### Pokemon Detail Screen
| Feature | Implementation |
|---------|---------------|
| Hero Image | Official artwork with fallback |
| Type Badges | Color-coded by type |
| Stats | Animated progress bars |
| Abilities | Hidden ability indicator |
| Physical Info | Height, weight, base XP |
| Error Handling | Retry option |

---

## 🔧 Technical Stack

| Technology | Purpose |
|------------|---------|
| React Native Expo | Cross-platform framework |
| TypeScript | Type safety |
| React Navigation | Screen navigation |
| Zustand | State management |
| Axios | HTTP client |
| PokeAPI | Public API |

---

## 📝 Key Talking Points for Video

1. **Why Zustand?**
   - "I chose Zustand for its minimal boilerplate and excellent performance. Unlike Redux, it doesn't require Provider wrappers and supports selective subscriptions out of the box."

2. **FlatList Optimization**
   - "The FlatList uses several optimization props: windowSize controls virtualization, removeClippedSubviews improves memory usage, and React.memo on list items prevents unnecessary re-renders."

3. **Custom Hooks Pattern**
   - "useFetchItems encapsulates all the data fetching logic, making the component cleaner and the logic reusable. It manages loading, error, pagination, and refresh states."

4. **StateHandler Component**
   - "This modular component handles all async states (loading, error, empty) in one place, ensuring consistent UI and reducing code duplication across screens."

5. **API Architecture**
   - "The API layer uses axios with interceptors for global error handling. Data transformation happens here, keeping components focused on presentation."

---

## 🐛 Error Handling

The app handles errors gracefully at multiple levels:

1. **Network Errors**: Timeout and connection issues show user-friendly messages
2. **API Errors**: Status codes are mapped to descriptive messages
3. **Missing Data**: Fallback UI for null/undefined values
4. **Retry Mechanism**: Error states include a retry button

---

## 📄 License

This project was created as a technical assignment demonstration.

---

## 🙏 Credits

- Pokemon data from [PokeAPI](https://pokeapi.co/)
- Pokemon artwork from PokeAPI sprites repository

