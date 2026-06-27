import { z } from 'zod';
import { JsonValue, InputJsonValue, objectEnumValues, Decimal as PrismaDecimal, DecimalJsLike } from '@prisma/client/runtime/library';
import type { Prisma } from '../../../prisma/generated';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = JsonValue | null | 'JsonNull' | 'DbNull' | typeof objectEnumValues.instances.DbNull | typeof objectEnumValues.instances.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return typeof objectEnumValues.instances.DbNull;
  if (v === 'JsonNull') return typeof objectEnumValues.instances.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
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

export const InputJsonValueSchema: z.ZodType<InputJsonValue> = z.lazy(() =>
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

export const DecimalJsLikeSchema: z.ZodType<DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.any(),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | DecimalJsLike): v is string | number | DecimalJsLike => {
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

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','username','firstname','lastname','phone','birthYear','profession','isMarried','role']);

export const AddressScalarFieldEnumSchema = z.enum(['id','city','street','houseNumber']);

export const ProductScalarFieldEnumSchema = z.enum(['id','productName','imgUrls','price','description','quantity','category','details','producerId']);

export const ProducerScalarFieldEnumSchema = z.enum(['id','name','logoUrl']);

export const CartScalarFieldEnumSchema = z.enum(['id']);

export const CartItemScalarFieldEnumSchema = z.enum(['id','quantity','cartId','productId']);

export const OrderScalarFieldEnumSchema = z.enum(['id','status','totalAmount','userId']);

export const OrderItemScalarFieldEnumSchema = z.enum(['id','quantity','price','productId','orderId']);

export const PaymentScalarFieldEnumSchema = z.enum(['id','status','method','amount','provider','externalId','orderId']);

export const DeliveryScalarFieldEnumSchema = z.enum(['id','method','price','trackingNumber','details','orderId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? NullTypes.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? NullTypes.JsonNull : value === 'DbNull' ? NullTypes.DbNull : value === 'AnyNull' ? NullTypes.AnyNull : value);

export const NullsOrderSchema = z.enum(['first','last']);

export const UserRoleSchema = z.enum(['guest','user','admin']);

export type UserRoleType = `${z.infer<typeof UserRoleSchema>}`

export const CategorySchema = z.enum(['PROCESSORS','MEMORY','STORAGE','GRAPHIC_CARDS','MOTHERBOARDS','POWER_SUPPLIES']);

export type CategoryType = `${z.infer<typeof CategorySchema>}`

export const OrderStatusSchema = z.enum(['PENDING','PAID','DELIVERING','COMPLETED','CANCELLED']);

export type OrderStatusType = `${z.infer<typeof OrderStatusSchema>}`

export const PaymentMethodSchema = z.enum(['CARD','CASH']);

export type PaymentMethodType = `${z.infer<typeof PaymentMethodSchema>}`

export const PaymentStatusSchema = z.enum(['PENDING','PAID','FAILED','REFUNDED']);

export type PaymentStatusType = `${z.infer<typeof PaymentStatusSchema>}`

export const PaymentProviderSchema = z.enum(['MONOBANK','LIQPAY','INTERNAL']);

export type PaymentProviderType = `${z.infer<typeof PaymentProviderSchema>}`

export const DeliveryMethodSchema = z.enum(['NOVA_POSHTA','UKRPOSHTA','COURIER']);

export type DeliveryMethodType = `${z.infer<typeof DeliveryMethodSchema>}`

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
})

export type User = z.infer<typeof UserSchema>

// USER RELATION SCHEMA
//------------------------------------------------------

export type UserRelations = {
  address?: AddressWithRelations | null;
  cart?: CartWithRelations | null;
  orders: OrderWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> = UserSchema.merge(z.object({
  address: z.lazy(() => AddressWithRelationsSchema).nullable(),
  cart: z.lazy(() => CartWithRelationsSchema).nullable(),
  orders: z.lazy(() => OrderWithRelationsSchema).array(),
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
  user: UserWithRelations;
};

export type AddressWithRelations = z.infer<typeof AddressSchema> & AddressRelations

export const AddressWithRelationsSchema: z.ZodType<AddressWithRelations> = AddressSchema.merge(z.object({
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  category: CategorySchema,
  id: z.number().int(),
  productName: z.string(),
  imgUrls: z.string().array(),
  price: z.instanceof(PrismaDecimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'Product']"}),
  description: z.string(),
  quantity: z.number().int(),
  details: JsonValueSchema,
  producerId: z.number().int(),
})

export type Product = z.infer<typeof ProductSchema>

// PRODUCT RELATION SCHEMA
//------------------------------------------------------

export type ProductRelations = {
  producer: ProducerWithRelations;
  cartItems: CartItemWithRelations[];
  orderItems: OrderItemWithRelations[];
};

export type ProductWithRelations = z.infer<typeof ProductSchema> & ProductRelations

export const ProductWithRelationsSchema: z.ZodType<ProductWithRelations> = ProductSchema.merge(z.object({
  producer: z.lazy(() => ProducerWithRelationsSchema),
  cartItems: z.lazy(() => CartItemWithRelationsSchema).array(),
  orderItems: z.lazy(() => OrderItemWithRelationsSchema).array(),
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
// CART SCHEMA
/////////////////////////////////////////

export const CartSchema = z.object({
  id: z.number().int(),
})

export type Cart = z.infer<typeof CartSchema>

// CART RELATION SCHEMA
//------------------------------------------------------

export type CartRelations = {
  items: CartItemWithRelations[];
  user: UserWithRelations;
};

export type CartWithRelations = z.infer<typeof CartSchema> & CartRelations

export const CartWithRelationsSchema: z.ZodType<CartWithRelations> = CartSchema.merge(z.object({
  items: z.lazy(() => CartItemWithRelationsSchema).array(),
  user: z.lazy(() => UserWithRelationsSchema),
}))

/////////////////////////////////////////
// CART ITEM SCHEMA
/////////////////////////////////////////

export const CartItemSchema = z.object({
  id: z.number().int(),
  quantity: z.number().int(),
  cartId: z.number().int(),
  productId: z.number().int(),
})

export type CartItem = z.infer<typeof CartItemSchema>

// CART ITEM RELATION SCHEMA
//------------------------------------------------------

export type CartItemRelations = {
  cart: CartWithRelations;
  product: ProductWithRelations;
};

export type CartItemWithRelations = z.infer<typeof CartItemSchema> & CartItemRelations

export const CartItemWithRelationsSchema: z.ZodType<CartItemWithRelations> = CartItemSchema.merge(z.object({
  cart: z.lazy(() => CartWithRelationsSchema),
  product: z.lazy(() => ProductWithRelationsSchema),
}))

/////////////////////////////////////////
// ORDER SCHEMA
/////////////////////////////////////////

export const OrderSchema = z.object({
  status: OrderStatusSchema,
  id: z.number().int(),
  totalAmount: z.instanceof(PrismaDecimal, { message: "Field 'totalAmount' must be a Decimal. Location: ['Models', 'Order']"}),
  userId: z.number().int(),
})

export type Order = z.infer<typeof OrderSchema>

// ORDER RELATION SCHEMA
//------------------------------------------------------

export type OrderRelations = {
  items: OrderItemWithRelations[];
  user: UserWithRelations;
  payment?: PaymentWithRelations | null;
  delivery?: DeliveryWithRelations | null;
};

export type OrderWithRelations = z.infer<typeof OrderSchema> & OrderRelations

export const OrderWithRelationsSchema: z.ZodType<OrderWithRelations> = OrderSchema.merge(z.object({
  items: z.lazy(() => OrderItemWithRelationsSchema).array(),
  user: z.lazy(() => UserWithRelationsSchema),
  payment: z.lazy(() => PaymentWithRelationsSchema).nullable(),
  delivery: z.lazy(() => DeliveryWithRelationsSchema).nullable(),
}))

/////////////////////////////////////////
// ORDER ITEM SCHEMA
/////////////////////////////////////////

export const OrderItemSchema = z.object({
  id: z.number().int(),
  quantity: z.number().int(),
  price: z.instanceof(PrismaDecimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'OrderItem']"}),
  productId: z.number().int(),
  orderId: z.number().int(),
})

export type OrderItem = z.infer<typeof OrderItemSchema>

// ORDER ITEM RELATION SCHEMA
//------------------------------------------------------

export type OrderItemRelations = {
  product: ProductWithRelations;
  order: OrderWithRelations;
};

export type OrderItemWithRelations = z.infer<typeof OrderItemSchema> & OrderItemRelations

export const OrderItemWithRelationsSchema: z.ZodType<OrderItemWithRelations> = OrderItemSchema.merge(z.object({
  product: z.lazy(() => ProductWithRelationsSchema),
  order: z.lazy(() => OrderWithRelationsSchema),
}))

/////////////////////////////////////////
// PAYMENT SCHEMA
/////////////////////////////////////////

export const PaymentSchema = z.object({
  status: PaymentStatusSchema,
  method: PaymentMethodSchema,
  provider: PaymentProviderSchema,
  id: z.number().int(),
  amount: z.instanceof(PrismaDecimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'Payment']"}),
  externalId: z.string().nullable(),
  orderId: z.number().int(),
})

export type Payment = z.infer<typeof PaymentSchema>

// PAYMENT RELATION SCHEMA
//------------------------------------------------------

export type PaymentRelations = {
  order: OrderWithRelations;
};

export type PaymentWithRelations = z.infer<typeof PaymentSchema> & PaymentRelations

export const PaymentWithRelationsSchema: z.ZodType<PaymentWithRelations> = PaymentSchema.merge(z.object({
  order: z.lazy(() => OrderWithRelationsSchema),
}))

/////////////////////////////////////////
// DELIVERY SCHEMA
/////////////////////////////////////////

export const DeliverySchema = z.object({
  method: DeliveryMethodSchema,
  id: z.number().int(),
  price: z.instanceof(PrismaDecimal, { message: "Field 'price' must be a Decimal. Location: ['Models', 'Delivery']"}),
  trackingNumber: z.string().nullable(),
  details: JsonValueSchema,
  orderId: z.number().int(),
})

export type Delivery = z.infer<typeof DeliverySchema>

// DELIVERY RELATION SCHEMA
//------------------------------------------------------

export type DeliveryRelations = {
  order: OrderWithRelations;
};

export type DeliveryWithRelations = z.infer<typeof DeliverySchema> & DeliveryRelations

export const DeliveryWithRelationsSchema: z.ZodType<DeliveryWithRelations> = DeliverySchema.merge(z.object({
  order: z.lazy(() => OrderWithRelationsSchema),
}))

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  cart: z.union([z.boolean(),z.lazy(() => CartArgsSchema)]).optional(),
  orders: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  orders: z.boolean().optional(),
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
  address: z.union([z.boolean(),z.lazy(() => AddressArgsSchema)]).optional(),
  cart: z.union([z.boolean(),z.lazy(() => CartArgsSchema)]).optional(),
  orders: z.union([z.boolean(),z.lazy(() => OrderFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
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

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
  producer: z.union([z.boolean(),z.lazy(() => ProducerArgsSchema)]).optional(),
  cartItems: z.union([z.boolean(),z.lazy(() => CartItemFindManyArgsSchema)]).optional(),
  orderItems: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductCountOutputTypeArgsSchema: z.ZodType<Prisma.ProductCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProductCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProductCountOutputTypeSelectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = z.object({
  cartItems: z.boolean().optional(),
  orderItems: z.boolean().optional(),
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
  cartItems: z.union([z.boolean(),z.lazy(() => CartItemFindManyArgsSchema)]).optional(),
  orderItems: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
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

// CART
//------------------------------------------------------

export const CartIncludeSchema: z.ZodType<Prisma.CartInclude> = z.object({
  items: z.union([z.boolean(),z.lazy(() => CartItemFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CartCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const CartArgsSchema: z.ZodType<Prisma.CartDefaultArgs> = z.object({
  select: z.lazy(() => CartSelectSchema).optional(),
  include: z.lazy(() => CartIncludeSchema).optional(),
}).strict();

export const CartCountOutputTypeArgsSchema: z.ZodType<Prisma.CartCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CartCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CartCountOutputTypeSelectSchema: z.ZodType<Prisma.CartCountOutputTypeSelect> = z.object({
  items: z.boolean().optional(),
}).strict();

export const CartSelectSchema: z.ZodType<Prisma.CartSelect> = z.object({
  id: z.boolean().optional(),
  items: z.union([z.boolean(),z.lazy(() => CartItemFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CartCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CART ITEM
//------------------------------------------------------

export const CartItemIncludeSchema: z.ZodType<Prisma.CartItemInclude> = z.object({
  cart: z.union([z.boolean(),z.lazy(() => CartArgsSchema)]).optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
}).strict();

export const CartItemArgsSchema: z.ZodType<Prisma.CartItemDefaultArgs> = z.object({
  select: z.lazy(() => CartItemSelectSchema).optional(),
  include: z.lazy(() => CartItemIncludeSchema).optional(),
}).strict();

export const CartItemSelectSchema: z.ZodType<Prisma.CartItemSelect> = z.object({
  id: z.boolean().optional(),
  quantity: z.boolean().optional(),
  cartId: z.boolean().optional(),
  productId: z.boolean().optional(),
  cart: z.union([z.boolean(),z.lazy(() => CartArgsSchema)]).optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
}).strict()

// ORDER
//------------------------------------------------------

export const OrderIncludeSchema: z.ZodType<Prisma.OrderInclude> = z.object({
  items: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  payment: z.union([z.boolean(),z.lazy(() => PaymentArgsSchema)]).optional(),
  delivery: z.union([z.boolean(),z.lazy(() => DeliveryArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const OrderArgsSchema: z.ZodType<Prisma.OrderDefaultArgs> = z.object({
  select: z.lazy(() => OrderSelectSchema).optional(),
  include: z.lazy(() => OrderIncludeSchema).optional(),
}).strict();

export const OrderCountOutputTypeArgsSchema: z.ZodType<Prisma.OrderCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => OrderCountOutputTypeSelectSchema).nullish(),
}).strict();

export const OrderCountOutputTypeSelectSchema: z.ZodType<Prisma.OrderCountOutputTypeSelect> = z.object({
  items: z.boolean().optional(),
}).strict();

export const OrderSelectSchema: z.ZodType<Prisma.OrderSelect> = z.object({
  id: z.boolean().optional(),
  status: z.boolean().optional(),
  totalAmount: z.boolean().optional(),
  userId: z.boolean().optional(),
  items: z.union([z.boolean(),z.lazy(() => OrderItemFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  payment: z.union([z.boolean(),z.lazy(() => PaymentArgsSchema)]).optional(),
  delivery: z.union([z.boolean(),z.lazy(() => DeliveryArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => OrderCountOutputTypeArgsSchema)]).optional(),
}).strict()

// ORDER ITEM
//------------------------------------------------------

export const OrderItemIncludeSchema: z.ZodType<Prisma.OrderItemInclude> = z.object({
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict();

export const OrderItemArgsSchema: z.ZodType<Prisma.OrderItemDefaultArgs> = z.object({
  select: z.lazy(() => OrderItemSelectSchema).optional(),
  include: z.lazy(() => OrderItemIncludeSchema).optional(),
}).strict();

export const OrderItemSelectSchema: z.ZodType<Prisma.OrderItemSelect> = z.object({
  id: z.boolean().optional(),
  quantity: z.boolean().optional(),
  price: z.boolean().optional(),
  productId: z.boolean().optional(),
  orderId: z.boolean().optional(),
  product: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

// PAYMENT
//------------------------------------------------------

export const PaymentIncludeSchema: z.ZodType<Prisma.PaymentInclude> = z.object({
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict();

export const PaymentArgsSchema: z.ZodType<Prisma.PaymentDefaultArgs> = z.object({
  select: z.lazy(() => PaymentSelectSchema).optional(),
  include: z.lazy(() => PaymentIncludeSchema).optional(),
}).strict();

export const PaymentSelectSchema: z.ZodType<Prisma.PaymentSelect> = z.object({
  id: z.boolean().optional(),
  status: z.boolean().optional(),
  method: z.boolean().optional(),
  amount: z.boolean().optional(),
  provider: z.boolean().optional(),
  externalId: z.boolean().optional(),
  orderId: z.boolean().optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict()

// DELIVERY
//------------------------------------------------------

export const DeliveryIncludeSchema: z.ZodType<Prisma.DeliveryInclude> = z.object({
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
}).strict();

export const DeliveryArgsSchema: z.ZodType<Prisma.DeliveryDefaultArgs> = z.object({
  select: z.lazy(() => DeliverySelectSchema).optional(),
  include: z.lazy(() => DeliveryIncludeSchema).optional(),
}).strict();

export const DeliverySelectSchema: z.ZodType<Prisma.DeliverySelect> = z.object({
  id: z.boolean().optional(),
  method: z.boolean().optional(),
  price: z.boolean().optional(),
  trackingNumber: z.boolean().optional(),
  details: z.boolean().optional(),
  orderId: z.boolean().optional(),
  order: z.union([z.boolean(),z.lazy(() => OrderArgsSchema)]).optional(),
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
  address: z.union([ z.lazy(() => AddressNullableScalarRelationFilterSchema), z.lazy(() => AddressWhereInputSchema) ]).optional().nullable(),
  cart: z.union([ z.lazy(() => CartNullableScalarRelationFilterSchema), z.lazy(() => CartWhereInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderListRelationFilterSchema).optional(),
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
  address: z.lazy(() => AddressOrderByWithRelationInputSchema).optional(),
  cart: z.lazy(() => CartOrderByWithRelationInputSchema).optional(),
  orders: z.lazy(() => OrderOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
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
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    id: z.number().int(),
    email: z.email({ message: "Невірний формат email" }),
  }),
  z.object({
    id: z.number().int(),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    id: z.number().int(),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  }),
  z.object({
    id: z.number().int(),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    email: z.email({ message: "Невірний формат email" }),
  }),
  z.object({
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
  z.object({
    username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }),
  }),
  z.object({
    phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  email: z.email({ message: "Невірний формат email" }).optional(),
  username: z.string().min(6, { message: "Довжина імені користувача має бути не менше 6 символів" }).optional(),
  phone: z.string().length(17, { message: "Довжина номеру телефона має бути 17 символів" }).optional(),
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
  cart: z.union([ z.lazy(() => CartNullableScalarRelationFilterSchema), z.lazy(() => CartWhereInputSchema) ]).optional().nullable(),
  orders: z.lazy(() => OrderListRelationFilterSchema).optional(),
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
});

export const AddressWhereInputSchema: z.ZodType<Prisma.AddressWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AddressWhereInputSchema), z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AddressWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AddressWhereInputSchema), z.lazy(() => AddressWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  city: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  street: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  houseNumber: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
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
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
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

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  productName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imgUrls: z.lazy(() => StringNullableListFilterSchema).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  producerId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  producer: z.union([ z.lazy(() => ProducerScalarRelationFilterSchema), z.lazy(() => ProducerWhereInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemListRelationFilterSchema).optional(),
  orderItems: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
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
  producerId: z.lazy(() => SortOrderSchema).optional(),
  producer: z.lazy(() => ProducerOrderByWithRelationInputSchema).optional(),
  cartItems: z.lazy(() => CartItemOrderByRelationAggregateInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemOrderByRelationAggregateInputSchema).optional(),
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
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  producerId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  producer: z.union([ z.lazy(() => ProducerScalarRelationFilterSchema), z.lazy(() => ProducerWhereInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemListRelationFilterSchema).optional(),
  orderItems: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
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
  producerId: z.lazy(() => SortOrderSchema).optional(),
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
  price: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryWithAggregatesFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  details: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  producerId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
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

export const CartWhereInputSchema: z.ZodType<Prisma.CartWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CartWhereInputSchema), z.lazy(() => CartWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartWhereInputSchema), z.lazy(() => CartWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  items: z.lazy(() => CartItemListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const CartOrderByWithRelationInputSchema: z.ZodType<Prisma.CartOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  items: z.lazy(() => CartItemOrderByRelationAggregateInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const CartWhereUniqueInputSchema: z.ZodType<Prisma.CartWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CartWhereInputSchema), z.lazy(() => CartWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartWhereInputSchema), z.lazy(() => CartWhereInputSchema).array() ]).optional(),
  items: z.lazy(() => CartItemListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const CartOrderByWithAggregationInputSchema: z.ZodType<Prisma.CartOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CartCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CartAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CartMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CartMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CartSumOrderByAggregateInputSchema).optional(),
});

export const CartScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CartScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CartScalarWhereWithAggregatesInputSchema), z.lazy(() => CartScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartScalarWhereWithAggregatesInputSchema), z.lazy(() => CartScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const CartItemWhereInputSchema: z.ZodType<Prisma.CartItemWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CartItemWhereInputSchema), z.lazy(() => CartItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartItemWhereInputSchema), z.lazy(() => CartItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  cartId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  productId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  cart: z.union([ z.lazy(() => CartScalarRelationFilterSchema), z.lazy(() => CartWhereInputSchema) ]).optional(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema), z.lazy(() => ProductWhereInputSchema) ]).optional(),
});

export const CartItemOrderByWithRelationInputSchema: z.ZodType<Prisma.CartItemOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  cart: z.lazy(() => CartOrderByWithRelationInputSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional(),
});

export const CartItemWhereUniqueInputSchema: z.ZodType<Prisma.CartItemWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    cartId_productId: z.lazy(() => CartItemCartIdProductIdCompoundUniqueInputSchema),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    cartId_productId: z.lazy(() => CartItemCartIdProductIdCompoundUniqueInputSchema),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  cartId_productId: z.lazy(() => CartItemCartIdProductIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => CartItemWhereInputSchema), z.lazy(() => CartItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartItemWhereInputSchema), z.lazy(() => CartItemWhereInputSchema).array() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  cartId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  productId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  cart: z.union([ z.lazy(() => CartScalarRelationFilterSchema), z.lazy(() => CartWhereInputSchema) ]).optional(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema), z.lazy(() => ProductWhereInputSchema) ]).optional(),
}));

export const CartItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.CartItemOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CartItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CartItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CartItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CartItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CartItemSumOrderByAggregateInputSchema).optional(),
});

export const CartItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CartItemScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema), z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema), z.lazy(() => CartItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  cartId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  productId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const OrderWhereInputSchema: z.ZodType<Prisma.OrderWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderWhereInputSchema), z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema), z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumOrderStatusFilterSchema), z.lazy(() => OrderStatusSchema) ]).optional(),
  totalAmount: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  items: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  payment: z.union([ z.lazy(() => PaymentNullableScalarRelationFilterSchema), z.lazy(() => PaymentWhereInputSchema) ]).optional().nullable(),
  delivery: z.union([ z.lazy(() => DeliveryNullableScalarRelationFilterSchema), z.lazy(() => DeliveryWhereInputSchema) ]).optional().nullable(),
});

export const OrderOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  items: z.lazy(() => OrderItemOrderByRelationAggregateInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  payment: z.lazy(() => PaymentOrderByWithRelationInputSchema).optional(),
  delivery: z.lazy(() => DeliveryOrderByWithRelationInputSchema).optional(),
});

export const OrderWhereUniqueInputSchema: z.ZodType<Prisma.OrderWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => OrderWhereInputSchema), z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderWhereInputSchema), z.lazy(() => OrderWhereInputSchema).array() ]).optional(),
  status: z.union([ z.lazy(() => EnumOrderStatusFilterSchema), z.lazy(() => OrderStatusSchema) ]).optional(),
  totalAmount: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  items: z.lazy(() => OrderItemListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  payment: z.union([ z.lazy(() => PaymentNullableScalarRelationFilterSchema), z.lazy(() => PaymentWhereInputSchema) ]).optional().nullable(),
  delivery: z.union([ z.lazy(() => DeliveryNullableScalarRelationFilterSchema), z.lazy(() => DeliveryWhereInputSchema) ]).optional().nullable(),
}));

export const OrderOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrderCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderSumOrderByAggregateInputSchema).optional(),
});

export const OrderScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumOrderStatusWithAggregatesFilterSchema), z.lazy(() => OrderStatusSchema) ]).optional(),
  totalAmount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  userId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const OrderItemWhereInputSchema: z.ZodType<Prisma.OrderItemWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemWhereInputSchema), z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemWhereInputSchema), z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  productId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema), z.lazy(() => ProductWhereInputSchema) ]).optional(),
  order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema), z.lazy(() => OrderWhereInputSchema) ]).optional(),
});

