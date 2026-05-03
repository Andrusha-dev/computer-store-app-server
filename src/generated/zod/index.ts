import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.NullTypes.DbNull;
  if (v === 'JsonNull') return Prisma.NullTypes.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.string(), z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.any() }),
    z.record(z.string(), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.any(),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','username','firstname','lastname','phone','birthYear','profession','isMarried','role','addressId']);

export const AddressScalarFieldEnumSchema = z.enum(['id','city','street','houseNumber']);

export const ProducerScalarFieldEnumSchema = z.enum(['id','name','logoUrl']);

export const ProductScalarFieldEnumSchema = z.enum(['id','productName','imgUrls','price','description','quantity','category','details','producerId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const UserRoleSchema = z.enum(['guest','user','admin']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const CategorySchema = z.enum(['PROCESSORS','MEMORY','STORAGE','GRAPHIC_CARDS','MOTHERBOARDS','POWER_SUPPLIES']);

export type CategoryType = `${z.infer<typeof CategorySchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserRoleSchema,
  id: z.number().int(),
  email: z.email({ message: "Невірний формат email" }),
  password: z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),
  username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  birthYear: z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),
  profession: z.string(),
  isMarried: z.boolean(),
  addressId: z.number().int().nullable(),
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  address?: AddressWithRelations | null;
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  address: z.lazy(() => AddressWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// ADDRESS SCHEMA
/////////////////////////////////////////

export const AddressSchema = z.object({
  id: z.number().int(),
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
})

export type Address = z.infer<typeof AddressSchema>

// ADDRESS RELATION SCHEMA
//------------------------------------------------------

export type AddressRelations = {
  user?: UserWithRelations | null;
};

export type AddressWithRelations = z.infer<typeof AddressSchema> & AddressRelations

export const AddressWithRelationsSchema: z.ZodType<AddressWithRelations> = AddressSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// PRODUCER SCHEMA
/////////////////////////////////////////

export const ProducerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  logoUrl: z.string().nullable(),
})

export type Producer = z.infer<typeof ProducerSchema>

// PRODUCER RELATION SCHEMA
//------------------------------------------------------

export type ProducerRelations = {
  products: ProductWithRelations[];
};

export type ProducerWithRelations = z.infer<typeof ProducerSchema> & ProducerRelations

export const ProducerWithRelationsSchema: z.ZodType<ProducerWithRelations> = ProducerSchema.merge(z.object({
  products: z.lazy(() => ProductWithRelationsSchema).array(),
}))

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  category: CategorySchema,
  id: z.number().int(),
  productName: z.string(),
  imgUrls: z.string().array(),
  price: z.instanceof(Prisma.Decimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'Product']"}),
  description: z.string(),
  quantity: z.number().int(),
  details: JsonValueSchema,
  producerId: z.number().int().nullable(),
})

export type Product = z.infer<typeof ProductSchema>

// PRODUCT RELATION SCHEMA
//------------------------------------------------------

export type ProductRelations = {
  producer?: ProducerWithRelations | null;
};

export type ProductWithRelations = z.infer<typeof ProductSchema> & ProductRelations

export const ProductWithRelationsSchema: z.ZodType<ProductWithRelations> = ProductSchema.merge(z.object({
  producer: z.lazy(() => ProducerWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  username: z.boolean().optional(),
  firstname: z.boolean().optional(),
  lastname: z.boolean().optional(),
  phone: z.boolean().optional(),
  birthYear: z.boolean().optional(),
  profession: z.boolean().optional(),
  isMarried: z.boolean().optional(),
  role: z.boolean().optional(),
  addressId: z.boolean().optional(),
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
}).strict()

// ADDRESS
//------------------------------------------------------

export const AddressIncludeSchema: z.ZodType<Prisma.AddressInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const AddressArgsSchema: z.ZodType<Prisma.AddressDefaultArgs> = z.object({
  select: z.lazy(() => AddressSelectSchema).optional(),
  include: z.lazy(() => AddressIncludeSchema).optional(),
}).strict();

export const AddressSelectSchema: z.ZodType<Prisma.AddressSelect> = z.object({
  id: z.boolean().optional(),
  city: z.boolean().optional(),
  street: z.boolean().optional(),
  houseNumber: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PRODUCER
//------------------------------------------------------

export const ProducerIncludeSchema: z.ZodType<Prisma.ProducerInclude> = z.object({
  products: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProducerCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ProducerArgsSchema: z.ZodType<Prisma.ProducerDefaultArgs> = z.object({
  select: z.lazy(() => ProducerSelectSchema).optional(),
  include: z.lazy(() => ProducerIncludeSchema).optional(),
}).strict();

export const ProducerCountOutputTypeArgsSchema: z.ZodType<Prisma.ProducerCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProducerCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProducerCountOutputTypeSelectSchema: z.ZodType<Prisma.ProducerCountOutputTypeSelect> = z.object({
  products: z.boolean().optional(),
}).strict();

export const ProducerSelectSchema: z.ZodType<Prisma.ProducerSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  logoUrl: z.boolean().optional(),
  products: z.union([z.boolean(),z.lazy(() => ProductFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProducerCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
  producer: z.union([z.boolean(),z.lazy(() => ProducerArgsSchema)]).optional(),
}).strict();

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
  id: z.boolean().optional(),
  productName: z.boolean().optional(),
  imgUrls: z.boolean().optional(),
  price: z.boolean().optional(),
  description: z.boolean().optional(),
  quantity: z.boolean().optional(),
  category: z.boolean().optional(),
  details: z.boolean().optional(),
  producerId: z.boolean().optional(),
  producer: z.union([z.boolean(),z.lazy(() => ProducerArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  firstname: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  lastname: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  birthYear: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  profession: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isMarried: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema), z.lazy(() => UserRoleSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  address: z.union([ z.lazy(() => AddressNullableScalarRelationFilterSchema), z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
  profession: z.lazy(() => SortOrderSchema).optional(),
  isMarried: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    addressId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
  }),
  z.object({
    id: z.number().int(),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    id: z.number().int(),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  }),
  z.object({
    id: z.number().int(),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    id: z.number().int(),
    addressId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    addressId: z.number().int(),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
  }),
  z.object({
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  }),
  z.object({
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
    addressId: z.number().int(),
  }),
  z.object({
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    addressId: z.number().int(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  email: z.email({ message: "Невірний формат email" }).optional(),
  username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }).optional(),
  phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }).optional(),
  addressId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }) ]).optional(),
  firstname: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  lastname: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  birthYear: z.union([ z.lazy(() => IntFilterSchema), z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }) ]).optional(),
  profession: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isMarried: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleFilterSchema), z.lazy(() => UserRoleSchema) ]).optional(),
  address: z.union([ z.lazy(() => AddressNullableScalarRelationFilterSchema), z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
  profession: z.lazy(() => SortOrderSchema).optional(),
  isMarried: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  firstname: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  lastname: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  phone: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  birthYear: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  profession: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  isMarried: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserRoleWithAggregatesFilterSchema), z.lazy(() => UserRoleSchema) ]).optional(),
  addressId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const AddressWhereInputSchema: z.ZodType<Prisma.AddressWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AddressWhereInputSchema), z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema), z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  houseNumber: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
});

export const AddressOrderByWithRelationInputSchema: z.ZodType<Prisma.AddressOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  houseNumber: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const AddressWhereUniqueInputSchema: z.ZodType<Prisma.AddressWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => AddressWhereInputSchema), z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema), z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  houseNumber: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}));

export const AddressOrderByWithAggregationInputSchema: z.ZodType<Prisma.AddressOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  houseNumber: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AddressCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AddressAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AddressMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AddressMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AddressSumOrderByAggregateInputSchema).optional(),
});

export const AddressScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AddressScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema), z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressScalarWhereWithAggregatesInputSchema), z.lazy(() => AddressScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  city: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  houseNumber: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const ProducerWhereInputSchema: z.ZodType<Prisma.ProducerWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProducerWhereInputSchema), z.lazy(() => ProducerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProducerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProducerWhereInputSchema), z.lazy(() => ProducerWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  products: z.lazy(() => ProductListRelationFilterSchema).optional(),
});

export const ProducerOrderByWithRelationInputSchema: z.ZodType<Prisma.ProducerOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  products: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
});

export const ProducerWhereUniqueInputSchema: z.ZodType<Prisma.ProducerWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    name: z.string(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => ProducerWhereInputSchema), z.lazy(() => ProducerWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProducerWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProducerWhereInputSchema), z.lazy(() => ProducerWhereInputSchema).array() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  products: z.lazy(() => ProductListRelationFilterSchema).optional(),
}));

export const ProducerOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProducerOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ProducerCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProducerAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProducerMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProducerMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProducerSumOrderByAggregateInputSchema).optional(),
});

export const ProducerScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProducerScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProducerScalarWhereWithAggregatesInputSchema), z.lazy(() => ProducerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProducerScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProducerScalarWhereWithAggregatesInputSchema), z.lazy(() => ProducerScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  logoUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  productName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imgUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  producerId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
  producer: z.union([ z.lazy(() => ProducerNullableScalarRelationFilterSchema), z.lazy(() => ProducerWhereInputSchema) ]).optional().nullable(),
});

export const ProductOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  imgUrls: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  producerId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  producer: z.lazy(() => ProducerOrderByWithRelationInputSchema).optional(),
});

export const ProductWhereUniqueInputSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  productName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imgUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  producerId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number().int() ]).optional().nullable(),
  producer: z.union([ z.lazy(() => ProducerNullableScalarRelationFilterSchema), z.lazy(() => ProducerWhereInputSchema) ]).optional().nullable(),
}));

export const ProductOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  imgUrls: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  producerId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputSchema).optional(),
});

export const ProductScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema), z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema), z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  productName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  imgUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  price: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryWithAggregatesFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  details: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  producerId: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  email: z.email({ message: "Невірний формат email" }),
  password: z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),
  username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  birthYear: z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),
  profession: z.string(),
  isMarried: z.boolean().optional(),
  role: z.lazy(() => UserRoleSchema).optional(),
  address: z.lazy(() => AddressCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  email: z.email({ message: "Невірний формат email" }),
  password: z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),
  username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  birthYear: z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),
  profession: z.string(),
  isMarried: z.boolean().optional(),
  role: z.lazy(() => UserRoleSchema).optional(),
  addressId: z.number().int().optional().nullable(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  email: z.union([ z.email({ message: "Невірний формат email" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthYear: z.union([ z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profession: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isMarried: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  address: z.lazy(() => AddressUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.email({ message: "Невірний формат email" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthYear: z.union([ z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profession: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isMarried: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  email: z.email({ message: "Невірний формат email" }),
  password: z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),
  username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  birthYear: z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),
  profession: z.string(),
  isMarried: z.boolean().optional(),
  role: z.lazy(() => UserRoleSchema).optional(),
  addressId: z.number().int().optional().nullable(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  email: z.union([ z.email({ message: "Невірний формат email" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthYear: z.union([ z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profession: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isMarried: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.email({ message: "Невірний формат email" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthYear: z.union([ z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profession: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isMarried: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
  addressId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const AddressCreateInputSchema: z.ZodType<Prisma.AddressCreateInput> = z.strictObject({
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
  user: z.lazy(() => UserCreateNestedOneWithoutAddressInputSchema).optional(),
});

export const AddressUncheckedCreateInputSchema: z.ZodType<Prisma.AddressUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
  user: z.lazy(() => UserUncheckedCreateNestedOneWithoutAddressInputSchema).optional(),
});

export const AddressUpdateInputSchema: z.ZodType<Prisma.AddressUpdateInput> = z.strictObject({
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneWithoutAddressNestedInputSchema).optional(),
});

export const AddressUncheckedUpdateInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUncheckedUpdateOneWithoutAddressNestedInputSchema).optional(),
});

export const AddressCreateManyInputSchema: z.ZodType<Prisma.AddressCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
});

export const AddressUpdateManyMutationInputSchema: z.ZodType<Prisma.AddressUpdateManyMutationInput> = z.strictObject({
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AddressUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProducerCreateInputSchema: z.ZodType<Prisma.ProducerCreateInput> = z.strictObject({
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
  products: z.lazy(() => ProductCreateNestedManyWithoutProducerInputSchema).optional(),
});

export const ProducerUncheckedCreateInputSchema: z.ZodType<Prisma.ProducerUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
  products: z.lazy(() => ProductUncheckedCreateNestedManyWithoutProducerInputSchema).optional(),
});

export const ProducerUpdateInputSchema: z.ZodType<Prisma.ProducerUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  products: z.lazy(() => ProductUpdateManyWithoutProducerNestedInputSchema).optional(),
});

export const ProducerUncheckedUpdateInputSchema: z.ZodType<Prisma.ProducerUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  products: z.lazy(() => ProductUncheckedUpdateManyWithoutProducerNestedInputSchema).optional(),
});

export const ProducerCreateManyInputSchema: z.ZodType<Prisma.ProducerCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
});

export const ProducerUpdateManyMutationInputSchema: z.ZodType<Prisma.ProducerUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ProducerUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProducerUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.strictObject({
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producer: z.lazy(() => ProducerCreateNestedOneWithoutProductsInputSchema).optional(),
});

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producerId: z.number().int().optional().nullable(),
});

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.strictObject({
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producer: z.lazy(() => ProducerUpdateOneWithoutProductsNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producerId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producerId: z.number().int().optional().nullable(),
});

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.strictObject({
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producerId: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const EnumUserRoleFilterSchema: z.ZodType<Prisma.EnumUserRoleFilter> = z.strictObject({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
});

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const AddressNullableScalarRelationFilterSchema: z.ZodType<Prisma.AddressNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => AddressWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AddressWhereInputSchema).optional().nullable(),
});

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
  profession: z.lazy(() => SortOrderSchema).optional(),
  isMarried: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
  profession: z.lazy(() => SortOrderSchema).optional(),
  isMarried: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  firstname: z.lazy(() => SortOrderSchema).optional(),
  lastname: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
  profession: z.lazy(() => SortOrderSchema).optional(),
  isMarried: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
});

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
  addressId: z.lazy(() => SortOrderSchema).optional(),
});

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const EnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserRoleWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
});

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable(),
});

export const AddressCountOrderByAggregateInputSchema: z.ZodType<Prisma.AddressCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  houseNumber: z.lazy(() => SortOrderSchema).optional(),
});

export const AddressAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AddressAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  houseNumber: z.lazy(() => SortOrderSchema).optional(),
});

export const AddressMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  houseNumber: z.lazy(() => SortOrderSchema).optional(),
});

export const AddressMinOrderByAggregateInputSchema: z.ZodType<Prisma.AddressMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  city: z.lazy(() => SortOrderSchema).optional(),
  street: z.lazy(() => SortOrderSchema).optional(),
  houseNumber: z.lazy(() => SortOrderSchema).optional(),
});

export const AddressSumOrderByAggregateInputSchema: z.ZodType<Prisma.AddressSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  houseNumber: z.lazy(() => SortOrderSchema).optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const ProductListRelationFilterSchema: z.ZodType<Prisma.ProductListRelationFilter> = z.strictObject({
  every: z.lazy(() => ProductWhereInputSchema).optional(),
  some: z.lazy(() => ProductWhereInputSchema).optional(),
  none: z.lazy(() => ProductWhereInputSchema).optional(),
});

export const ProductOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ProducerCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProducerCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const ProducerAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProducerAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const ProducerMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProducerMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const ProducerMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProducerMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  logoUrl: z.lazy(() => SortOrderSchema).optional(),
});

export const ProducerSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProducerSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.strictObject({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
});

export const EnumCategoryFilterSchema: z.ZodType<Prisma.EnumCategoryFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryFilterSchema) ]).optional(),
});

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const ProducerNullableScalarRelationFilterSchema: z.ZodType<Prisma.ProducerNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ProducerWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProducerWhereInputSchema).optional().nullable(),
});

export const ProductCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  imgUrls: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  producerId: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  producerId: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  producerId: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  productName: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  category: z.lazy(() => SortOrderSchema).optional(),
  producerId: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  producerId: z.lazy(() => SortOrderSchema).optional(),
});

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional(),
});

export const EnumCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.EnumCategoryWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCategoryFilterSchema).optional(),
});

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional(),
});

export const AddressCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema), z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const EnumUserRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserRoleFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => UserRoleSchema).optional(),
});

export const AddressUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AddressUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema), z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => AddressUpdateWithoutUserInputSchema), z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
});

export const UserCreateNestedOneWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAddressInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema), z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUncheckedCreateNestedOneWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedOneWithoutAddressInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema), z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneWithoutAddressNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutAddressNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema), z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAddressInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAddressInputSchema), z.lazy(() => UserUpdateWithoutAddressInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]).optional(),
});

export const UserUncheckedUpdateOneWithoutAddressNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateOneWithoutAddressNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema), z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAddressInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAddressInputSchema), z.lazy(() => UserUpdateWithoutAddressInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]).optional(),
});

export const ProductCreateNestedManyWithoutProducerInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutProducerInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutProducerInputSchema), z.lazy(() => ProductCreateWithoutProducerInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutProducerInputSchema), z.lazy(() => ProductCreateOrConnectWithoutProducerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyProducerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
});

export const ProductUncheckedCreateNestedManyWithoutProducerInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutProducerInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutProducerInputSchema), z.lazy(() => ProductCreateWithoutProducerInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutProducerInputSchema), z.lazy(() => ProductCreateOrConnectWithoutProducerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyProducerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
});

export const ProductUpdateManyWithoutProducerNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutProducerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutProducerInputSchema), z.lazy(() => ProductCreateWithoutProducerInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutProducerInputSchema), z.lazy(() => ProductCreateOrConnectWithoutProducerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutProducerInputSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutProducerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyProducerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutProducerInputSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutProducerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutProducerInputSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutProducerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
});

export const ProductUncheckedUpdateManyWithoutProducerNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutProducerNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutProducerInputSchema), z.lazy(() => ProductCreateWithoutProducerInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutProducerInputSchema), z.lazy(() => ProductCreateOrConnectWithoutProducerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutProducerInputSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutProducerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyProducerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutProducerInputSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutProducerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutProducerInputSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutProducerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
});

export const ProductCreateimgUrlsInputSchema: z.ZodType<Prisma.ProductCreateimgUrlsInput> = z.strictObject({
  set: z.string().array(),
});

export const ProducerCreateNestedOneWithoutProductsInputSchema: z.ZodType<Prisma.ProducerCreateNestedOneWithoutProductsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProducerCreateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProducerCreateOrConnectWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => ProducerWhereUniqueInputSchema).optional(),
});

export const ProductUpdateimgUrlsInputSchema: z.ZodType<Prisma.ProductUpdateimgUrlsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.strictObject({
  set: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
});

export const EnumCategoryFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCategoryFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => CategorySchema).optional(),
});

export const ProducerUpdateOneWithoutProductsNestedInputSchema: z.ZodType<Prisma.ProducerUpdateOneWithoutProductsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProducerCreateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProducerCreateOrConnectWithoutProductsInputSchema).optional(),
  upsert: z.lazy(() => ProducerUpsertWithoutProductsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProducerWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProducerWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProducerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProducerUpdateToOneWithWhereWithoutProductsInputSchema), z.lazy(() => ProducerUpdateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedUpdateWithoutProductsInputSchema) ]).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedEnumUserRoleFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleFilter> = z.strictObject({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => NestedEnumUserRoleFilterSchema) ]).optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
});

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
});

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const NestedEnumUserRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserRoleWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => UserRoleSchema).optional(),
  in: z.lazy(() => UserRoleSchema).array().optional(),
  notIn: z.lazy(() => UserRoleSchema).array().optional(),
  not: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => NestedEnumUserRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserRoleFilterSchema).optional(),
});

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
});

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
});

export const NestedEnumCategoryFilterSchema: z.ZodType<Prisma.NestedEnumCategoryFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryFilterSchema) ]).optional(),
});

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional(),
});

export const NestedEnumCategoryWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumCategoryWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumCategoryFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumCategoryFilterSchema).optional(),
});

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const AddressCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateWithoutUserInput> = z.strictObject({
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
});

export const AddressUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.number().int().optional(),
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
});

export const AddressCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema), z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
});

export const AddressUpsertWithoutUserInputSchema: z.ZodType<Prisma.AddressUpsertWithoutUserInput> = z.strictObject({
  update: z.union([ z.lazy(() => AddressUpdateWithoutUserInputSchema), z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema), z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => AddressWhereInputSchema).optional(),
});

export const AddressUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AddressUpdateToOneWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AddressWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AddressUpdateWithoutUserInputSchema), z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]),
});

export const AddressUpdateWithoutUserInputSchema: z.ZodType<Prisma.AddressUpdateWithoutUserInput> = z.strictObject({
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AddressUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserCreateWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateWithoutAddressInput> = z.strictObject({
  email: z.email({ message: "Невірний формат email" }),
  password: z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),
  username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  birthYear: z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),
  profession: z.string(),
  isMarried: z.boolean().optional(),
  role: z.lazy(() => UserRoleSchema).optional(),
});

export const UserUncheckedCreateWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAddressInput> = z.strictObject({
  id: z.number().int().optional(),
  email: z.email({ message: "Невірний формат email" }),
  password: z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),
  username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  firstname: z.string(),
  lastname: z.string(),
  phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  birthYear: z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),
  profession: z.string(),
  isMarried: z.boolean().optional(),
  role: z.lazy(() => UserRoleSchema).optional(),
});

export const UserCreateOrConnectWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAddressInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema), z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]),
});

export const UserUpsertWithoutAddressInputSchema: z.ZodType<Prisma.UserUpsertWithoutAddressInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutAddressInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema), z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutAddressInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAddressInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAddressInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]),
});

export const UserUpdateWithoutAddressInputSchema: z.ZodType<Prisma.UserUpdateWithoutAddressInput> = z.strictObject({
  email: z.union([ z.email({ message: "Невірний формат email" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthYear: z.union([ z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profession: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isMarried: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateWithoutAddressInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAddressInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.email({ message: "Невірний формат email" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string().min(8, { message: "Довжина паролю має бути не менше 8 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  firstname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  lastname: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.union([ z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  birthYear: z.union([ z.number().int().min(1900, { message: "Рік народження має бути не меншим ніж 1900" }),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  profession: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isMarried: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserRoleSchema), z.lazy(() => EnumUserRoleFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductCreateWithoutProducerInputSchema: z.ZodType<Prisma.ProductCreateWithoutProducerInput> = z.strictObject({
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
});

export const ProductUncheckedCreateWithoutProducerInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutProducerInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
});

export const ProductCreateOrConnectWithoutProducerInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutProducerInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutProducerInputSchema), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema) ]),
});

export const ProductCreateManyProducerInputEnvelopeSchema: z.ZodType<Prisma.ProductCreateManyProducerInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ProductCreateManyProducerInputSchema), z.lazy(() => ProductCreateManyProducerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const ProductUpsertWithWhereUniqueWithoutProducerInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutProducerInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutProducerInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutProducerInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutProducerInputSchema), z.lazy(() => ProductUncheckedCreateWithoutProducerInputSchema) ]),
});

export const ProductUpdateWithWhereUniqueWithoutProducerInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutProducerInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutProducerInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutProducerInputSchema) ]),
});

export const ProductUpdateManyWithWhereWithoutProducerInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutProducerInput> = z.strictObject({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutProducerInputSchema) ]),
});

export const ProductScalarWhereInputSchema: z.ZodType<Prisma.ProductScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  productName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imgUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  producerId: z.union([ z.lazy(() => IntNullableFilterSchema), z.number() ]).optional().nullable(),
});

export const ProducerCreateWithoutProductsInputSchema: z.ZodType<Prisma.ProducerCreateWithoutProductsInput> = z.strictObject({
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
});

export const ProducerUncheckedCreateWithoutProductsInputSchema: z.ZodType<Prisma.ProducerUncheckedCreateWithoutProductsInput> = z.strictObject({
  id: z.number().int().optional(),
  name: z.string(),
  logoUrl: z.string().optional().nullable(),
});

export const ProducerCreateOrConnectWithoutProductsInputSchema: z.ZodType<Prisma.ProducerCreateOrConnectWithoutProductsInput> = z.strictObject({
  where: z.lazy(() => ProducerWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProducerCreateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedCreateWithoutProductsInputSchema) ]),
});

export const ProducerUpsertWithoutProductsInputSchema: z.ZodType<Prisma.ProducerUpsertWithoutProductsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ProducerUpdateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedUpdateWithoutProductsInputSchema) ]),
  create: z.union([ z.lazy(() => ProducerCreateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedCreateWithoutProductsInputSchema) ]),
  where: z.lazy(() => ProducerWhereInputSchema).optional(),
});

export const ProducerUpdateToOneWithWhereWithoutProductsInputSchema: z.ZodType<Prisma.ProducerUpdateToOneWithWhereWithoutProductsInput> = z.strictObject({
  where: z.lazy(() => ProducerWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProducerUpdateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedUpdateWithoutProductsInputSchema) ]),
});

export const ProducerUpdateWithoutProductsInputSchema: z.ZodType<Prisma.ProducerUpdateWithoutProductsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ProducerUncheckedUpdateWithoutProductsInputSchema: z.ZodType<Prisma.ProducerUncheckedUpdateWithoutProductsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  logoUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ProductCreateManyProducerInputSchema: z.ZodType<Prisma.ProductCreateManyProducerInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
});

export const ProductUpdateWithoutProducerInputSchema: z.ZodType<Prisma.ProductUpdateWithoutProducerInput> = z.strictObject({
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export const ProductUncheckedUpdateWithoutProducerInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutProducerInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export const ProductUncheckedUpdateManyWithoutProducerInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutProducerInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Omit<Prisma.UserFindFirstArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.UserFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Omit<Prisma.UserFindManyArgs, "select" | "include">> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Omit<Prisma.UserFindUniqueArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.UserFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema, 
}).strict();

export const AddressFindFirstArgsSchema: z.ZodType<Omit<Prisma.AddressFindFirstArgs, "select" | "include">> = z.object({
  where: AddressWhereInputSchema.optional(), 
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(), AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema, AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AddressFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.AddressFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: AddressWhereInputSchema.optional(), 
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(), AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema, AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AddressFindManyArgsSchema: z.ZodType<Omit<Prisma.AddressFindManyArgs, "select" | "include">> = z.object({
  where: AddressWhereInputSchema.optional(), 
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(), AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AddressScalarFieldEnumSchema, AddressScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AddressAggregateArgsSchema: z.ZodType<Prisma.AddressAggregateArgs> = z.object({
  where: AddressWhereInputSchema.optional(), 
  orderBy: z.union([ AddressOrderByWithRelationInputSchema.array(), AddressOrderByWithRelationInputSchema ]).optional(),
  cursor: AddressWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AddressGroupByArgsSchema: z.ZodType<Prisma.AddressGroupByArgs> = z.object({
  where: AddressWhereInputSchema.optional(), 
  orderBy: z.union([ AddressOrderByWithAggregationInputSchema.array(), AddressOrderByWithAggregationInputSchema ]).optional(),
  by: AddressScalarFieldEnumSchema.array(), 
  having: AddressScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AddressFindUniqueArgsSchema: z.ZodType<Omit<Prisma.AddressFindUniqueArgs, "select" | "include">> = z.object({
  where: AddressWhereUniqueInputSchema, 
}).strict();

export const AddressFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.AddressFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: AddressWhereUniqueInputSchema, 
}).strict();

export const ProducerFindFirstArgsSchema: z.ZodType<Omit<Prisma.ProducerFindFirstArgs, "select" | "include">> = z.object({
  where: ProducerWhereInputSchema.optional(), 
  orderBy: z.union([ ProducerOrderByWithRelationInputSchema.array(), ProducerOrderByWithRelationInputSchema ]).optional(),
  cursor: ProducerWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProducerScalarFieldEnumSchema, ProducerScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProducerFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.ProducerFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: ProducerWhereInputSchema.optional(), 
  orderBy: z.union([ ProducerOrderByWithRelationInputSchema.array(), ProducerOrderByWithRelationInputSchema ]).optional(),
  cursor: ProducerWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProducerScalarFieldEnumSchema, ProducerScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProducerFindManyArgsSchema: z.ZodType<Omit<Prisma.ProducerFindManyArgs, "select" | "include">> = z.object({
  where: ProducerWhereInputSchema.optional(), 
  orderBy: z.union([ ProducerOrderByWithRelationInputSchema.array(), ProducerOrderByWithRelationInputSchema ]).optional(),
  cursor: ProducerWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProducerScalarFieldEnumSchema, ProducerScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProducerAggregateArgsSchema: z.ZodType<Prisma.ProducerAggregateArgs> = z.object({
  where: ProducerWhereInputSchema.optional(), 
  orderBy: z.union([ ProducerOrderByWithRelationInputSchema.array(), ProducerOrderByWithRelationInputSchema ]).optional(),
  cursor: ProducerWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProducerGroupByArgsSchema: z.ZodType<Prisma.ProducerGroupByArgs> = z.object({
  where: ProducerWhereInputSchema.optional(), 
  orderBy: z.union([ ProducerOrderByWithAggregationInputSchema.array(), ProducerOrderByWithAggregationInputSchema ]).optional(),
  by: ProducerScalarFieldEnumSchema.array(), 
  having: ProducerScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProducerFindUniqueArgsSchema: z.ZodType<Omit<Prisma.ProducerFindUniqueArgs, "select" | "include">> = z.object({
  where: ProducerWhereUniqueInputSchema, 
}).strict();

export const ProducerFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.ProducerFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: ProducerWhereUniqueInputSchema, 
}).strict();

export const ProductFindFirstArgsSchema: z.ZodType<Omit<Prisma.ProductFindFirstArgs, "select" | "include">> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.ProductFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductFindManyArgsSchema: z.ZodType<Omit<Prisma.ProductFindManyArgs, "select" | "include">> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductAggregateArgsSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProductGroupByArgsSchema: z.ZodType<Prisma.ProductGroupByArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithAggregationInputSchema.array(), ProductOrderByWithAggregationInputSchema ]).optional(),
  by: ProductScalarFieldEnumSchema.array(), 
  having: ProductScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProductFindUniqueArgsSchema: z.ZodType<Omit<Prisma.ProductFindUniqueArgs, "select" | "include">> = z.object({
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.ProductFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Omit<Prisma.UserCreateArgs, "select" | "include">> = z.object({
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Omit<Prisma.UserUpsertArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Omit<Prisma.UserDeleteArgs, "select" | "include">> = z.object({
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Omit<Prisma.UserUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AddressCreateArgsSchema: z.ZodType<Omit<Prisma.AddressCreateArgs, "select" | "include">> = z.object({
  data: z.union([ AddressCreateInputSchema, AddressUncheckedCreateInputSchema ]),
}).strict();

export const AddressUpsertArgsSchema: z.ZodType<Omit<Prisma.AddressUpsertArgs, "select" | "include">> = z.object({
  where: AddressWhereUniqueInputSchema, 
  create: z.union([ AddressCreateInputSchema, AddressUncheckedCreateInputSchema ]),
  update: z.union([ AddressUpdateInputSchema, AddressUncheckedUpdateInputSchema ]),
}).strict();

export const AddressCreateManyArgsSchema: z.ZodType<Prisma.AddressCreateManyArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema, AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AddressCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AddressCreateManyAndReturnArgs> = z.object({
  data: z.union([ AddressCreateManyInputSchema, AddressCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const AddressDeleteArgsSchema: z.ZodType<Omit<Prisma.AddressDeleteArgs, "select" | "include">> = z.object({
  where: AddressWhereUniqueInputSchema, 
}).strict();

export const AddressUpdateArgsSchema: z.ZodType<Omit<Prisma.AddressUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ AddressUpdateInputSchema, AddressUncheckedUpdateInputSchema ]),
  where: AddressWhereUniqueInputSchema, 
}).strict();

export const AddressUpdateManyArgsSchema: z.ZodType<Prisma.AddressUpdateManyArgs> = z.object({
  data: z.union([ AddressUpdateManyMutationInputSchema, AddressUncheckedUpdateManyInputSchema ]),
  where: AddressWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AddressUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AddressUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AddressUpdateManyMutationInputSchema, AddressUncheckedUpdateManyInputSchema ]),
  where: AddressWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AddressDeleteManyArgsSchema: z.ZodType<Prisma.AddressDeleteManyArgs> = z.object({
  where: AddressWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProducerCreateArgsSchema: z.ZodType<Omit<Prisma.ProducerCreateArgs, "select" | "include">> = z.object({
  data: z.union([ ProducerCreateInputSchema, ProducerUncheckedCreateInputSchema ]),
}).strict();

export const ProducerUpsertArgsSchema: z.ZodType<Omit<Prisma.ProducerUpsertArgs, "select" | "include">> = z.object({
  where: ProducerWhereUniqueInputSchema, 
  create: z.union([ ProducerCreateInputSchema, ProducerUncheckedCreateInputSchema ]),
  update: z.union([ ProducerUpdateInputSchema, ProducerUncheckedUpdateInputSchema ]),
}).strict();

export const ProducerCreateManyArgsSchema: z.ZodType<Prisma.ProducerCreateManyArgs> = z.object({
  data: z.union([ ProducerCreateManyInputSchema, ProducerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ProducerCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProducerCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProducerCreateManyInputSchema, ProducerCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ProducerDeleteArgsSchema: z.ZodType<Omit<Prisma.ProducerDeleteArgs, "select" | "include">> = z.object({
  where: ProducerWhereUniqueInputSchema, 
}).strict();

export const ProducerUpdateArgsSchema: z.ZodType<Omit<Prisma.ProducerUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ ProducerUpdateInputSchema, ProducerUncheckedUpdateInputSchema ]),
  where: ProducerWhereUniqueInputSchema, 
}).strict();

export const ProducerUpdateManyArgsSchema: z.ZodType<Prisma.ProducerUpdateManyArgs> = z.object({
  data: z.union([ ProducerUpdateManyMutationInputSchema, ProducerUncheckedUpdateManyInputSchema ]),
  where: ProducerWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProducerUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ProducerUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ProducerUpdateManyMutationInputSchema, ProducerUncheckedUpdateManyInputSchema ]),
  where: ProducerWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProducerDeleteManyArgsSchema: z.ZodType<Prisma.ProducerDeleteManyArgs> = z.object({
  where: ProducerWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProductCreateArgsSchema: z.ZodType<Omit<Prisma.ProductCreateArgs, "select" | "include">> = z.object({
  data: z.union([ ProductCreateInputSchema, ProductUncheckedCreateInputSchema ]),
}).strict();

export const ProductUpsertArgsSchema: z.ZodType<Omit<Prisma.ProductUpsertArgs, "select" | "include">> = z.object({
  where: ProductWhereUniqueInputSchema, 
  create: z.union([ ProductCreateInputSchema, ProductUncheckedCreateInputSchema ]),
  update: z.union([ ProductUpdateInputSchema, ProductUncheckedUpdateInputSchema ]),
}).strict();

export const ProductCreateManyArgsSchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema, ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ProductCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema, ProductCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ProductDeleteArgsSchema: z.ZodType<Omit<Prisma.ProductDeleteArgs, "select" | "include">> = z.object({
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductUpdateArgsSchema: z.ZodType<Omit<Prisma.ProductUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ ProductUpdateInputSchema, ProductUncheckedUpdateInputSchema ]),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductUpdateManyArgsSchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema, ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProductUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ProductUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema, ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProductDeleteManyArgsSchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();