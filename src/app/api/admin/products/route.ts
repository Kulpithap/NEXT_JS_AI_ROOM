import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ProductSchema } from "@/lib/validations/product";

async function isAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session && (session.user as any).role === "admin";
}

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          name: { contains: search },
        },
        include: { category: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: "desc" },
      }),
      prisma.product.count({
        where: { name: { contains: search } },
      }),
    ]);

    const serializedProducts = products.map((p) => ({
      ...p,
      price: Number(p.price),
    }));

    return NextResponse.json({
      products: serializedProducts,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = ProductSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        name: validated.name,
        description: validated.description,
        price: validated.price,
        categoryId: validated.categoryId,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
