"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";

export async function updateCustomerProfile(data) {
  try {

    const user = await requireUser();

    if (!user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const {
      first_name,
      last_name,
      phone,
      whatsapp,
      imageUrls,
    } = data;

    let imageGalleryId = null;

    /* If image uploaded */
    if (imageUrls?.length) {
      const img = await prisma.image_gallery.create({
        data: {
          url: imageUrls[0],
        },
      });

      imageGalleryId = img.id;
    }

    await prisma.customer_list.update({
      where: {
        email: user.email,
      },
      data: {
        first_name,
        last_name,
        phone,
        whatsapp,
        ...(imageGalleryId && {
          image_gallery_id: imageGalleryId,
        }),
      },
    });

    return {
      success: true,
      message: "Profile updated successfully",
    };

  } catch (error) {
    console.error("Update profile error:", error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}