'use server';

import { redirect } from 'next/navigation';
import { profileSchema } from './schemas';
import postgres from 'postgres';
import { v4 } from 'uuid';
import { getBaseUrl } from './chat';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function editUserProfile(prevState: any, formData: FormData) {
  const validatedFields = profileSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { user_id, firstname, lastname, profile_picture } = validatedFields.data;
  let samePhotoUploaded = false; // duplicate picture checker
  const baseUrl = await getBaseUrl();

  try {
    // checking if there is a picture being uploaded
    if (profile_picture?.size !== 0) {

      // checking for an existing profile picture
      const profilePictureQuery = await sql`
        SELECT url from user_profile_pictures
        WHERE user_id = ${user_id};
      `

      // if there is an existing profile picture, check if the incoming upload is a duplicate
      if (profilePictureQuery[0]) {
        const url = profilePictureQuery[0].url;
        const splitUrl = url.split('/');
        const fileName = splitUrl[splitUrl.length - 1];
        if ((profile_picture as File).name == fileName.toLowerCase()) samePhotoUploaded = true;
      }

      // if there are no duplicates, run the S3 upload API, otherwise skip this block
      if (!samePhotoUploaded) {

        // if there is an existing picture, but not duplicate, delete it
        if (profilePictureQuery[0]) {
          const url = profilePictureQuery[0].url;
          const splitUrl = url.split('/');
          const key = splitUrl[splitUrl.length - 1];
          const s3CallDelete = await fetch(`${baseUrl}/api/s3-delete`, {
            method: 'POST',
            body: JSON.stringify({
              key: key
            }),
          });
          const response = await s3CallDelete.json();
          if (!response.success) throw new Error(`Couldn't delete image from S3.`)
          await sql`
            DELETE FROM user_profile_pictures
            WHERE url = ${url} AND user_id = ${user_id};
          `
        }

        const s3CallUpload = await fetch(`${baseUrl}/api/s3-upload`, {
          method: 'POST',
          body: formData,
        });
    
        const response = await s3CallUpload.json();
        const data: { key: string; url: string } = response.data;
        const pictureId = v4();
    
        await sql`
          INSERT INTO user_profile_pictures
          (id, user_id, url)
          VALUES
          (${pictureId}, ${user_id}, ${data.url});
        `;
      }
    }

    console.log(`aaaaaaaaaaaaaaaaaa`)
    await sql`
      UPDATE users
      SET
        firstname = ${firstname},
        lastname = ${lastname}
      WHERE id = ${user_id};
    `;
  } catch (error) {
    throw new Error(`Couldn't edit user profile. ${error}`);
  }
  redirect(`/dashboard/profile?edit_success=true`);
}