export const OrderItemOrderByWithRelationInputSchema: z.ZodType<Prisma.OrderItemOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
  product: z.lazy(() => ProductOrderByWithRelationInputSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional(),
});

export const OrderItemWhereUniqueInputSchema: z.ZodType<Prisma.OrderItemWhereUniqueInput> = z.object({
  id: z.number().int(),
})
.and(z.strictObject({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => OrderItemWhereInputSchema), z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemWhereInputSchema), z.lazy(() => OrderItemWhereInputSchema).array() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  productId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  orderId: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  product: z.union([ z.lazy(() => ProductScalarRelationFilterSchema), z.lazy(() => ProductWhereInputSchema) ]).optional(),
  order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema), z.lazy(() => OrderWhereInputSchema) ]).optional(),
}));

export const OrderItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.OrderItemOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => OrderItemCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => OrderItemAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => OrderItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => OrderItemMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => OrderItemSumOrderByAggregateInputSchema).optional(),
});

export const OrderItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.OrderItemScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema), z.lazy(() => OrderItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  price: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  productId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const PaymentWhereInputSchema: z.ZodType<Prisma.PaymentWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PaymentWhereInputSchema), z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentWhereInputSchema), z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumPaymentStatusFilterSchema), z.lazy(() => PaymentStatusSchema) ]).optional(),
  method: z.union([ z.lazy(() => EnumPaymentMethodFilterSchema), z.lazy(() => PaymentMethodSchema) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  provider: z.union([ z.lazy(() => EnumPaymentProviderFilterSchema), z.lazy(() => PaymentProviderSchema) ]).optional(),
  externalId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  orderId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema), z.lazy(() => OrderWhereInputSchema) ]).optional(),
});

export const PaymentOrderByWithRelationInputSchema: z.ZodType<Prisma.PaymentOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  externalId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional(),
});

export const PaymentWhereUniqueInputSchema: z.ZodType<Prisma.PaymentWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    externalId: z.string(),
    orderId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
    externalId: z.string(),
  }),
  z.object({
    id: z.number().int(),
    orderId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    externalId: z.string(),
    orderId: z.number().int(),
  }),
  z.object({
    externalId: z.string(),
  }),
  z.object({
    orderId: z.number().int(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  externalId: z.string().optional(),
  orderId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PaymentWhereInputSchema), z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentWhereInputSchema), z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  status: z.union([ z.lazy(() => EnumPaymentStatusFilterSchema), z.lazy(() => PaymentStatusSchema) ]).optional(),
  method: z.union([ z.lazy(() => EnumPaymentMethodFilterSchema), z.lazy(() => PaymentMethodSchema) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  provider: z.union([ z.lazy(() => EnumPaymentProviderFilterSchema), z.lazy(() => PaymentProviderSchema) ]).optional(),
  order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema), z.lazy(() => OrderWhereInputSchema) ]).optional(),
}));

export const PaymentOrderByWithAggregationInputSchema: z.ZodType<Prisma.PaymentOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  externalId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PaymentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PaymentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PaymentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PaymentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PaymentSumOrderByAggregateInputSchema).optional(),
});

export const PaymentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PaymentScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema), z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema), z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumPaymentStatusWithAggregatesFilterSchema), z.lazy(() => PaymentStatusSchema) ]).optional(),
  method: z.union([ z.lazy(() => EnumPaymentMethodWithAggregatesFilterSchema), z.lazy(() => PaymentMethodSchema) ]).optional(),
  amount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  provider: z.union([ z.lazy(() => EnumPaymentProviderWithAggregatesFilterSchema), z.lazy(() => PaymentProviderSchema) ]).optional(),
  externalId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  orderId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
});

export const DeliveryWhereInputSchema: z.ZodType<Prisma.DeliveryWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => DeliveryWhereInputSchema), z.lazy(() => DeliveryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DeliveryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DeliveryWhereInputSchema), z.lazy(() => DeliveryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  method: z.union([ z.lazy(() => EnumDeliveryMethodFilterSchema), z.lazy(() => DeliveryMethodSchema) ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  trackingNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  orderId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema), z.lazy(() => OrderWhereInputSchema) ]).optional(),
});

export const DeliveryOrderByWithRelationInputSchema: z.ZodType<Prisma.DeliveryOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  trackingNumber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => OrderOrderByWithRelationInputSchema).optional(),
});

