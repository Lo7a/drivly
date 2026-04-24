# רכבים מומלצים (Featured Cars)

פיצ'ר מנוהל-אדמין להצגת רכבים נבחרים בדף הבית. האדמין בוחר סוחר, בוחר רכבים שלו, וקובע סדר הצגה בגרירה.

## דרישות

- רק ADMIN רואה ומנהל את המסך
- בחירת סוחר (מתוך מאושרים) → רשימת הרכבים שלו
- הוספה / הסרה של רכבים מהרשימה המומלצת
- סדר הצגה נקבע בגרירה (drag & drop)
- בדף הבית: פריסה דינמית לפי כמות הרכבים שנבחרו

### פריסת Grid בדף הבית

| כמות | דסקטופ | טאבלט | מובייל |
|------|--------|-------|--------|
| 1 | 1 עמודה (רוחב מלא) | 1 | 1 |
| 2 | 2 עמודות (חצי-חצי) | 2 | 1 |
| 3 | 3 עמודות | 2 | 1 |
| 4+ | 4 עמודות (שורות נפתחות אוטומטית) | 2 | 1 |

דוגמאות: 5 רכבים → 4+1, 8 רכבים → 4+4.

## מודל נתונים

שינוי ב-`Car`:

```prisma
model Car {
  // ...
  isFeatured     Boolean  @default(false)
  featuredOrder  Int?     // null אם לא מומלץ, אחרת סדר 0..N
  // ...

  @@index([isFeatured, featuredOrder])
}
```

מיגרציה: `pnpm db:migrate` בשם `add_featured_cars`.

## API

כל הroutes תחת `/api/admin/featured/` — הרשאה ADMIN בלבד.

| Method | Path | גוף | פעולה |
|--------|------|-----|-------|
| `GET` | `/api/admin/featured` | — | רשימת כל הרכבים המומלצים (ממוינים לפי `featuredOrder`) |
| `POST` | `/api/admin/featured` | `{ carId }` | סמן רכב כמומלץ (מוסיף בסוף הרשימה) |
| `DELETE` | `/api/admin/featured/[carId]` | — | הסר רכב מהמומלצים + דחיסת הסדר |
| `PATCH` | `/api/admin/featured/reorder` | `{ orderedIds: string[] }` | עדכון הסדר של כל הרשימה |

### פרטי מימוש

- `POST` משתמש ב-transaction: קורא את ה-`MAX(featuredOrder)` ומוסיף `+1`
- `DELETE` מוריד את `isFeatured=false` ו-`featuredOrder=null`, ואז מעדכן את כל השאר (`featuredOrder - 1` לכל מי שהיה מעליו) — transaction
- `PATCH /reorder` מקבל את הסדר המלא ומעדכן בחבילה אחת

## UI אדמין — `/admin/featured`

חלוקה לשני עמודות (בדסקטופ) / שני סקשנים (במובייל):

### שמאל — "בחר רכבים להוספה"
1. Dropdown בחירת סוחר (רק מאושרים)
2. רשימת הרכבים של אותו סוחר (תמונה + make/model/שנה/מחיר)
3. לכל רכב: כפתור "הוסף למומלצים" (או "הסר" אם כבר שם)
4. סטטוס ויזואלי: רכב שכבר מומלץ מסומן בברור

### ימין — "רכבים מומלצים בדף הבית"
1. כותרת + ספירה (`5/∞`)
2. רשימה מסודרת עם drag handle בכל שורה (dnd-kit)
3. תמונה קטנה + שם רכב + שם סוחר + כפתור X להסרה מהירה
4. על שחרור גרירה → קריאת `PATCH /reorder`
5. הודעת "אין רכבים מומלצים" כשהרשימה ריקה

### ספריות
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` (הותקנו)
- `sonner` לטוסטים (קיים בפרויקט)

## דף הבית — שינויים

1. Server Component חדש / עדכון ה-existing: `getFeaturedCars()` שמחזיר לפי `isFeatured=true` ממוין לפי `featuredOrder`
2. אם הרשימה ריקה → fallback ל-"אחרונים שנוספו" (הדפוס הנוכחי) או הסתרה מלאה
3. Grid class dynamic:
   ```tsx
   const gridCols = count === 1 ? "grid-cols-1"
     : count === 2 ? "grid-cols-1 md:grid-cols-2"
     : count === 3 ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
     : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
   ```

## ניווט אדמין

הוספת קישור `רכבים מומלצים` בסיידבר של `app/(admin)/layout.tsx`, עם אייקון `Star` מ-lucide.

## סדר עבודה

1. ✅ התקנת dnd-kit
2. עדכון schema + migration
3. API routes (GET/POST/DELETE/PATCH reorder)
4. קומפוננטת גרירה `FeaturedList.tsx`
5. קומפוננטת בחירת-רכבים `DealerCarPicker.tsx`
6. דף `/admin/featured/page.tsx`
7. הוספת לינק לסיידבר
8. עדכון דף הבית — שאילתה + grid דינמי
9. `pnpm build` ומעבר על טייפים
10. קומיט יחיד: `Featured cars managed by admin with drag-ordering`

## חזרה אחורה (Rollback)

```bash
git revert <commit-sha>
# או אם עדיין לא נדחף:
git reset --hard HEAD~1
```

המיגרציה הפוכה דורשת `DROP COLUMN isFeatured, featuredOrder` — אם נעשה revert לפני deploy אפשר למחוק את קובץ המיגרציה ולהריץ `pnpm db:push`.
