import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from 'zod'; //schema validation library it allows to pass in at run-times any object and then parse it to make to sure the type is what we except
import sharp from 'sharp'
import { db } from "@/db";

const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  //We take in input we then pass it through the middleware and finally we can receive it in onUploadComplete 

  imageUploader: f({ image: { maxFileSize: "8MB" } })
  .input(z.object({configId: z.string().optional() }))
    .middleware(async ({ input }) => {
      return {input}
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const {configId} = metadata.input

      const res = await fetch(file.url)
      const buffer = await res.arrayBuffer()

      const imgMetadata = await sharp(buffer).metadata()
      const {width, height} = imgMetadata

      if(!configId){
        const configuration = await db.configuration.create({
          data:{
            imageUrl : file.url,
            height : height || 500,
            width : width || 500
          }
        }) 

        return {configId: configuration.id}
      }else{
        const updatedConfiguration = await db.configuration.update({
          where:{
            id: configId,
          },
          data:{
            croppedImageUrl: file.url
          }
        })

        return {configId: updatedConfiguration.id}
      }
    }), 
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;