export const DeliveryWhereUniqueInputSchema: z.ZodType<Prisma.DeliveryWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    orderId: z.number().int(),
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    orderId: z.number().int(),
  }),
])
.and(z.strictObject({
  id: z.number().int().optional(),
  orderId: z.number().int().optional(),
  AND: z.union([ z.lazy(() => DeliveryWhereInputSchema), z.lazy(() => DeliveryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => DeliveryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DeliveryWhereInputSchema), z.lazy(() => DeliveryWhereInputSchema).array() ]).optional(),
  method: z.union([ z.lazy(() => EnumDeliveryMethodFilterSchema), z.lazy(() => DeliveryMethodSchema) ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  trackingNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  order: z.union([ z.lazy(() => OrderScalarRelationFilterSchema), z.lazy(() => OrderWhereInputSchema) ]).optional(),
}));

export const DeliveryOrderByWithAggregationInputSchema: z.ZodType<Prisma.DeliveryOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  trackingNumber: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => DeliveryCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => DeliveryAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => DeliveryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => DeliveryMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => DeliverySumOrderByAggregateInputSchema).optional(),
});

export const DeliveryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.DeliveryScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => DeliveryScalarWhereWithAggregatesInputSchema), z.lazy(() => DeliveryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => DeliveryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => DeliveryScalarWhereWithAggregatesInputSchema), z.lazy(() => DeliveryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  method: z.union([ z.lazy(() => EnumDeliveryMethodWithAggregatesFilterSchema), z.lazy(() => DeliveryMethodSchema) ]).optional(),
  price: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  trackingNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  details: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  orderId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
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
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
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
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  cart: z.lazy(() => CartUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
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
  cart: z.lazy(() => CartUpdateOneWithoutUserNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
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
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  cart: z.lazy(() => CartUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
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
});

export const AddressCreateInputSchema: z.ZodType<Prisma.AddressCreateInput> = z.strictObject({
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
  user: z.lazy(() => UserCreateNestedOneWithoutAddressInputSchema),
});

export const AddressUncheckedCreateInputSchema: z.ZodType<Prisma.AddressUncheckedCreateInput> = z.strictObject({
  id: z.number().int(),
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
});

export const AddressUpdateInputSchema: z.ZodType<Prisma.AddressUpdateInput> = z.strictObject({
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAddressNestedInputSchema).optional(),
});

export const AddressUncheckedUpdateInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AddressCreateManyInputSchema: z.ZodType<Prisma.AddressCreateManyInput> = z.strictObject({
  id: z.number().int(),
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

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.strictObject({
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producer: z.lazy(() => ProducerCreateNestedOneWithoutProductsInputSchema),
  cartItems: z.lazy(() => CartItemCreateNestedManyWithoutProductInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producerId: z.number().int(),
  cartItems: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.strictObject({
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producer: z.lazy(() => ProducerUpdateOneRequiredWithoutProductsNestedInputSchema).optional(),
  cartItems: z.lazy(() => CartItemUpdateManyWithoutProductNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producerId: z.number().int(),
});

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.strictObject({
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const CartCreateInputSchema: z.ZodType<Prisma.CartCreateInput> = z.strictObject({
  items: z.lazy(() => CartItemCreateNestedManyWithoutCartInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCartInputSchema),
});

export const CartUncheckedCreateInputSchema: z.ZodType<Prisma.CartUncheckedCreateInput> = z.strictObject({
  id: z.number().int(),
  items: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutCartInputSchema).optional(),
});

export const CartUpdateInputSchema: z.ZodType<Prisma.CartUpdateInput> = z.strictObject({
  items: z.lazy(() => CartItemUpdateManyWithoutCartNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCartNestedInputSchema).optional(),
});

export const CartUncheckedUpdateInputSchema: z.ZodType<Prisma.CartUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => CartItemUncheckedUpdateManyWithoutCartNestedInputSchema).optional(),
});

export const CartCreateManyInputSchema: z.ZodType<Prisma.CartCreateManyInput> = z.strictObject({
  id: z.number().int(),
});

export const CartUpdateManyMutationInputSchema: z.ZodType<Prisma.CartUpdateManyMutationInput> = z.strictObject({
});

export const CartUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CartUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CartItemCreateInputSchema: z.ZodType<Prisma.CartItemCreateInput> = z.strictObject({
  quantity: z.number().int().optional(),
  cart: z.lazy(() => CartCreateNestedOneWithoutItemsInputSchema),
  product: z.lazy(() => ProductCreateNestedOneWithoutCartItemsInputSchema),
});

export const CartItemUncheckedCreateInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int().optional(),
  cartId: z.number().int(),
  productId: z.number().int(),
});

export const CartItemUpdateInputSchema: z.ZodType<Prisma.CartItemUpdateInput> = z.strictObject({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutCartItemsNestedInputSchema).optional(),
});

export const CartItemUncheckedUpdateInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CartItemCreateManyInputSchema: z.ZodType<Prisma.CartItemCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int().optional(),
  cartId: z.number().int(),
  productId: z.number().int(),
});

export const CartItemUpdateManyMutationInputSchema: z.ZodType<Prisma.CartItemUpdateManyMutationInput> = z.strictObject({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CartItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderCreateInputSchema: z.ZodType<Prisma.OrderCreateInput> = z.strictObject({
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  items: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutOrderInputSchema).optional(),
  delivery: z.lazy(() => DeliveryCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderUncheckedCreateInputSchema: z.ZodType<Prisma.OrderUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  userId: z.number().int(),
  items: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderUpdateInputSchema: z.ZodType<Prisma.OrderUpdateInput> = z.strictObject({
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutOrderNestedInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderCreateManyInputSchema: z.ZodType<Prisma.OrderCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  userId: z.number().int(),
});

export const OrderUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderUpdateManyMutationInput> = z.strictObject({
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemCreateInputSchema: z.ZodType<Prisma.OrderItemCreateInput> = z.strictObject({
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemsInputSchema),
  order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputSchema),
});

export const OrderItemUncheckedCreateInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  productId: z.number().int(),
  orderId: z.number().int(),
});

export const OrderItemUpdateInputSchema: z.ZodType<Prisma.OrderItemUpdateInput> = z.strictObject({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutOrderItemsNestedInputSchema).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemCreateManyInputSchema: z.ZodType<Prisma.OrderItemCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  productId: z.number().int(),
  orderId: z.number().int(),
});

export const OrderItemUpdateManyMutationInputSchema: z.ZodType<Prisma.OrderItemUpdateManyMutationInput> = z.strictObject({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const PaymentCreateInputSchema: z.ZodType<Prisma.PaymentCreateInput> = z.strictObject({
  status: z.lazy(() => PaymentStatusSchema).optional(),
  method: z.lazy(() => PaymentMethodSchema),
  amount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  provider: z.lazy(() => PaymentProviderSchema),
  externalId: z.string().optional().nullable(),
  order: z.lazy(() => OrderCreateNestedOneWithoutPaymentInputSchema),
});

export const PaymentUncheckedCreateInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => PaymentStatusSchema).optional(),
  method: z.lazy(() => PaymentMethodSchema),
  amount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  provider: z.lazy(() => PaymentProviderSchema),
  externalId: z.string().optional().nullable(),
  orderId: z.number().int(),
});

export const PaymentUpdateInputSchema: z.ZodType<Prisma.PaymentUpdateInput> = z.strictObject({
  status: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => EnumPaymentProviderFieldUpdateOperationsInputSchema) ]).optional(),
  externalId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutPaymentNestedInputSchema).optional(),
});

export const PaymentUncheckedUpdateInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => EnumPaymentProviderFieldUpdateOperationsInputSchema) ]).optional(),
  externalId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const PaymentCreateManyInputSchema: z.ZodType<Prisma.PaymentCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => PaymentStatusSchema).optional(),
  method: z.lazy(() => PaymentMethodSchema),
  amount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  provider: z.lazy(() => PaymentProviderSchema),
  externalId: z.string().optional().nullable(),
  orderId: z.number().int(),
});

export const PaymentUpdateManyMutationInputSchema: z.ZodType<Prisma.PaymentUpdateManyMutationInput> = z.strictObject({
  status: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => EnumPaymentProviderFieldUpdateOperationsInputSchema) ]).optional(),
  externalId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PaymentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => EnumPaymentProviderFieldUpdateOperationsInputSchema) ]).optional(),
  externalId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  orderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const DeliveryCreateInputSchema: z.ZodType<Prisma.DeliveryCreateInput> = z.strictObject({
  method: z.lazy(() => DeliveryMethodSchema),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  trackingNumber: z.string().optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  order: z.lazy(() => OrderCreateNestedOneWithoutDeliveryInputSchema),
});

export const DeliveryUncheckedCreateInputSchema: z.ZodType<Prisma.DeliveryUncheckedCreateInput> = z.strictObject({
  id: z.number().int().optional(),
  method: z.lazy(() => DeliveryMethodSchema),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  trackingNumber: z.string().optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  orderId: z.number().int(),
});

export const DeliveryUpdateInputSchema: z.ZodType<Prisma.DeliveryUpdateInput> = z.strictObject({
  method: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => EnumDeliveryMethodFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  trackingNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutDeliveryNestedInputSchema).optional(),
});

export const DeliveryUncheckedUpdateInputSchema: z.ZodType<Prisma.DeliveryUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => EnumDeliveryMethodFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  trackingNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const DeliveryCreateManyInputSchema: z.ZodType<Prisma.DeliveryCreateManyInput> = z.strictObject({
  id: z.number().int().optional(),
  method: z.lazy(() => DeliveryMethodSchema),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  trackingNumber: z.string().optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  orderId: z.number().int(),
});

export const DeliveryUpdateManyMutationInputSchema: z.ZodType<Prisma.DeliveryUpdateManyMutationInput> = z.strictObject({
  method: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => EnumDeliveryMethodFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  trackingNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export const DeliveryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.DeliveryUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => EnumDeliveryMethodFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  trackingNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const AddressNullableScalarRelationFilterSchema: z.ZodType<Prisma.AddressNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => AddressWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AddressWhereInputSchema).optional().nullable(),
});

export const CartNullableScalarRelationFilterSchema: z.ZodType<Prisma.CartNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CartWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CartWhereInputSchema).optional().nullable(),
});

export const OrderListRelationFilterSchema: z.ZodType<Prisma.OrderListRelationFilter> = z.strictObject({
  every: z.lazy(() => OrderWhereInputSchema).optional(),
  some: z.lazy(() => OrderWhereInputSchema).optional(),
  none: z.lazy(() => OrderWhereInputSchema).optional(),
});

export const OrderOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrderOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
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
});

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
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
});

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  birthYear: z.lazy(() => SortOrderSchema).optional(),
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

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
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

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.strictObject({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(PrismaDecimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(PrismaDecimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
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

export const ProducerScalarRelationFilterSchema: z.ZodType<Prisma.ProducerScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ProducerWhereInputSchema).optional(),
  isNot: z.lazy(() => ProducerWhereInputSchema).optional(),
});

export const CartItemListRelationFilterSchema: z.ZodType<Prisma.CartItemListRelationFilter> = z.strictObject({
  every: z.lazy(() => CartItemWhereInputSchema).optional(),
  some: z.lazy(() => CartItemWhereInputSchema).optional(),
  none: z.lazy(() => CartItemWhereInputSchema).optional(),
});

export const OrderItemListRelationFilterSchema: z.ZodType<Prisma.OrderItemListRelationFilter> = z.strictObject({
  every: z.lazy(() => OrderItemWhereInputSchema).optional(),
  some: z.lazy(() => OrderItemWhereInputSchema).optional(),
  none: z.lazy(() => OrderItemWhereInputSchema).optional(),
});

export const CartItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CartItemOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.OrderItemOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
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
  equals: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(PrismaDecimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(PrismaDecimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
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

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.strictObject({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
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

export const CartCountOrderByAggregateInputSchema: z.ZodType<Prisma.CartCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const CartAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CartAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const CartMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CartMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const CartMinOrderByAggregateInputSchema: z.ZodType<Prisma.CartMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const CartSumOrderByAggregateInputSchema: z.ZodType<Prisma.CartSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
});

export const CartScalarRelationFilterSchema: z.ZodType<Prisma.CartScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => CartWhereInputSchema).optional(),
  isNot: z.lazy(() => CartWhereInputSchema).optional(),
});

export const ProductScalarRelationFilterSchema: z.ZodType<Prisma.ProductScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => ProductWhereInputSchema).optional(),
  isNot: z.lazy(() => ProductWhereInputSchema).optional(),
});

export const CartItemCartIdProductIdCompoundUniqueInputSchema: z.ZodType<Prisma.CartItemCartIdProductIdCompoundUniqueInput> = z.strictObject({
  cartId: z.number(),
  productId: z.number(),
});

export const CartItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
});

export const CartItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
});

export const CartItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
});

export const CartItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
});

export const CartItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.CartItemSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  cartId: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumOrderStatusFilterSchema: z.ZodType<Prisma.EnumOrderStatusFilter> = z.strictObject({
  equals: z.lazy(() => OrderStatusSchema).optional(),
  in: z.lazy(() => OrderStatusSchema).array().optional(),
  notIn: z.lazy(() => OrderStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => NestedEnumOrderStatusFilterSchema) ]).optional(),
});

export const PaymentNullableScalarRelationFilterSchema: z.ZodType<Prisma.PaymentNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => PaymentWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PaymentWhereInputSchema).optional().nullable(),
});

export const DeliveryNullableScalarRelationFilterSchema: z.ZodType<Prisma.DeliveryNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => DeliveryWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => DeliveryWhereInputSchema).optional().nullable(),
});

export const OrderCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  totalAmount: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumOrderStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumOrderStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => OrderStatusSchema).optional(),
  in: z.lazy(() => OrderStatusSchema).array().optional(),
  notIn: z.lazy(() => OrderStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => NestedEnumOrderStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderStatusFilterSchema).optional(),
});

export const OrderScalarRelationFilterSchema: z.ZodType<Prisma.OrderScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => OrderWhereInputSchema).optional(),
  isNot: z.lazy(() => OrderWhereInputSchema).optional(),
});

export const OrderItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemAvgOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const OrderItemSumOrderByAggregateInputSchema: z.ZodType<Prisma.OrderItemSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  productId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumPaymentStatusFilterSchema: z.ZodType<Prisma.EnumPaymentStatusFilter> = z.strictObject({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => NestedEnumPaymentStatusFilterSchema) ]).optional(),
});

export const EnumPaymentMethodFilterSchema: z.ZodType<Prisma.EnumPaymentMethodFilter> = z.strictObject({
  equals: z.lazy(() => PaymentMethodSchema).optional(),
  in: z.lazy(() => PaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NestedEnumPaymentMethodFilterSchema) ]).optional(),
});

