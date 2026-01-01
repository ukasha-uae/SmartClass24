# Resume Work Guide

## Quick Start

When you return, follow these steps to continue upgrading Virtual Labs:

### 1. Check Progress
```bash
# View the progress document
cat docs/VIRTUAL_LABS_UPGRADE_PROGRESS.md
```

### 2. Find Next Lab
- Open `src/lib/virtual-labs-data.ts`
- Look for labs that haven't been upgraded yet
- Check the component import to find the lab file
- Example: `ThermalExpansionLabEnhanced` → `src/components/virtual-labs/thermal-expansion-lab-enhanced.tsx`

### 3. Upgrade the Lab
Follow the standard checklist in `docs/VIRTUAL_LABS_UPGRADE_PROGRESS.md`:
- Replace supplies collection with `LabSupplies` component
- Add premium animated background
- Enhance all cards
- Enhance buttons
- Add full "Lab Complete!" section
- Remove pending transitions
- Test thoroughly

### 4. Test & Commit
```bash
# Test the lab at http://localhost:9002/virtual-labs/[lab-slug]
# Then commit
git add .
git commit -m "Upgrade [Lab Name] with premium design"
git push
```

### 5. Update Progress
- Update `docs/VIRTUAL_LABS_UPGRADE_PROGRESS.md` with completed lab
- Mark it as ✅ in the document

---

## Current Status

**Last Completed:** Evaporation of Liquids (`evaporation-of-liquids`)
- ✅ Premium flame visualization
- ✅ Fixed evaporation logic (natural vs accelerated)
- ✅ All premium design elements applied

**Next Lab to Upgrade:** 
- Check `docs/VIRTUAL_LABS_UPGRADE_PROGRESS.md` for remaining labs
- Likely candidates: Thermal Expansion, Expansion of Air, or Chemistry labs

---

## Key Files

- **Progress Tracker:** `docs/VIRTUAL_LABS_UPGRADE_PROGRESS.md`
- **Lab Data:** `src/lib/virtual-labs-data.ts`
- **Lab Components:** `src/components/virtual-labs/[lab-name]-enhanced.tsx`
- **Supplies Component:** `src/components/virtual-labs/LabSupplies.tsx`

---

## Reference Labs (Quality Standards)

Use these as references for premium design:
- Simple Circuits: `http://localhost:9002/virtual-labs/simple-circuits`
- Food Tests: `http://localhost:9002/virtual-labs/food-tests`
- Condensation: `http://localhost:9002/virtual-labs/condensation`
- Evaporation: `http://localhost:9002/virtual-labs/evaporation-of-liquids`

---

## Quick Commands

```bash
# Check git status
git status

# View recent commits
git log --oneline -10

# Start dev server (if needed)
npm run dev

# Check for lint errors
npm run lint
```

---

**All changes are committed and pushed. Ready to resume! 🚀**

