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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const validated = ProductSchema.parse(body);

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
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
    if (error.code === 'P2025') {
      return new NextResponse("Product not found", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const { id } = await params;
    const productId = parseInt(id);

    const orderItemsCount = await prisma.orderItem.count({
      where: { productId },
    });

    if (orderItemsCount > 0) {
      return new NextResponse("Cannot delete product that has order items", { status: 400 });
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return new NextResponse("Product not found", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
