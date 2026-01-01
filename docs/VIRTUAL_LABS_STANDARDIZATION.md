# 🔬 Virtual Labs Standardization Guide

**Date:** January 2025  
**Purpose:** Standardize all Virtual Labs with premium design and consistent supplies collection

---

## 📋 Overview

All Virtual Labs should now use:
1. **Standardized `LabSupplies` Component** - Consistent supplies collection UI
2. **Premium Design System** - Enhanced visual design throughout
3. **Consistent User Experience** - Same interaction patterns across all labs

---

## 🎨 Premium Design Enhancements

### **Visual Improvements:**
- ✅ Gradient backgrounds with animated effects
- ✅ Premium card designs with backdrop blur
- ✅ Smooth animations and transitions
- ✅ Consistent color schemes per subject
- ✅ Enhanced typography with gradient text
- ✅ Professional shadows and borders
- ✅ Responsive grid layouts

### **User Experience:**
- ✅ Clear progress indicators
- ✅ Visual feedback on interactions
- ✅ Celebration effects (confetti)
- ✅ Smooth state transitions
- ✅ Accessible hover states
- ✅ Mobile-responsive design

---

## 🧪 Standardized Supplies Component

### **Usage:**

```tsx
import { LabSupplies, SupplyItem } from '@/components/virtual-labs/LabSupplies';

// Define your supplies
const supplies: SupplyItem[] = [
  {
    id: 'battery',
    name: 'Battery',
    emoji: '🔋',
    description: 'Power source for the circuit',
    required: true
  },
  {
    id: 'bulbs',
    name: 'Light Bulbs',
    emoji: '💡',
    description: 'For observing current flow',
    required: true
  },
  // ... more supplies
];

// In your component
const [collectedItems, setCollectedItems] = useState<string[]>([]);

const handleCollect = (itemId: string) => {
  if (!collectedItems.includes(itemId)) {
    setCollectedItems([...collectedItems, itemId]);
    // Optional: Show toast notification
    toast({ title: `✅ ${supplies.find(s => s.id === itemId)?.name} Collected` });
  }
};

const handleAllCollected = () => {
  // Proceed to next step
  setCurrentStep('experiment');
};

// Render
<LabSupplies
  supplies={supplies}
  collectedItems={collectedItems}
  onCollect={handleCollect}
  showSupplies={currentStep === 'collect-supplies'}
  requiredCount={supplies.filter(s => s.required !== false).length}
  onAllCollected={handleAllCollected}
/>
```

### **Features:**
- ✅ Progress bar showing collection status
- ✅ Visual feedback on collection (checkmarks, animations)
- ✅ Optional items support
- ✅ Automatic progression when all required items collected
- ✅ Celebration effects
- ✅ Responsive grid layout
- ✅ Premium styling

---

## 🔄 Migration Guide

### **Step 1: Replace Custom Supplies UI**

**Before:**
```tsx
<Card className="border-2 border-amber-200">
  <CardHeader>
    <CardTitle>Lab Supplies</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Custom supplies collection UI */}
  </CardContent>
</Card>
```

**After:**
```tsx
<LabSupplies
  supplies={supplies}
  collectedItems={collectedItems}
  onCollect={handleCollect}
  showSupplies={currentStep === 'collect-supplies'}
/>
```

### **Step 2: Update State Management**

**Before:**
```tsx
const [batteryCollected, setBatteryCollected] = useState(false);
const [bulbsCollected, setBulbsCollected] = useState(false);
// ... individual state for each item
```

**After:**
```tsx
const [collectedItems, setCollectedItems] = useState<string[]>([]);
```

### **Step 3: Update Collection Handlers**

**Before:**
```tsx
const handleCollectBattery = () => {
  setBatteryCollected(true);
  toast({ title: '✅ Battery Collected' });
};
```

**After:**
```tsx
const handleCollect = (itemId: string) => {
  if (!collectedItems.includes(itemId)) {
    setCollectedItems([...collectedItems, itemId]);
    const supply = supplies.find(s => s.id === itemId);
    toast({ title: `✅ ${supply?.name} Collected` });
  }
};
```

---

## 🎯 Design Standards

### **Color Schemes by Subject:**

- **Biology:** Green gradients (`from-green-500 to-emerald-600`)
- **Chemistry:** Orange/Amber gradients (`from-orange-500 to-amber-600`)
- **Physics:** Blue/Indigo gradients (`from-blue-500 to-indigo-600`)

### **Card Styling:**
```tsx
className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-2xl"
```

### **Gradient Text:**
```tsx
className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 bg-clip-text text-transparent"
```

### **Animated Backgrounds:**
```tsx
<div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
  <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-300/20 via-violet-300/20 to-indigo-300/20 rounded-full blur-3xl animate-pulse"></div>
</div>
```

---

## ✅ Checklist for Lab Updates

- [ ] Replace custom supplies UI with `LabSupplies` component
- [ ] Update state management to use `collectedItems` array
- [ ] Add premium card styling
- [ ] Add gradient backgrounds
- [ ] Add animated effects
- [ ] Ensure responsive design
- [ ] Add progress indicators
- [ ] Test supplies collection flow
- [ ] Verify celebration effects
- [ ] Check mobile responsiveness

---

## 📝 Example: Simple Circuits Lab

See `src/components/virtual-labs/simple-circuit-lab-enhanced.tsx` for a complete example of:
- Using `LabSupplies` component
- Premium design implementation
- State management
- User interactions

---

**Last Updated:** January 2025