export const EnumPaymentProviderFilterSchema: z.ZodType<Prisma.EnumPaymentProviderFilter> = z.strictObject({
  equals: z.lazy(() => PaymentProviderSchema).optional(),
  in: z.lazy(() => PaymentProviderSchema).array().optional(),
  notIn: z.lazy(() => PaymentProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => NestedEnumPaymentProviderFilterSchema) ]).optional(),
});

export const PaymentCountOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  externalId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const PaymentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const PaymentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  externalId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const PaymentMinOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  provider: z.lazy(() => SortOrderSchema).optional(),
  externalId: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const PaymentSumOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentSumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumPaymentStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => NestedEnumPaymentStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
});

export const EnumPaymentMethodWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentMethodWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentMethodSchema).optional(),
  in: z.lazy(() => PaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NestedEnumPaymentMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodFilterSchema).optional(),
});

export const EnumPaymentProviderWithAggregatesFilterSchema: z.ZodType<Prisma.EnumPaymentProviderWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentProviderSchema).optional(),
  in: z.lazy(() => PaymentProviderSchema).array().optional(),
  notIn: z.lazy(() => PaymentProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => NestedEnumPaymentProviderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentProviderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentProviderFilterSchema).optional(),
});

export const EnumDeliveryMethodFilterSchema: z.ZodType<Prisma.EnumDeliveryMethodFilter> = z.strictObject({
  equals: z.lazy(() => DeliveryMethodSchema).optional(),
  in: z.lazy(() => DeliveryMethodSchema).array().optional(),
  notIn: z.lazy(() => DeliveryMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => NestedEnumDeliveryMethodFilterSchema) ]).optional(),
});

export const DeliveryCountOrderByAggregateInputSchema: z.ZodType<Prisma.DeliveryCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  trackingNumber: z.lazy(() => SortOrderSchema).optional(),
  details: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const DeliveryAvgOrderByAggregateInputSchema: z.ZodType<Prisma.DeliveryAvgOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const DeliveryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.DeliveryMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  trackingNumber: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const DeliveryMinOrderByAggregateInputSchema: z.ZodType<Prisma.DeliveryMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  trackingNumber: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const DeliverySumOrderByAggregateInputSchema: z.ZodType<Prisma.DeliverySumOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  orderId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumDeliveryMethodWithAggregatesFilterSchema: z.ZodType<Prisma.EnumDeliveryMethodWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => DeliveryMethodSchema).optional(),
  in: z.lazy(() => DeliveryMethodSchema).array().optional(),
  notIn: z.lazy(() => DeliveryMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => NestedEnumDeliveryMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDeliveryMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDeliveryMethodFilterSchema).optional(),
});

export const AddressCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema), z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
});

export const CartCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.CartCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema), z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional(),
});

export const OrderCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrderCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema), z.lazy(() => OrderCreateWithoutUserInputSchema).array(), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema), z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
});

export const AddressUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema), z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
});

export const CartUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.CartUncheckedCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema), z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional(),
});

export const OrderUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.OrderUncheckedCreateNestedManyWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema), z.lazy(() => OrderCreateWithoutUserInputSchema).array(), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema), z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
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

export const CartUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.CartUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema), z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => CartUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CartWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CartWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CartUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => CartUpdateWithoutUserInputSchema), z.lazy(() => CartUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const OrderUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrderUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema), z.lazy(() => OrderCreateWithoutUserInputSchema).array(), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema), z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => OrderUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => OrderUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => OrderUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema), z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
});

export const AddressUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AddressUncheckedUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema), z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AddressCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AddressUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AddressWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AddressWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AddressUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => AddressUpdateWithoutUserInputSchema), z.lazy(() => AddressUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const CartUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.CartUncheckedUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema), z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => CartUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CartWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CartWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CartUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => CartUpdateWithoutUserInputSchema), z.lazy(() => CartUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const OrderUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema), z.lazy(() => OrderCreateWithoutUserInputSchema).array(), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema), z.lazy(() => OrderCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => OrderUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderWhereUniqueInputSchema), z.lazy(() => OrderWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => OrderUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => OrderUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderScalarWhereInputSchema), z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutAddressInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAddressInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema), z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneRequiredWithoutAddressNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAddressNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAddressInputSchema), z.lazy(() => UserUncheckedCreateWithoutAddressInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAddressInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAddressInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAddressInputSchema), z.lazy(() => UserUpdateWithoutAddressInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAddressInputSchema) ]).optional(),
});

export const ProductCreateimgUrlsInputSchema: z.ZodType<Prisma.ProductCreateimgUrlsInput> = z.strictObject({
  set: z.string().array(),
});

export const ProducerCreateNestedOneWithoutProductsInputSchema: z.ZodType<Prisma.ProducerCreateNestedOneWithoutProductsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProducerCreateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProducerCreateOrConnectWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => ProducerWhereUniqueInputSchema).optional(),
});

export const CartItemCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.CartItemCreateNestedManyWithoutProductInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema), z.lazy(() => CartItemCreateWithoutProductInputSchema).array(), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
});

export const OrderItemCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutProductInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema), z.lazy(() => OrderItemCreateWithoutProductInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
});

export const CartItemUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateNestedManyWithoutProductInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema), z.lazy(() => CartItemCreateWithoutProductInputSchema).array(), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
});

export const OrderItemUncheckedCreateNestedManyWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutProductInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema), z.lazy(() => OrderItemCreateWithoutProductInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
});

export const ProductUpdateimgUrlsInputSchema: z.ZodType<Prisma.ProductUpdateimgUrlsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.strictObject({
  set: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
});

export const EnumCategoryFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumCategoryFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => CategorySchema).optional(),
});

export const ProducerUpdateOneRequiredWithoutProductsNestedInputSchema: z.ZodType<Prisma.ProducerUpdateOneRequiredWithoutProductsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProducerCreateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedCreateWithoutProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProducerCreateOrConnectWithoutProductsInputSchema).optional(),
  upsert: z.lazy(() => ProducerUpsertWithoutProductsInputSchema).optional(),
  connect: z.lazy(() => ProducerWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProducerUpdateToOneWithWhereWithoutProductsInputSchema), z.lazy(() => ProducerUpdateWithoutProductsInputSchema), z.lazy(() => ProducerUncheckedUpdateWithoutProductsInputSchema) ]).optional(),
});

export const CartItemUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.CartItemUpdateManyWithoutProductNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema), z.lazy(() => CartItemCreateWithoutProductInputSchema).array(), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartItemUpsertWithWhereUniqueWithoutProductInputSchema), z.lazy(() => CartItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartItemUpdateWithWhereUniqueWithoutProductInputSchema), z.lazy(() => CartItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartItemUpdateManyWithWhereWithoutProductInputSchema), z.lazy(() => CartItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartItemScalarWhereInputSchema), z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
});

export const OrderItemUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutProductNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema), z.lazy(() => OrderItemCreateWithoutProductInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
});

export const CartItemUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyWithoutProductNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema), z.lazy(() => CartItemCreateWithoutProductInputSchema).array(), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => CartItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartItemUpsertWithWhereUniqueWithoutProductInputSchema), z.lazy(() => CartItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartItemUpdateWithWhereUniqueWithoutProductInputSchema), z.lazy(() => CartItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartItemUpdateManyWithWhereWithoutProductInputSchema), z.lazy(() => CartItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartItemScalarWhereInputSchema), z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
});

export const OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutProductNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema), z.lazy(() => OrderItemCreateWithoutProductInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutProductInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyProductInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutProductInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutProductInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
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

export const CartItemCreateNestedManyWithoutCartInputSchema: z.ZodType<Prisma.CartItemCreateNestedManyWithoutCartInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema), z.lazy(() => CartItemCreateWithoutCartInputSchema).array(), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema), z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyCartInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutCartInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCartInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema), z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCartInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const CartItemUncheckedCreateNestedManyWithoutCartInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateNestedManyWithoutCartInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema), z.lazy(() => CartItemCreateWithoutCartInputSchema).array(), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema), z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyCartInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
});

export const CartItemUpdateManyWithoutCartNestedInputSchema: z.ZodType<Prisma.CartItemUpdateManyWithoutCartNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema), z.lazy(() => CartItemCreateWithoutCartInputSchema).array(), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema), z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartItemUpsertWithWhereUniqueWithoutCartInputSchema), z.lazy(() => CartItemUpsertWithWhereUniqueWithoutCartInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyCartInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartItemUpdateWithWhereUniqueWithoutCartInputSchema), z.lazy(() => CartItemUpdateWithWhereUniqueWithoutCartInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartItemUpdateManyWithWhereWithoutCartInputSchema), z.lazy(() => CartItemUpdateManyWithWhereWithoutCartInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartItemScalarWhereInputSchema), z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
});

export const UserUpdateOneRequiredWithoutCartNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCartNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema), z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCartInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCartInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCartInputSchema), z.lazy(() => UserUpdateWithoutCartInputSchema), z.lazy(() => UserUncheckedUpdateWithoutCartInputSchema) ]).optional(),
});

export const CartItemUncheckedUpdateManyWithoutCartNestedInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyWithoutCartNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema), z.lazy(() => CartItemCreateWithoutCartInputSchema).array(), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema), z.lazy(() => CartItemCreateOrConnectWithoutCartInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CartItemUpsertWithWhereUniqueWithoutCartInputSchema), z.lazy(() => CartItemUpsertWithWhereUniqueWithoutCartInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CartItemCreateManyCartInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CartItemWhereUniqueInputSchema), z.lazy(() => CartItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CartItemUpdateWithWhereUniqueWithoutCartInputSchema), z.lazy(() => CartItemUpdateWithWhereUniqueWithoutCartInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CartItemUpdateManyWithWhereWithoutCartInputSchema), z.lazy(() => CartItemUpdateManyWithWhereWithoutCartInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CartItemScalarWhereInputSchema), z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
});

export const CartCreateNestedOneWithoutItemsInputSchema: z.ZodType<Prisma.CartCreateNestedOneWithoutItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartCreateWithoutItemsInputSchema), z.lazy(() => CartUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional(),
});

export const ProductCreateNestedOneWithoutCartItemsInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutCartItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutCartItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutCartItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutCartItemsInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
});

export const CartUpdateOneRequiredWithoutItemsNestedInputSchema: z.ZodType<Prisma.CartUpdateOneRequiredWithoutItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => CartCreateWithoutItemsInputSchema), z.lazy(() => CartUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CartCreateOrConnectWithoutItemsInputSchema).optional(),
  upsert: z.lazy(() => CartUpsertWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => CartWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CartUpdateToOneWithWhereWithoutItemsInputSchema), z.lazy(() => CartUpdateWithoutItemsInputSchema), z.lazy(() => CartUncheckedUpdateWithoutItemsInputSchema) ]).optional(),
});

export const ProductUpdateOneRequiredWithoutCartItemsNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutCartItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutCartItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutCartItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutCartItemsInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutCartItemsInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutCartItemsInputSchema), z.lazy(() => ProductUpdateWithoutCartItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutCartItemsInputSchema) ]).optional(),
});

export const OrderItemCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateNestedManyWithoutOrderInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutOrdersInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutOrdersInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutOrdersInputSchema), z.lazy(() => UserUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const PaymentCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.PaymentCreateNestedOneWithoutOrderInput> = z.strictObject({
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
});

export const DeliveryCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryCreateNestedOneWithoutOrderInput> = z.strictObject({
  create: z.union([ z.lazy(() => DeliveryCreateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DeliveryCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => DeliveryWhereUniqueInputSchema).optional(),
});

export const OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateNestedManyWithoutOrderInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
});

export const PaymentUncheckedCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateNestedOneWithoutOrderInput> = z.strictObject({
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
});

export const DeliveryUncheckedCreateNestedOneWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryUncheckedCreateNestedOneWithoutOrderInput> = z.strictObject({
  create: z.union([ z.lazy(() => DeliveryCreateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DeliveryCreateOrConnectWithoutOrderInputSchema).optional(),
  connect: z.lazy(() => DeliveryWhereUniqueInputSchema).optional(),
});

export const EnumOrderStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumOrderStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => OrderStatusSchema).optional(),
});

export const OrderItemUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithoutOrderNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
});

export const UserUpdateOneRequiredWithoutOrdersNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutOrdersNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutOrdersInputSchema), z.lazy(() => UserUncheckedCreateWithoutOrdersInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutOrdersInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutOrdersInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutOrdersInputSchema), z.lazy(() => UserUpdateWithoutOrdersInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOrdersInputSchema) ]).optional(),
});

export const PaymentUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.PaymentUpdateOneWithoutOrderNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => PaymentUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateToOneWithWhereWithoutOrderInputSchema), z.lazy(() => PaymentUpdateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
});

export const DeliveryUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.DeliveryUpdateOneWithoutOrderNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DeliveryCreateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DeliveryCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => DeliveryUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DeliveryWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DeliveryWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DeliveryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DeliveryUpdateToOneWithWhereWithoutOrderInputSchema), z.lazy(() => DeliveryUpdateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
});

export const OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutOrderNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemCreateWithoutOrderInputSchema).array(), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema), z.lazy(() => OrderItemCreateOrConnectWithoutOrderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema), z.lazy(() => OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => OrderItemCreateManyOrderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => OrderItemWhereUniqueInputSchema), z.lazy(() => OrderItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema), z.lazy(() => OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema), z.lazy(() => OrderItemUpdateManyWithWhereWithoutOrderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
});

export const PaymentUncheckedUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateOneWithoutOrderNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => PaymentUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateToOneWithWhereWithoutOrderInputSchema), z.lazy(() => PaymentUpdateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
});

export const DeliveryUncheckedUpdateOneWithoutOrderNestedInputSchema: z.ZodType<Prisma.DeliveryUncheckedUpdateOneWithoutOrderNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => DeliveryCreateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedCreateWithoutOrderInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => DeliveryCreateOrConnectWithoutOrderInputSchema).optional(),
  upsert: z.lazy(() => DeliveryUpsertWithoutOrderInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => DeliveryWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => DeliveryWhereInputSchema) ]).optional(),
  connect: z.lazy(() => DeliveryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => DeliveryUpdateToOneWithWhereWithoutOrderInputSchema), z.lazy(() => DeliveryUpdateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedUpdateWithoutOrderInputSchema) ]).optional(),
});

