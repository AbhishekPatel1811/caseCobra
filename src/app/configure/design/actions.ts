'use server'

import { db } from "@/db";
import { CaseColor, CaseFinish, CaseMaterial, PhoneModel } from "@prisma/client";


export type SaveConfigArgs = {
     color: CaseColor, 
     finish: CaseFinish, 
     material: CaseMaterial, 
     model: PhoneModel, 
     configId: string
}

//remote procedure call is a protocol that allows a computer program to execute a procedure or function on another computer or server
export async function saveConfig({
     color, 
     finish, 
     material, 
     model, 
     configId
}:SaveConfigArgs) {
      await db.configuration.update({
          where:{id: configId},
          data:{color, finish, material, model}
     })
}