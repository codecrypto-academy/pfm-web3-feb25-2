import { z } from 'zod'

export const RoleSchema = z.enum(["admin", "manufacturer", "supplier", "customer", "recycler", "retailer"])

export const UserSchema = z.object(
    {
        ethereumAddress : z.string(),
        role : RoleSchema
    }
)

export const ComponentSchema = z.object(
    {
        manufacturer : z.string(),
        seriesNumber : z.number(),
        type : z.string(),
        manufactureDate : z.string(),
        materialContent : z.array(z.string()),
        owner : z.string().nullable(),
        amount : z.number().min(0)
    }
)

export const PhoneSchema = z.object({
    imei : z.string(),
    manufacturer : z.string(),
    model : z.string(),
    seriesNumber : z.number(),
    manufactureDate : z.string(),
    components : z.array(ComponentSchema), 
    amount : z.number().max(1).min(0),
    owner : z.string().nullable()
})

export type Component = z.infer<typeof ComponentSchema>;
export type Phone = z.infer<typeof PhoneSchema>;
export type User = z.infer<typeof UserSchema>;
export type Role = z.infer<typeof RoleSchema>;