export const ProductCreateNestedOneWithoutOrderItemsInputSchema: z.ZodType<Prisma.ProductCreateNestedOneWithoutOrderItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutOrderItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrderItemsInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
});

export const OrderCreateNestedOneWithoutItemsInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutItemsInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
});

export const ProductUpdateOneRequiredWithoutOrderItemsNestedInputSchema: z.ZodType<Prisma.ProductUpdateOneRequiredWithoutOrderItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutOrderItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProductCreateOrConnectWithoutOrderItemsInputSchema).optional(),
  upsert: z.lazy(() => ProductUpsertWithoutOrderItemsInputSchema).optional(),
  connect: z.lazy(() => ProductWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProductUpdateToOneWithWhereWithoutOrderItemsInputSchema), z.lazy(() => ProductUpdateWithoutOrderItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemsInputSchema) ]).optional(),
});

export const OrderUpdateOneRequiredWithoutItemsNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutItemsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutItemsInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutItemsInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutItemsInputSchema), z.lazy(() => OrderUpdateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputSchema) ]).optional(),
});

export const OrderCreateNestedOneWithoutPaymentInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutPaymentInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutPaymentInputSchema), z.lazy(() => OrderUncheckedCreateWithoutPaymentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutPaymentInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
});

export const EnumPaymentStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPaymentStatusFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => PaymentStatusSchema).optional(),
});

export const EnumPaymentMethodFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPaymentMethodFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => PaymentMethodSchema).optional(),
});

export const EnumPaymentProviderFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumPaymentProviderFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => PaymentProviderSchema).optional(),
});

export const OrderUpdateOneRequiredWithoutPaymentNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutPaymentNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutPaymentInputSchema), z.lazy(() => OrderUncheckedCreateWithoutPaymentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutPaymentInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutPaymentInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutPaymentInputSchema), z.lazy(() => OrderUpdateWithoutPaymentInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutPaymentInputSchema) ]).optional(),
});

export const OrderCreateNestedOneWithoutDeliveryInputSchema: z.ZodType<Prisma.OrderCreateNestedOneWithoutDeliveryInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryInputSchema), z.lazy(() => OrderUncheckedCreateWithoutDeliveryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutDeliveryInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
});

export const EnumDeliveryMethodFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumDeliveryMethodFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => DeliveryMethodSchema).optional(),
});

export const OrderUpdateOneRequiredWithoutDeliveryNestedInputSchema: z.ZodType<Prisma.OrderUpdateOneRequiredWithoutDeliveryNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryInputSchema), z.lazy(() => OrderUncheckedCreateWithoutDeliveryInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => OrderCreateOrConnectWithoutDeliveryInputSchema).optional(),
  upsert: z.lazy(() => OrderUpsertWithoutDeliveryInputSchema).optional(),
  connect: z.lazy(() => OrderWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => OrderUpdateToOneWithWhereWithoutDeliveryInputSchema), z.lazy(() => OrderUpdateWithoutDeliveryInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutDeliveryInputSchema) ]).optional(),
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

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(PrismaDecimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(PrismaDecimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
});

export const NestedEnumCategoryFilterSchema: z.ZodType<Prisma.NestedEnumCategoryFilter> = z.strictObject({
  equals: z.lazy(() => CategorySchema).optional(),
  in: z.lazy(() => CategorySchema).array().optional(),
  notIn: z.lazy(() => CategorySchema).array().optional(),
  not: z.union([ z.lazy(() => CategorySchema), z.lazy(() => NestedEnumCategoryFilterSchema) ]).optional(),
});

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.strictObject({
  equals: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(PrismaDecimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(PrismaDecimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
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

export const NestedEnumOrderStatusFilterSchema: z.ZodType<Prisma.NestedEnumOrderStatusFilter> = z.strictObject({
  equals: z.lazy(() => OrderStatusSchema).optional(),
  in: z.lazy(() => OrderStatusSchema).array().optional(),
  notIn: z.lazy(() => OrderStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => NestedEnumOrderStatusFilterSchema) ]).optional(),
});

export const NestedEnumOrderStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumOrderStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => OrderStatusSchema).optional(),
  in: z.lazy(() => OrderStatusSchema).array().optional(),
  notIn: z.lazy(() => OrderStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => NestedEnumOrderStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumOrderStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumOrderStatusFilterSchema).optional(),
});

export const NestedEnumPaymentStatusFilterSchema: z.ZodType<Prisma.NestedEnumPaymentStatusFilter> = z.strictObject({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => NestedEnumPaymentStatusFilterSchema) ]).optional(),
});

export const NestedEnumPaymentMethodFilterSchema: z.ZodType<Prisma.NestedEnumPaymentMethodFilter> = z.strictObject({
  equals: z.lazy(() => PaymentMethodSchema).optional(),
  in: z.lazy(() => PaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NestedEnumPaymentMethodFilterSchema) ]).optional(),
});

export const NestedEnumPaymentProviderFilterSchema: z.ZodType<Prisma.NestedEnumPaymentProviderFilter> = z.strictObject({
  equals: z.lazy(() => PaymentProviderSchema).optional(),
  in: z.lazy(() => PaymentProviderSchema).array().optional(),
  notIn: z.lazy(() => PaymentProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => NestedEnumPaymentProviderFilterSchema) ]).optional(),
});

export const NestedEnumPaymentStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentStatusWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentStatusSchema).optional(),
  in: z.lazy(() => PaymentStatusSchema).array().optional(),
  notIn: z.lazy(() => PaymentStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => NestedEnumPaymentStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentStatusFilterSchema).optional(),
});

export const NestedEnumPaymentMethodWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentMethodWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentMethodSchema).optional(),
  in: z.lazy(() => PaymentMethodSchema).array().optional(),
  notIn: z.lazy(() => PaymentMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => NestedEnumPaymentMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentMethodFilterSchema).optional(),
});

export const NestedEnumPaymentProviderWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumPaymentProviderWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => PaymentProviderSchema).optional(),
  in: z.lazy(() => PaymentProviderSchema).array().optional(),
  notIn: z.lazy(() => PaymentProviderSchema).array().optional(),
  not: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => NestedEnumPaymentProviderWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumPaymentProviderFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumPaymentProviderFilterSchema).optional(),
});

export const NestedEnumDeliveryMethodFilterSchema: z.ZodType<Prisma.NestedEnumDeliveryMethodFilter> = z.strictObject({
  equals: z.lazy(() => DeliveryMethodSchema).optional(),
  in: z.lazy(() => DeliveryMethodSchema).array().optional(),
  notIn: z.lazy(() => DeliveryMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => NestedEnumDeliveryMethodFilterSchema) ]).optional(),
});

export const NestedEnumDeliveryMethodWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumDeliveryMethodWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => DeliveryMethodSchema).optional(),
  in: z.lazy(() => DeliveryMethodSchema).array().optional(),
  notIn: z.lazy(() => DeliveryMethodSchema).array().optional(),
  not: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => NestedEnumDeliveryMethodWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumDeliveryMethodFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumDeliveryMethodFilterSchema).optional(),
});

export const AddressCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateWithoutUserInput> = z.strictObject({
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
});

export const AddressUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AddressUncheckedCreateWithoutUserInput> = z.strictObject({
  city: z.string(),
  street: z.string(),
  houseNumber: z.number().int(),
});

export const AddressCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AddressCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AddressWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AddressCreateWithoutUserInputSchema), z.lazy(() => AddressUncheckedCreateWithoutUserInputSchema) ]),
});

export const CartCreateWithoutUserInputSchema: z.ZodType<Prisma.CartCreateWithoutUserInput> = z.strictObject({
  items: z.lazy(() => CartItemCreateNestedManyWithoutCartInputSchema).optional(),
});

export const CartUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.CartUncheckedCreateWithoutUserInput> = z.strictObject({
  items: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutCartInputSchema).optional(),
});

export const CartCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.CartCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => CartWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema), z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]),
});

export const OrderCreateWithoutUserInputSchema: z.ZodType<Prisma.OrderCreateWithoutUserInput> = z.strictObject({
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  items: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutOrderInputSchema).optional(),
  delivery: z.lazy(() => DeliveryCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  items: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema) ]),
});

export const OrderCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.OrderCreateManyUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrderCreateManyUserInputSchema), z.lazy(() => OrderCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
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
  city: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  street: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  houseNumber: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CartUpsertWithoutUserInputSchema: z.ZodType<Prisma.CartUpsertWithoutUserInput> = z.strictObject({
  update: z.union([ z.lazy(() => CartUpdateWithoutUserInputSchema), z.lazy(() => CartUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => CartCreateWithoutUserInputSchema), z.lazy(() => CartUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => CartWhereInputSchema).optional(),
});

export const CartUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.CartUpdateToOneWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => CartWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CartUpdateWithoutUserInputSchema), z.lazy(() => CartUncheckedUpdateWithoutUserInputSchema) ]),
});

export const CartUpdateWithoutUserInputSchema: z.ZodType<Prisma.CartUpdateWithoutUserInput> = z.strictObject({
  items: z.lazy(() => CartItemUpdateManyWithoutCartNestedInputSchema).optional(),
});

export const CartUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.CartUncheckedUpdateWithoutUserInput> = z.strictObject({
  items: z.lazy(() => CartItemUncheckedUpdateManyWithoutCartNestedInputSchema).optional(),
});

export const OrderUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrderUpsertWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderUpdateWithoutUserInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutUserInputSchema), z.lazy(() => OrderUncheckedCreateWithoutUserInputSchema) ]),
});

export const OrderUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.OrderUpdateWithWhereUniqueWithoutUserInput> = z.strictObject({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateWithoutUserInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutUserInputSchema) ]),
});

export const OrderUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.OrderUpdateManyWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => OrderScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderUpdateManyMutationInputSchema), z.lazy(() => OrderUncheckedUpdateManyWithoutUserInputSchema) ]),
});

export const OrderScalarWhereInputSchema: z.ZodType<Prisma.OrderScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderScalarWhereInputSchema), z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderScalarWhereInputSchema), z.lazy(() => OrderScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  status: z.union([ z.lazy(() => EnumOrderStatusFilterSchema), z.lazy(() => OrderStatusSchema) ]).optional(),
  totalAmount: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  userId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
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
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema).optional(),
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
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
  cart: z.lazy(() => CartUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
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
  cart: z.lazy(() => CartUpdateOneWithoutUserNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
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
  cart: z.lazy(() => CartUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
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

export const CartItemCreateWithoutProductInputSchema: z.ZodType<Prisma.CartItemCreateWithoutProductInput> = z.strictObject({
  quantity: z.number().int().optional(),
  cart: z.lazy(() => CartCreateNestedOneWithoutItemsInputSchema),
});

export const CartItemUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateWithoutProductInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int().optional(),
  cartId: z.number().int(),
});

export const CartItemCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.CartItemCreateOrConnectWithoutProductInput> = z.strictObject({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema) ]),
});

export const CartItemCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.CartItemCreateManyProductInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => CartItemCreateManyProductInputSchema), z.lazy(() => CartItemCreateManyProductInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const OrderItemCreateWithoutProductInputSchema: z.ZodType<Prisma.OrderItemCreateWithoutProductInput> = z.strictObject({
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  order: z.lazy(() => OrderCreateNestedOneWithoutItemsInputSchema),
});

export const OrderItemUncheckedCreateWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutProductInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  orderId: z.number().int(),
});

export const OrderItemCreateOrConnectWithoutProductInputSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutProductInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema) ]),
});

export const OrderItemCreateManyProductInputEnvelopeSchema: z.ZodType<Prisma.OrderItemCreateManyProductInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrderItemCreateManyProductInputSchema), z.lazy(() => OrderItemCreateManyProductInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
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

export const CartItemUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.CartItemUpsertWithWhereUniqueWithoutProductInput> = z.strictObject({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CartItemUpdateWithoutProductInputSchema), z.lazy(() => CartItemUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => CartItemCreateWithoutProductInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutProductInputSchema) ]),
});

export const CartItemUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.CartItemUpdateWithWhereUniqueWithoutProductInput> = z.strictObject({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CartItemUpdateWithoutProductInputSchema), z.lazy(() => CartItemUncheckedUpdateWithoutProductInputSchema) ]),
});

export const CartItemUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.CartItemUpdateManyWithWhereWithoutProductInput> = z.strictObject({
  where: z.lazy(() => CartItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CartItemUpdateManyMutationInputSchema), z.lazy(() => CartItemUncheckedUpdateManyWithoutProductInputSchema) ]),
});

export const CartItemScalarWhereInputSchema: z.ZodType<Prisma.CartItemScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => CartItemScalarWhereInputSchema), z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CartItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CartItemScalarWhereInputSchema), z.lazy(() => CartItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  cartId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  productId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
});

export const OrderItemUpsertWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutProductInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderItemUpdateWithoutProductInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutProductInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutProductInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutProductInputSchema) ]),
});

export const OrderItemUpdateWithWhereUniqueWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutProductInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateWithoutProductInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutProductInputSchema) ]),
});

export const OrderItemUpdateManyWithWhereWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutProductInput> = z.strictObject({
  where: z.lazy(() => OrderItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateManyMutationInputSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductInputSchema) ]),
});

export const OrderItemScalarWhereInputSchema: z.ZodType<Prisma.OrderItemScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => OrderItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => OrderItemScalarWhereInputSchema), z.lazy(() => OrderItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  productId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  orderId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
});

export const ProductCreateWithoutProducerInputSchema: z.ZodType<Prisma.ProductCreateWithoutProducerInput> = z.strictObject({
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  cartItems: z.lazy(() => CartItemCreateNestedManyWithoutProductInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductUncheckedCreateWithoutProducerInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutProducerInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  cartItems: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
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
  price: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  category: z.union([ z.lazy(() => EnumCategoryFilterSchema), z.lazy(() => CategorySchema) ]).optional(),
  details: z.lazy(() => JsonFilterSchema).optional(),
  producerId: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
});

export const CartItemCreateWithoutCartInputSchema: z.ZodType<Prisma.CartItemCreateWithoutCartInput> = z.strictObject({
  quantity: z.number().int().optional(),
  product: z.lazy(() => ProductCreateNestedOneWithoutCartItemsInputSchema),
});

export const CartItemUncheckedCreateWithoutCartInputSchema: z.ZodType<Prisma.CartItemUncheckedCreateWithoutCartInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int().optional(),
  productId: z.number().int(),
});

