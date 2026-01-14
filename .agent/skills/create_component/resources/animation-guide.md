# Animation Guide (Framer Motion)

## Best Practices

1.  **Always use `layout` prop** for lists or items that change position/size to get automatic smooth transitions.
2.  **Use `initial={false}`** if you don't want an animation on first mount (for state changes).
3.  **Encapsulate variants** outside the component to keep code clean.

## Common Patterns

### 1. Fade Up (Entry)

Great for landing pages.

```tsx
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

<motion.div {...fadeUp}>Content</motion.div>;
```

### 2. Stagger Children

Great for lists or grids.

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.ul variants={container} initial="hidden" animate="show">
  <motion.li variants={item} />
  <motion.li variants={item} />
</motion.ul>;
```

### 3. Micro-Interaction (Hover/Tap)

Great for buttons and cards.

```tsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
  Click me
</motion.button>
```
