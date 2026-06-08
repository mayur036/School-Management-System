---
name: frontend-guidelines
description: Frontend development guidelines: component-based, optimized code, shadcn/ui, tailwind CSS, RTK Query, react-hook-form + zod
metadata:
  type: feedback
---

For all new features and implementation plans on the frontend:
1. **Component-based & Reusable**: Build UI features using a clean component-based layout. Group component logic logically and extract reusable UI parts to `client/src/components/`.
2. **Use shadcn/ui**: Utilize shadcn/ui components (based on Tailwind CSS + Radix UI + Lucide React) for premium styling and accessibility. Use the `bun x shadcn@latest add <component>` CLI command to add new UI blocks rather than recreating basic components from scratch.
3. **Optimized Code**: Write clean, optimized React code. Avoid unnecessary re-renders, use proper hooks (`useMemo`, `useCallback` when appropriate), and leverage RTK Query's caching and auto-invalidation features.
4. **State Management**: Use Redux Toolkit (RTK) and RTK Query for all server-state integration. Do not use React Context for auth or data sharing; use slices (`authSlice`) and RTK Query hooks.
5. **Form Validation**: Use `react-hook-form` along with `zod` for frontend validations. Keep validation schemas clean and centered inside feature schema files.
6. **Polished UI/UX**: Ensure clean transitions, skeleton loaders (`Skeleton`), empty states, and descriptive error toasts via `sonner`.