export const CartItemCreateOrConnectWithoutCartInputSchema: z.ZodType<Prisma.CartItemCreateOrConnectWithoutCartInput> = z.strictObject({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema) ]),
});

export const CartItemCreateManyCartInputEnvelopeSchema: z.ZodType<Prisma.CartItemCreateManyCartInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => CartItemCreateManyCartInputSchema), z.lazy(() => CartItemCreateManyCartInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserCreateWithoutCartInputSchema: z.ZodType<Prisma.UserCreateWithoutCartInput> = z.strictObject({
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
  orders: z.lazy(() => OrderCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutCartInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCartInput> = z.strictObject({
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
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutCartInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCartInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema), z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]),
});

export const CartItemUpsertWithWhereUniqueWithoutCartInputSchema: z.ZodType<Prisma.CartItemUpsertWithWhereUniqueWithoutCartInput> = z.strictObject({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CartItemUpdateWithoutCartInputSchema), z.lazy(() => CartItemUncheckedUpdateWithoutCartInputSchema) ]),
  create: z.union([ z.lazy(() => CartItemCreateWithoutCartInputSchema), z.lazy(() => CartItemUncheckedCreateWithoutCartInputSchema) ]),
});

export const CartItemUpdateWithWhereUniqueWithoutCartInputSchema: z.ZodType<Prisma.CartItemUpdateWithWhereUniqueWithoutCartInput> = z.strictObject({
  where: z.lazy(() => CartItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CartItemUpdateWithoutCartInputSchema), z.lazy(() => CartItemUncheckedUpdateWithoutCartInputSchema) ]),
});

export const CartItemUpdateManyWithWhereWithoutCartInputSchema: z.ZodType<Prisma.CartItemUpdateManyWithWhereWithoutCartInput> = z.strictObject({
  where: z.lazy(() => CartItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CartItemUpdateManyMutationInputSchema), z.lazy(() => CartItemUncheckedUpdateManyWithoutCartInputSchema) ]),
});

export const UserUpsertWithoutCartInputSchema: z.ZodType<Prisma.UserUpsertWithoutCartInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutCartInputSchema), z.lazy(() => UserUncheckedUpdateWithoutCartInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCartInputSchema), z.lazy(() => UserUncheckedCreateWithoutCartInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutCartInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCartInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCartInputSchema), z.lazy(() => UserUncheckedUpdateWithoutCartInputSchema) ]),
});

export const UserUpdateWithoutCartInputSchema: z.ZodType<Prisma.UserUpdateWithoutCartInput> = z.strictObject({
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
  orders: z.lazy(() => OrderUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutCartInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCartInput> = z.strictObject({
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
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  orders: z.lazy(() => OrderUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
});

export const CartCreateWithoutItemsInputSchema: z.ZodType<Prisma.CartCreateWithoutItemsInput> = z.strictObject({
  user: z.lazy(() => UserCreateNestedOneWithoutCartInputSchema),
});

export const CartUncheckedCreateWithoutItemsInputSchema: z.ZodType<Prisma.CartUncheckedCreateWithoutItemsInput> = z.strictObject({
  id: z.number().int(),
});

export const CartCreateOrConnectWithoutItemsInputSchema: z.ZodType<Prisma.CartCreateOrConnectWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => CartWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CartCreateWithoutItemsInputSchema), z.lazy(() => CartUncheckedCreateWithoutItemsInputSchema) ]),
});

export const ProductCreateWithoutCartItemsInputSchema: z.ZodType<Prisma.ProductCreateWithoutCartItemsInput> = z.strictObject({
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producer: z.lazy(() => ProducerCreateNestedOneWithoutProductsInputSchema),
  orderItems: z.lazy(() => OrderItemCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductUncheckedCreateWithoutCartItemsInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutCartItemsInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producerId: z.number().int(),
  orderItems: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductCreateOrConnectWithoutCartItemsInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutCartItemsInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutCartItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutCartItemsInputSchema) ]),
});

export const CartUpsertWithoutItemsInputSchema: z.ZodType<Prisma.CartUpsertWithoutItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => CartUpdateWithoutItemsInputSchema), z.lazy(() => CartUncheckedUpdateWithoutItemsInputSchema) ]),
  create: z.union([ z.lazy(() => CartCreateWithoutItemsInputSchema), z.lazy(() => CartUncheckedCreateWithoutItemsInputSchema) ]),
  where: z.lazy(() => CartWhereInputSchema).optional(),
});

export const CartUpdateToOneWithWhereWithoutItemsInputSchema: z.ZodType<Prisma.CartUpdateToOneWithWhereWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => CartWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CartUpdateWithoutItemsInputSchema), z.lazy(() => CartUncheckedUpdateWithoutItemsInputSchema) ]),
});

export const CartUpdateWithoutItemsInputSchema: z.ZodType<Prisma.CartUpdateWithoutItemsInput> = z.strictObject({
  user: z.lazy(() => UserUpdateOneRequiredWithoutCartNestedInputSchema).optional(),
});

export const CartUncheckedUpdateWithoutItemsInputSchema: z.ZodType<Prisma.CartUncheckedUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductUpsertWithoutCartItemsInputSchema: z.ZodType<Prisma.ProductUpsertWithoutCartItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ProductUpdateWithoutCartItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutCartItemsInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutCartItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutCartItemsInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional(),
});

export const ProductUpdateToOneWithWhereWithoutCartItemsInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutCartItemsInput> = z.strictObject({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutCartItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutCartItemsInputSchema) ]),
});

export const ProductUpdateWithoutCartItemsInputSchema: z.ZodType<Prisma.ProductUpdateWithoutCartItemsInput> = z.strictObject({
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producer: z.lazy(() => ProducerUpdateOneRequiredWithoutProductsNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateWithoutCartItemsInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutCartItemsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  orderItems: z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const OrderItemCreateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateWithoutOrderInput> = z.strictObject({
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  product: z.lazy(() => ProductCreateNestedOneWithoutOrderItemsInputSchema),
});

export const OrderItemUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedCreateWithoutOrderInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  productId: z.number().int(),
});

export const OrderItemCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemCreateOrConnectWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema) ]),
});

export const OrderItemCreateManyOrderInputEnvelopeSchema: z.ZodType<Prisma.OrderItemCreateManyOrderInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => OrderItemCreateManyOrderInputSchema), z.lazy(() => OrderItemCreateManyOrderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const UserCreateWithoutOrdersInputSchema: z.ZodType<Prisma.UserCreateWithoutOrdersInput> = z.strictObject({
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
  cart: z.lazy(() => CartCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutOrdersInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutOrdersInput> = z.strictObject({
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
  address: z.lazy(() => AddressUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  cart: z.lazy(() => CartUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutOrdersInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutOrdersInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutOrdersInputSchema), z.lazy(() => UserUncheckedCreateWithoutOrdersInputSchema) ]),
});

export const PaymentCreateWithoutOrderInputSchema: z.ZodType<Prisma.PaymentCreateWithoutOrderInput> = z.strictObject({
  status: z.lazy(() => PaymentStatusSchema).optional(),
  method: z.lazy(() => PaymentMethodSchema),
  amount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  provider: z.lazy(() => PaymentProviderSchema),
  externalId: z.string().optional().nullable(),
});

export const PaymentUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutOrderInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => PaymentStatusSchema).optional(),
  method: z.lazy(() => PaymentMethodSchema),
  amount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  provider: z.lazy(() => PaymentProviderSchema),
  externalId: z.string().optional().nullable(),
});

export const PaymentCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema) ]),
});

export const DeliveryCreateWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryCreateWithoutOrderInput> = z.strictObject({
  method: z.lazy(() => DeliveryMethodSchema),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  trackingNumber: z.string().optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
});

export const DeliveryUncheckedCreateWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryUncheckedCreateWithoutOrderInput> = z.strictObject({
  id: z.number().int().optional(),
  method: z.lazy(() => DeliveryMethodSchema),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  trackingNumber: z.string().optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
});

export const DeliveryCreateOrConnectWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryCreateOrConnectWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => DeliveryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => DeliveryCreateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedCreateWithoutOrderInputSchema) ]),
});

export const OrderItemUpsertWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpsertWithWhereUniqueWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => OrderItemUpdateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => OrderItemCreateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedCreateWithoutOrderInputSchema) ]),
});

export const OrderItemUpdateWithWhereUniqueWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateWithWhereUniqueWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => OrderItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateWithoutOrderInputSchema), z.lazy(() => OrderItemUncheckedUpdateWithoutOrderInputSchema) ]),
});

export const OrderItemUpdateManyWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateManyWithWhereWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => OrderItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => OrderItemUpdateManyMutationInputSchema), z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderInputSchema) ]),
});

export const UserUpsertWithoutOrdersInputSchema: z.ZodType<Prisma.UserUpsertWithoutOrdersInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutOrdersInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOrdersInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutOrdersInputSchema), z.lazy(() => UserUncheckedCreateWithoutOrdersInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutOrdersInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutOrdersInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutOrdersInputSchema), z.lazy(() => UserUncheckedUpdateWithoutOrdersInputSchema) ]),
});

export const UserUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.UserUpdateWithoutOrdersInput> = z.strictObject({
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
  cart: z.lazy(() => CartUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutOrdersInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutOrdersInput> = z.strictObject({
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
  address: z.lazy(() => AddressUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  cart: z.lazy(() => CartUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
});

export const PaymentUpsertWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUpsertWithoutOrderInput> = z.strictObject({
  update: z.union([ z.lazy(() => PaymentUpdateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => PaymentCreateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutOrderInputSchema) ]),
  where: z.lazy(() => PaymentWhereInputSchema).optional(),
});

export const PaymentUpdateToOneWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUpdateToOneWithWhereWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => PaymentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PaymentUpdateWithoutOrderInputSchema), z.lazy(() => PaymentUncheckedUpdateWithoutOrderInputSchema) ]),
});

export const PaymentUpdateWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUpdateWithoutOrderInput> = z.strictObject({
  status: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => EnumPaymentProviderFieldUpdateOperationsInputSchema) ]).optional(),
  externalId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const PaymentUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateWithoutOrderInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PaymentStatusSchema), z.lazy(() => EnumPaymentStatusFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => PaymentMethodSchema), z.lazy(() => EnumPaymentMethodFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  provider: z.union([ z.lazy(() => PaymentProviderSchema), z.lazy(() => EnumPaymentProviderFieldUpdateOperationsInputSchema) ]).optional(),
  externalId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const DeliveryUpsertWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryUpsertWithoutOrderInput> = z.strictObject({
  update: z.union([ z.lazy(() => DeliveryUpdateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedUpdateWithoutOrderInputSchema) ]),
  create: z.union([ z.lazy(() => DeliveryCreateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedCreateWithoutOrderInputSchema) ]),
  where: z.lazy(() => DeliveryWhereInputSchema).optional(),
});

export const DeliveryUpdateToOneWithWhereWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryUpdateToOneWithWhereWithoutOrderInput> = z.strictObject({
  where: z.lazy(() => DeliveryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => DeliveryUpdateWithoutOrderInputSchema), z.lazy(() => DeliveryUncheckedUpdateWithoutOrderInputSchema) ]),
});

export const DeliveryUpdateWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryUpdateWithoutOrderInput> = z.strictObject({
  method: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => EnumDeliveryMethodFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  trackingNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export const DeliveryUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.DeliveryUncheckedUpdateWithoutOrderInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.lazy(() => DeliveryMethodSchema), z.lazy(() => EnumDeliveryMethodFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  trackingNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export const ProductCreateWithoutOrderItemsInputSchema: z.ZodType<Prisma.ProductCreateWithoutOrderItemsInput> = z.strictObject({
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producer: z.lazy(() => ProducerCreateNestedOneWithoutProductsInputSchema),
  cartItems: z.lazy(() => CartItemCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductUncheckedCreateWithoutOrderItemsInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutOrderItemsInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  producerId: z.number().int(),
  cartItems: z.lazy(() => CartItemUncheckedCreateNestedManyWithoutProductInputSchema).optional(),
});

export const ProductCreateOrConnectWithoutOrderItemsInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutOrderItemsInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutOrderItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemsInputSchema) ]),
});

export const OrderCreateWithoutItemsInputSchema: z.ZodType<Prisma.OrderCreateWithoutItemsInput> = z.strictObject({
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutOrderInputSchema).optional(),
  delivery: z.lazy(() => DeliveryCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderUncheckedCreateWithoutItemsInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutItemsInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  userId: z.number().int(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderCreateOrConnectWithoutItemsInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputSchema) ]),
});

export const ProductUpsertWithoutOrderItemsInputSchema: z.ZodType<Prisma.ProductUpsertWithoutOrderItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => ProductUpdateWithoutOrderItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemsInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutOrderItemsInputSchema), z.lazy(() => ProductUncheckedCreateWithoutOrderItemsInputSchema) ]),
  where: z.lazy(() => ProductWhereInputSchema).optional(),
});

export const ProductUpdateToOneWithWhereWithoutOrderItemsInputSchema: z.ZodType<Prisma.ProductUpdateToOneWithWhereWithoutOrderItemsInput> = z.strictObject({
  where: z.lazy(() => ProductWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProductUpdateWithoutOrderItemsInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutOrderItemsInputSchema) ]),
});

