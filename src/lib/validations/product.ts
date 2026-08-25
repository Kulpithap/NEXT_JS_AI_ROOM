import { z } from "zod";

export const ProductSchema = z.object({
  name: z.string().min(1, "ชื่อสินค้าจำเป็นต้องระบุ"),
  description: z.string().optional(),
  price: z.coerce.number().gt(0, "ราคาต้องมากกว่า 0"),
  categoryId: z.coerce.number().min(1, "กรุณาเลือกหมวดหมู่"),
});

export type ProductInput = z.infer<typeof ProductSchema>;