export const ProductUpdateWithoutOrderItemsInputSchema: z.ZodType<Prisma.ProductUpdateWithoutOrderItemsInput> = z.strictObject({
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producer: z.lazy(() => ProducerUpdateOneRequiredWithoutProductsNestedInputSchema).optional(),
  cartItems: z.lazy(() => CartItemUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateWithoutOrderItemsInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutOrderItemsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  producerId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartItems: z.lazy(() => CartItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const OrderUpsertWithoutItemsInputSchema: z.ZodType<Prisma.OrderUpsertWithoutItemsInput> = z.strictObject({
  update: z.union([ z.lazy(() => OrderUpdateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedCreateWithoutItemsInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional(),
});

export const OrderUpdateToOneWithWhereWithoutItemsInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutItemsInput> = z.strictObject({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutItemsInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutItemsInputSchema) ]),
});

export const OrderUpdateWithoutItemsInputSchema: z.ZodType<Prisma.OrderUpdateWithoutItemsInput> = z.strictObject({
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutOrderNestedInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderUncheckedUpdateWithoutItemsInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutItemsInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderCreateWithoutPaymentInputSchema: z.ZodType<Prisma.OrderCreateWithoutPaymentInput> = z.strictObject({
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  items: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  delivery: z.lazy(() => DeliveryCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderUncheckedCreateWithoutPaymentInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutPaymentInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  userId: z.number().int(),
  items: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderCreateOrConnectWithoutPaymentInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutPaymentInput> = z.strictObject({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutPaymentInputSchema), z.lazy(() => OrderUncheckedCreateWithoutPaymentInputSchema) ]),
});

export const OrderUpsertWithoutPaymentInputSchema: z.ZodType<Prisma.OrderUpsertWithoutPaymentInput> = z.strictObject({
  update: z.union([ z.lazy(() => OrderUpdateWithoutPaymentInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutPaymentInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutPaymentInputSchema), z.lazy(() => OrderUncheckedCreateWithoutPaymentInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional(),
});

export const OrderUpdateToOneWithWhereWithoutPaymentInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutPaymentInput> = z.strictObject({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutPaymentInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutPaymentInputSchema) ]),
});

export const OrderUpdateWithoutPaymentInputSchema: z.ZodType<Prisma.OrderUpdateWithoutPaymentInput> = z.strictObject({
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderUncheckedUpdateWithoutPaymentInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutPaymentInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderCreateWithoutDeliveryInputSchema: z.ZodType<Prisma.OrderCreateWithoutDeliveryInput> = z.strictObject({
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  items: z.lazy(() => OrderItemCreateNestedManyWithoutOrderInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutOrdersInputSchema),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderUncheckedCreateWithoutDeliveryInputSchema: z.ZodType<Prisma.OrderUncheckedCreateWithoutDeliveryInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  userId: z.number().int(),
  items: z.lazy(() => OrderItemUncheckedCreateNestedManyWithoutOrderInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutOrderInputSchema).optional(),
});

export const OrderCreateOrConnectWithoutDeliveryInputSchema: z.ZodType<Prisma.OrderCreateOrConnectWithoutDeliveryInput> = z.strictObject({
  where: z.lazy(() => OrderWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryInputSchema), z.lazy(() => OrderUncheckedCreateWithoutDeliveryInputSchema) ]),
});

export const OrderUpsertWithoutDeliveryInputSchema: z.ZodType<Prisma.OrderUpsertWithoutDeliveryInput> = z.strictObject({
  update: z.union([ z.lazy(() => OrderUpdateWithoutDeliveryInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutDeliveryInputSchema) ]),
  create: z.union([ z.lazy(() => OrderCreateWithoutDeliveryInputSchema), z.lazy(() => OrderUncheckedCreateWithoutDeliveryInputSchema) ]),
  where: z.lazy(() => OrderWhereInputSchema).optional(),
});

export const OrderUpdateToOneWithWhereWithoutDeliveryInputSchema: z.ZodType<Prisma.OrderUpdateToOneWithWhereWithoutDeliveryInput> = z.strictObject({
  where: z.lazy(() => OrderWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => OrderUpdateWithoutDeliveryInputSchema), z.lazy(() => OrderUncheckedUpdateWithoutDeliveryInputSchema) ]),
});

export const OrderUpdateWithoutDeliveryInputSchema: z.ZodType<Prisma.OrderUpdateWithoutDeliveryInput> = z.strictObject({
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutOrdersNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderUncheckedUpdateWithoutDeliveryInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutDeliveryInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderCreateManyUserInputSchema: z.ZodType<Prisma.OrderCreateManyUserInput> = z.strictObject({
  id: z.number().int().optional(),
  status: z.lazy(() => OrderStatusSchema).optional(),
  totalAmount: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
});

export const OrderUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrderUpdateWithoutUserInput> = z.strictObject({
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUpdateManyWithoutOrderNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutOrderNestedInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateWithoutUserInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  items: z.lazy(() => OrderItemUncheckedUpdateManyWithoutOrderNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
  delivery: z.lazy(() => DeliveryUncheckedUpdateOneWithoutOrderNestedInputSchema).optional(),
});

export const OrderUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.OrderUncheckedUpdateManyWithoutUserInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => OrderStatusSchema), z.lazy(() => EnumOrderStatusFieldUpdateOperationsInputSchema) ]).optional(),
  totalAmount: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CartItemCreateManyProductInputSchema: z.ZodType<Prisma.CartItemCreateManyProductInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int().optional(),
  cartId: z.number().int(),
});

export const OrderItemCreateManyProductInputSchema: z.ZodType<Prisma.OrderItemCreateManyProductInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  orderId: z.number().int(),
});

export const CartItemUpdateWithoutProductInputSchema: z.ZodType<Prisma.CartItemUpdateWithoutProductInput> = z.strictObject({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cart: z.lazy(() => CartUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const CartItemUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateWithoutProductInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CartItemUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyWithoutProductInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  cartId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemUpdateWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUpdateWithoutProductInput> = z.strictObject({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.lazy(() => OrderUpdateOneRequiredWithoutItemsNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutProductInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemUncheckedUpdateManyWithoutProductInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutProductInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  orderId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductCreateManyProducerInputSchema: z.ZodType<Prisma.ProductCreateManyProducerInput> = z.strictObject({
  id: z.number().int().optional(),
  productName: z.string(),
  imgUrls: z.union([ z.lazy(() => ProductCreateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  description: z.string(),
  quantity: z.number().int().optional(),
  category: z.lazy(() => CategorySchema),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
});

export const ProductUpdateWithoutProducerInputSchema: z.ZodType<Prisma.ProductUpdateWithoutProducerInput> = z.strictObject({
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  cartItems: z.lazy(() => CartItemUpdateManyWithoutProductNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateWithoutProducerInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutProducerInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  cartItems: z.lazy(() => CartItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
  orderItems: z.lazy(() => OrderItemUncheckedUpdateManyWithoutProductNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateManyWithoutProducerInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutProducerInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imgUrls: z.union([ z.lazy(() => ProductUpdateimgUrlsInputSchema), z.string().array() ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategorySchema), z.lazy(() => EnumCategoryFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
});

export const CartItemCreateManyCartInputSchema: z.ZodType<Prisma.CartItemCreateManyCartInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int().optional(),
  productId: z.number().int(),
});

export const CartItemUpdateWithoutCartInputSchema: z.ZodType<Prisma.CartItemUpdateWithoutCartInput> = z.strictObject({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutCartItemsNestedInputSchema).optional(),
});

export const CartItemUncheckedUpdateWithoutCartInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateWithoutCartInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const CartItemUncheckedUpdateManyWithoutCartInputSchema: z.ZodType<Prisma.CartItemUncheckedUpdateManyWithoutCartInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemCreateManyOrderInputSchema: z.ZodType<Prisma.OrderItemCreateManyOrderInput> = z.strictObject({
  id: z.number().int().optional(),
  quantity: z.number().int(),
  price: z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  productId: z.number().int(),
});

export const OrderItemUpdateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUpdateWithoutOrderInput> = z.strictObject({
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  product: z.lazy(() => ProductUpdateOneRequiredWithoutOrderItemsNestedInputSchema).optional(),
});

export const OrderItemUncheckedUpdateWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateWithoutOrderInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
});

export const OrderItemUncheckedUpdateManyWithoutOrderInputSchema: z.ZodType<Prisma.OrderItemUncheckedUpdateManyWithoutOrderInput> = z.strictObject({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.union([z.number(),z.string(),z.instanceof(PrismaDecimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  productId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
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

export const CartFindFirstArgsSchema: z.ZodType<Omit<Prisma.CartFindFirstArgs, "select" | "include">> = z.object({
  where: CartWhereInputSchema.optional(), 
  orderBy: z.union([ CartOrderByWithRelationInputSchema.array(), CartOrderByWithRelationInputSchema ]).optional(),
  cursor: CartWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartScalarFieldEnumSchema, CartScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CartFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.CartFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: CartWhereInputSchema.optional(), 
  orderBy: z.union([ CartOrderByWithRelationInputSchema.array(), CartOrderByWithRelationInputSchema ]).optional(),
  cursor: CartWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartScalarFieldEnumSchema, CartScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CartFindManyArgsSchema: z.ZodType<Omit<Prisma.CartFindManyArgs, "select" | "include">> = z.object({
  where: CartWhereInputSchema.optional(), 
  orderBy: z.union([ CartOrderByWithRelationInputSchema.array(), CartOrderByWithRelationInputSchema ]).optional(),
  cursor: CartWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartScalarFieldEnumSchema, CartScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CartAggregateArgsSchema: z.ZodType<Prisma.CartAggregateArgs> = z.object({
  where: CartWhereInputSchema.optional(), 
  orderBy: z.union([ CartOrderByWithRelationInputSchema.array(), CartOrderByWithRelationInputSchema ]).optional(),
  cursor: CartWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CartGroupByArgsSchema: z.ZodType<Prisma.CartGroupByArgs> = z.object({
  where: CartWhereInputSchema.optional(), 
  orderBy: z.union([ CartOrderByWithAggregationInputSchema.array(), CartOrderByWithAggregationInputSchema ]).optional(),
  by: CartScalarFieldEnumSchema.array(), 
  having: CartScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CartFindUniqueArgsSchema: z.ZodType<Omit<Prisma.CartFindUniqueArgs, "select" | "include">> = z.object({
  where: CartWhereUniqueInputSchema, 
}).strict();

export const CartFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.CartFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: CartWhereUniqueInputSchema, 
}).strict();

export const CartItemFindFirstArgsSchema: z.ZodType<Omit<Prisma.CartItemFindFirstArgs, "select" | "include">> = z.object({
  where: CartItemWhereInputSchema.optional(), 
  orderBy: z.union([ CartItemOrderByWithRelationInputSchema.array(), CartItemOrderByWithRelationInputSchema ]).optional(),
  cursor: CartItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartItemScalarFieldEnumSchema, CartItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CartItemFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.CartItemFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: CartItemWhereInputSchema.optional(), 
  orderBy: z.union([ CartItemOrderByWithRelationInputSchema.array(), CartItemOrderByWithRelationInputSchema ]).optional(),
  cursor: CartItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartItemScalarFieldEnumSchema, CartItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CartItemFindManyArgsSchema: z.ZodType<Omit<Prisma.CartItemFindManyArgs, "select" | "include">> = z.object({
  where: CartItemWhereInputSchema.optional(), 
  orderBy: z.union([ CartItemOrderByWithRelationInputSchema.array(), CartItemOrderByWithRelationInputSchema ]).optional(),
  cursor: CartItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CartItemScalarFieldEnumSchema, CartItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CartItemAggregateArgsSchema: z.ZodType<Prisma.CartItemAggregateArgs> = z.object({
  where: CartItemWhereInputSchema.optional(), 
  orderBy: z.union([ CartItemOrderByWithRelationInputSchema.array(), CartItemOrderByWithRelationInputSchema ]).optional(),
  cursor: CartItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CartItemGroupByArgsSchema: z.ZodType<Prisma.CartItemGroupByArgs> = z.object({
  where: CartItemWhereInputSchema.optional(), 
  orderBy: z.union([ CartItemOrderByWithAggregationInputSchema.array(), CartItemOrderByWithAggregationInputSchema ]).optional(),
  by: CartItemScalarFieldEnumSchema.array(), 
  having: CartItemScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CartItemFindUniqueArgsSchema: z.ZodType<Omit<Prisma.CartItemFindUniqueArgs, "select" | "include">> = z.object({
  where: CartItemWhereUniqueInputSchema, 
}).strict();

export const CartItemFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.CartItemFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: CartItemWhereUniqueInputSchema, 
}).strict();

export const OrderFindFirstArgsSchema: z.ZodType<Omit<Prisma.OrderFindFirstArgs, "select" | "include">> = z.object({
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(), OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema, OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.OrderFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(), OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema, OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderFindManyArgsSchema: z.ZodType<Omit<Prisma.OrderFindManyArgs, "select" | "include">> = z.object({
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(), OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderScalarFieldEnumSchema, OrderScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderAggregateArgsSchema: z.ZodType<Prisma.OrderAggregateArgs> = z.object({
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithRelationInputSchema.array(), OrderOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderGroupByArgsSchema: z.ZodType<Prisma.OrderGroupByArgs> = z.object({
  where: OrderWhereInputSchema.optional(), 
  orderBy: z.union([ OrderOrderByWithAggregationInputSchema.array(), OrderOrderByWithAggregationInputSchema ]).optional(),
  by: OrderScalarFieldEnumSchema.array(), 
  having: OrderScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderFindUniqueArgsSchema: z.ZodType<Omit<Prisma.OrderFindUniqueArgs, "select" | "include">> = z.object({
  where: OrderWhereUniqueInputSchema, 
}).strict();

export const OrderFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.OrderFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: OrderWhereUniqueInputSchema, 
}).strict();

export const OrderItemFindFirstArgsSchema: z.ZodType<Omit<Prisma.OrderItemFindFirstArgs, "select" | "include">> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(), OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.OrderItemFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(), OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemFindManyArgsSchema: z.ZodType<Omit<Prisma.OrderItemFindManyArgs, "select" | "include">> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(), OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ OrderItemScalarFieldEnumSchema, OrderItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const OrderItemAggregateArgsSchema: z.ZodType<Prisma.OrderItemAggregateArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithRelationInputSchema.array(), OrderItemOrderByWithRelationInputSchema ]).optional(),
  cursor: OrderItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderItemGroupByArgsSchema: z.ZodType<Prisma.OrderItemGroupByArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  orderBy: z.union([ OrderItemOrderByWithAggregationInputSchema.array(), OrderItemOrderByWithAggregationInputSchema ]).optional(),
  by: OrderItemScalarFieldEnumSchema.array(), 
  having: OrderItemScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const OrderItemFindUniqueArgsSchema: z.ZodType<Omit<Prisma.OrderItemFindUniqueArgs, "select" | "include">> = z.object({
  where: OrderItemWhereUniqueInputSchema, 
}).strict();

export const OrderItemFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.OrderItemFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: OrderItemWhereUniqueInputSchema, 
}).strict();

export const PaymentFindFirstArgsSchema: z.ZodType<Omit<Prisma.PaymentFindFirstArgs, "select" | "include">> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(), PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PaymentFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.PaymentFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(), PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PaymentFindManyArgsSchema: z.ZodType<Omit<Prisma.PaymentFindManyArgs, "select" | "include">> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(), PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PaymentAggregateArgsSchema: z.ZodType<Prisma.PaymentAggregateArgs> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(), PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PaymentGroupByArgsSchema: z.ZodType<Prisma.PaymentGroupByArgs> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithAggregationInputSchema.array(), PaymentOrderByWithAggregationInputSchema ]).optional(),
  by: PaymentScalarFieldEnumSchema.array(), 
  having: PaymentScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PaymentFindUniqueArgsSchema: z.ZodType<Omit<Prisma.PaymentFindUniqueArgs, "select" | "include">> = z.object({
  where: PaymentWhereUniqueInputSchema, 
}).strict();

export const PaymentFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.PaymentFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: PaymentWhereUniqueInputSchema, 
}).strict();

export const DeliveryFindFirstArgsSchema: z.ZodType<Omit<Prisma.DeliveryFindFirstArgs, "select" | "include">> = z.object({
  where: DeliveryWhereInputSchema.optional(), 
  orderBy: z.union([ DeliveryOrderByWithRelationInputSchema.array(), DeliveryOrderByWithRelationInputSchema ]).optional(),
  cursor: DeliveryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DeliveryScalarFieldEnumSchema, DeliveryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DeliveryFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.DeliveryFindFirstOrThrowArgs, "select" | "include">> = z.object({
  where: DeliveryWhereInputSchema.optional(), 
  orderBy: z.union([ DeliveryOrderByWithRelationInputSchema.array(), DeliveryOrderByWithRelationInputSchema ]).optional(),
  cursor: DeliveryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DeliveryScalarFieldEnumSchema, DeliveryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DeliveryFindManyArgsSchema: z.ZodType<Omit<Prisma.DeliveryFindManyArgs, "select" | "include">> = z.object({
  where: DeliveryWhereInputSchema.optional(), 
  orderBy: z.union([ DeliveryOrderByWithRelationInputSchema.array(), DeliveryOrderByWithRelationInputSchema ]).optional(),
  cursor: DeliveryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ DeliveryScalarFieldEnumSchema, DeliveryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const DeliveryAggregateArgsSchema: z.ZodType<Prisma.DeliveryAggregateArgs> = z.object({
  where: DeliveryWhereInputSchema.optional(), 
  orderBy: z.union([ DeliveryOrderByWithRelationInputSchema.array(), DeliveryOrderByWithRelationInputSchema ]).optional(),
  cursor: DeliveryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DeliveryGroupByArgsSchema: z.ZodType<Prisma.DeliveryGroupByArgs> = z.object({
  where: DeliveryWhereInputSchema.optional(), 
  orderBy: z.union([ DeliveryOrderByWithAggregationInputSchema.array(), DeliveryOrderByWithAggregationInputSchema ]).optional(),
  by: DeliveryScalarFieldEnumSchema.array(), 
  having: DeliveryScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const DeliveryFindUniqueArgsSchema: z.ZodType<Omit<Prisma.DeliveryFindUniqueArgs, "select" | "include">> = z.object({
  where: DeliveryWhereUniqueInputSchema, 
}).strict();

export const DeliveryFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.DeliveryFindUniqueOrThrowArgs, "select" | "include">> = z.object({
  where: DeliveryWhereUniqueInputSchema, 
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

export const CartCreateArgsSchema: z.ZodType<Omit<Prisma.CartCreateArgs, "select" | "include">> = z.object({
  data: z.union([ CartCreateInputSchema, CartUncheckedCreateInputSchema ]),
}).strict();

export const CartUpsertArgsSchema: z.ZodType<Omit<Prisma.CartUpsertArgs, "select" | "include">> = z.object({
  where: CartWhereUniqueInputSchema, 
  create: z.union([ CartCreateInputSchema, CartUncheckedCreateInputSchema ]),
  update: z.union([ CartUpdateInputSchema, CartUncheckedUpdateInputSchema ]),
}).strict();

export const CartCreateManyArgsSchema: z.ZodType<Prisma.CartCreateManyArgs> = z.object({
  data: z.union([ CartCreateManyInputSchema, CartCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CartCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CartCreateManyAndReturnArgs> = z.object({
  data: z.union([ CartCreateManyInputSchema, CartCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CartDeleteArgsSchema: z.ZodType<Omit<Prisma.CartDeleteArgs, "select" | "include">> = z.object({
  where: CartWhereUniqueInputSchema, 
}).strict();

export const CartUpdateArgsSchema: z.ZodType<Omit<Prisma.CartUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ CartUpdateInputSchema, CartUncheckedUpdateInputSchema ]),
  where: CartWhereUniqueInputSchema, 
}).strict();

export const CartUpdateManyArgsSchema: z.ZodType<Prisma.CartUpdateManyArgs> = z.object({
  data: z.union([ CartUpdateManyMutationInputSchema, CartUncheckedUpdateManyInputSchema ]),
  where: CartWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CartUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CartUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CartUpdateManyMutationInputSchema, CartUncheckedUpdateManyInputSchema ]),
  where: CartWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CartDeleteManyArgsSchema: z.ZodType<Prisma.CartDeleteManyArgs> = z.object({
  where: CartWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CartItemCreateArgsSchema: z.ZodType<Omit<Prisma.CartItemCreateArgs, "select" | "include">> = z.object({
  data: z.union([ CartItemCreateInputSchema, CartItemUncheckedCreateInputSchema ]),
}).strict();

export const CartItemUpsertArgsSchema: z.ZodType<Omit<Prisma.CartItemUpsertArgs, "select" | "include">> = z.object({
  where: CartItemWhereUniqueInputSchema, 
  create: z.union([ CartItemCreateInputSchema, CartItemUncheckedCreateInputSchema ]),
  update: z.union([ CartItemUpdateInputSchema, CartItemUncheckedUpdateInputSchema ]),
}).strict();

export const CartItemCreateManyArgsSchema: z.ZodType<Prisma.CartItemCreateManyArgs> = z.object({
  data: z.union([ CartItemCreateManyInputSchema, CartItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CartItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CartItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ CartItemCreateManyInputSchema, CartItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CartItemDeleteArgsSchema: z.ZodType<Omit<Prisma.CartItemDeleteArgs, "select" | "include">> = z.object({
  where: CartItemWhereUniqueInputSchema, 
}).strict();

export const CartItemUpdateArgsSchema: z.ZodType<Omit<Prisma.CartItemUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ CartItemUpdateInputSchema, CartItemUncheckedUpdateInputSchema ]),
  where: CartItemWhereUniqueInputSchema, 
}).strict();

export const CartItemUpdateManyArgsSchema: z.ZodType<Prisma.CartItemUpdateManyArgs> = z.object({
  data: z.union([ CartItemUpdateManyMutationInputSchema, CartItemUncheckedUpdateManyInputSchema ]),
  where: CartItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CartItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CartItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CartItemUpdateManyMutationInputSchema, CartItemUncheckedUpdateManyInputSchema ]),
  where: CartItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CartItemDeleteManyArgsSchema: z.ZodType<Prisma.CartItemDeleteManyArgs> = z.object({
  where: CartItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderCreateArgsSchema: z.ZodType<Omit<Prisma.OrderCreateArgs, "select" | "include">> = z.object({
  data: z.union([ OrderCreateInputSchema, OrderUncheckedCreateInputSchema ]),
}).strict();

export const OrderUpsertArgsSchema: z.ZodType<Omit<Prisma.OrderUpsertArgs, "select" | "include">> = z.object({
  where: OrderWhereUniqueInputSchema, 
  create: z.union([ OrderCreateInputSchema, OrderUncheckedCreateInputSchema ]),
  update: z.union([ OrderUpdateInputSchema, OrderUncheckedUpdateInputSchema ]),
}).strict();

export const OrderCreateManyArgsSchema: z.ZodType<Prisma.OrderCreateManyArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema, OrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderCreateManyInputSchema, OrderCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderDeleteArgsSchema: z.ZodType<Omit<Prisma.OrderDeleteArgs, "select" | "include">> = z.object({
  where: OrderWhereUniqueInputSchema, 
}).strict();

export const OrderUpdateArgsSchema: z.ZodType<Omit<Prisma.OrderUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ OrderUpdateInputSchema, OrderUncheckedUpdateInputSchema ]),
  where: OrderWhereUniqueInputSchema, 
}).strict();

export const OrderUpdateManyArgsSchema: z.ZodType<Prisma.OrderUpdateManyArgs> = z.object({
  data: z.union([ OrderUpdateManyMutationInputSchema, OrderUncheckedUpdateManyInputSchema ]),
  where: OrderWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrderUpdateManyMutationInputSchema, OrderUncheckedUpdateManyInputSchema ]),
  where: OrderWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderDeleteManyArgsSchema: z.ZodType<Prisma.OrderDeleteManyArgs> = z.object({
  where: OrderWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemCreateArgsSchema: z.ZodType<Omit<Prisma.OrderItemCreateArgs, "select" | "include">> = z.object({
  data: z.union([ OrderItemCreateInputSchema, OrderItemUncheckedCreateInputSchema ]),
}).strict();

export const OrderItemUpsertArgsSchema: z.ZodType<Omit<Prisma.OrderItemUpsertArgs, "select" | "include">> = z.object({
  where: OrderItemWhereUniqueInputSchema, 
  create: z.union([ OrderItemCreateInputSchema, OrderItemUncheckedCreateInputSchema ]),
  update: z.union([ OrderItemUpdateInputSchema, OrderItemUncheckedUpdateInputSchema ]),
}).strict();

export const OrderItemCreateManyArgsSchema: z.ZodType<Prisma.OrderItemCreateManyArgs> = z.object({
  data: z.union([ OrderItemCreateManyInputSchema, OrderItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ OrderItemCreateManyInputSchema, OrderItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const OrderItemDeleteArgsSchema: z.ZodType<Omit<Prisma.OrderItemDeleteArgs, "select" | "include">> = z.object({
  where: OrderItemWhereUniqueInputSchema, 
}).strict();

export const OrderItemUpdateArgsSchema: z.ZodType<Omit<Prisma.OrderItemUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ OrderItemUpdateInputSchema, OrderItemUncheckedUpdateInputSchema ]),
  where: OrderItemWhereUniqueInputSchema, 
}).strict();

export const OrderItemUpdateManyArgsSchema: z.ZodType<Prisma.OrderItemUpdateManyArgs> = z.object({
  data: z.union([ OrderItemUpdateManyMutationInputSchema, OrderItemUncheckedUpdateManyInputSchema ]),
  where: OrderItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.OrderItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ OrderItemUpdateManyMutationInputSchema, OrderItemUncheckedUpdateManyInputSchema ]),
  where: OrderItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const OrderItemDeleteManyArgsSchema: z.ZodType<Prisma.OrderItemDeleteManyArgs> = z.object({
  where: OrderItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PaymentCreateArgsSchema: z.ZodType<Omit<Prisma.PaymentCreateArgs, "select" | "include">> = z.object({
  data: z.union([ PaymentCreateInputSchema, PaymentUncheckedCreateInputSchema ]),
}).strict();

export const PaymentUpsertArgsSchema: z.ZodType<Omit<Prisma.PaymentUpsertArgs, "select" | "include">> = z.object({
  where: PaymentWhereUniqueInputSchema, 
  create: z.union([ PaymentCreateInputSchema, PaymentUncheckedCreateInputSchema ]),
  update: z.union([ PaymentUpdateInputSchema, PaymentUncheckedUpdateInputSchema ]),
}).strict();

export const PaymentCreateManyArgsSchema: z.ZodType<Prisma.PaymentCreateManyArgs> = z.object({
  data: z.union([ PaymentCreateManyInputSchema, PaymentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PaymentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PaymentCreateManyAndReturnArgs> = z.object({
  data: z.union([ PaymentCreateManyInputSchema, PaymentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PaymentDeleteArgsSchema: z.ZodType<Omit<Prisma.PaymentDeleteArgs, "select" | "include">> = z.object({
  where: PaymentWhereUniqueInputSchema, 
}).strict();

export const PaymentUpdateArgsSchema: z.ZodType<Omit<Prisma.PaymentUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ PaymentUpdateInputSchema, PaymentUncheckedUpdateInputSchema ]),
  where: PaymentWhereUniqueInputSchema, 
}).strict();

export const PaymentUpdateManyArgsSchema: z.ZodType<Prisma.PaymentUpdateManyArgs> = z.object({
  data: z.union([ PaymentUpdateManyMutationInputSchema, PaymentUncheckedUpdateManyInputSchema ]),
  where: PaymentWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PaymentUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PaymentUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PaymentUpdateManyMutationInputSchema, PaymentUncheckedUpdateManyInputSchema ]),
  where: PaymentWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PaymentDeleteManyArgsSchema: z.ZodType<Prisma.PaymentDeleteManyArgs> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DeliveryCreateArgsSchema: z.ZodType<Omit<Prisma.DeliveryCreateArgs, "select" | "include">> = z.object({
  data: z.union([ DeliveryCreateInputSchema, DeliveryUncheckedCreateInputSchema ]),
}).strict();

export const DeliveryUpsertArgsSchema: z.ZodType<Omit<Prisma.DeliveryUpsertArgs, "select" | "include">> = z.object({
  where: DeliveryWhereUniqueInputSchema, 
  create: z.union([ DeliveryCreateInputSchema, DeliveryUncheckedCreateInputSchema ]),
  update: z.union([ DeliveryUpdateInputSchema, DeliveryUncheckedUpdateInputSchema ]),
}).strict();

export const DeliveryCreateManyArgsSchema: z.ZodType<Prisma.DeliveryCreateManyArgs> = z.object({
  data: z.union([ DeliveryCreateManyInputSchema, DeliveryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DeliveryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.DeliveryCreateManyAndReturnArgs> = z.object({
  data: z.union([ DeliveryCreateManyInputSchema, DeliveryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const DeliveryDeleteArgsSchema: z.ZodType<Omit<Prisma.DeliveryDeleteArgs, "select" | "include">> = z.object({
  where: DeliveryWhereUniqueInputSchema, 
}).strict();

export const DeliveryUpdateArgsSchema: z.ZodType<Omit<Prisma.DeliveryUpdateArgs, "select" | "include">> = z.object({
  data: z.union([ DeliveryUpdateInputSchema, DeliveryUncheckedUpdateInputSchema ]),
  where: DeliveryWhereUniqueInputSchema, 
}).strict();

export const DeliveryUpdateManyArgsSchema: z.ZodType<Prisma.DeliveryUpdateManyArgs> = z.object({
  data: z.union([ DeliveryUpdateManyMutationInputSchema, DeliveryUncheckedUpdateManyInputSchema ]),
  where: DeliveryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DeliveryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.DeliveryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ DeliveryUpdateManyMutationInputSchema, DeliveryUncheckedUpdateManyInputSchema ]),
  where: DeliveryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const DeliveryDeleteManyArgsSchema: z.ZodType<Prisma.DeliveryDeleteManyArgs> = z.object({
  where: DeliveryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();