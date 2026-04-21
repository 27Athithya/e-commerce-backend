import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { CreateProductDto } from "./dto/create-product.dto";
import { ListProductsQueryDto } from "./dto/list-products-query.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {
  DEFAULT_PRODUCT_CATEGORY,
  DEFAULT_PRODUCT_IMAGE,
  DEFAULT_PRODUCT_STATUS,
  Product,
  ProductDocument,
  type ProductStatus,
} from "../../database/schemas/product.schema";

type ProductResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stockQuantity: number;
  status: ProductStatus;
  createdAt: number;
};

const seedProducts: CreateProductDto[] = [
  {
    name: "Minimal Leather Wallet",
    description: "Hand-stitched full-grain leather. Slim profile, six card slots.",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80&auto=format&fit=crop",
    category: "Accessories",
    stockQuantity: 24,
    status: "active",
  },
  {
    name: "Ceramic Pour-Over Set",
    description: "Matte ceramic dripper and carafe for the perfect morning brew.",
    price: 64,
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80&auto=format&fit=crop",
    category: "Home",
    stockQuantity: 18,
    status: "active",
  },
  {
    name: "Wireless Studio Headphones",
    description: "Premium sound, 40h battery life, plush memory-foam cushions.",
    price: 249,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80&auto=format&fit=crop",
    category: "Electronics",
    stockQuantity: 9,
    status: "active",
  },
  {
    name: "Linen Throw Blanket",
    description: "Stonewashed pure linen, perfect weight for every season.",
    price: 119,
    image:
      "https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?w=800&q=80&auto=format&fit=crop",
    category: "Home",
    stockQuantity: 12,
    status: "active",
  },
  {
    name: "Matte Steel Water Bottle",
    description: "Double-wall insulation keeps drinks cold for 24 hours.",
    price: 42,
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&q=80&auto=format&fit=crop",
    category: "Accessories",
    stockQuantity: 31,
    status: "active",
  },
  {
    name: "Oak Desk Organizer",
    description: "Solid oak tray set for pens, cards, and daily tools.",
    price: 58,
    image:
      "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?w=800&q=80&auto=format&fit=crop",
    category: "Office",
    stockQuantity: 15,
    status: "draft",
  },
  {
    name: "Wool Beanie",
    description: "Soft merino wool knit with a clean fold-over cuff.",
    price: 36,
    image:
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&q=80&auto=format&fit=crop",
    category: "Apparel",
    stockQuantity: 4,
    status: "active",
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Compact speaker with rich bass and 12-hour battery.",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&q=80&auto=format&fit=crop",
    category: "Electronics",
    stockQuantity: 0,
    status: "archived",
  },
  {
    name: "Canvas Weekender Bag",
    description: "Heavyweight canvas with leather handles and brass hardware.",
    price: 145,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80&auto=format&fit=crop",
    category: "Travel",
    stockQuantity: 7,
    status: "active",
  },
  {
    name: "Scented Soy Candle",
    description: "Notes of cedar, fig, and citrus in a reusable glass jar.",
    price: 28,
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80&auto=format&fit=crop",
    category: "Home",
    stockQuantity: 22,
    status: "active",
  },
  {
    name: "Mechanical Keyboard",
    description: "Tactile switches, aluminum frame, and hot-swap sockets.",
    price: 179,
    image:
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&q=80&auto=format&fit=crop",
    category: "Electronics",
    stockQuantity: 11,
    status: "active",
  },
  {
    name: "AeroPress Coffee Maker",
    description: "Quick, smooth coffee brewing at home or on the go.",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80&auto=format&fit=crop",
    category: "Kitchen",
    stockQuantity: 19,
    status: "active",
  },
  {
    name: "Ceramic Dinner Plate Set",
    description: "Set of 4 handcrafted stoneware plates with matte glaze.",
    price: 88,
    image:
      "https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=800&q=80&auto=format&fit=crop",
    category: "Home",
    stockQuantity: 6,
    status: "draft",
  },
  {
    name: "Denim Apron",
    description: "Durable apron with adjustable straps and front pockets.",
    price: 54,
    image:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?w=800&q=80&auto=format&fit=crop",
    category: "Kitchen",
    stockQuantity: 14,
    status: "active",
  },
  {
    name: "Fountain Pen",
    description: "Brass-bodied pen with smooth medium nib and refillable ink.",
    price: 67,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop",
    category: "Office",
    stockQuantity: 8,
    status: "active",
  },
  {
    name: "Yoga Mat Pro",
    description: "Non-slip natural rubber mat with extra joint cushioning.",
    price: 72,
    image:
      "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=800&q=80&auto=format&fit=crop",
    category: "Fitness",
    stockQuantity: 16,
    status: "active",
  },
  {
    name: "Running Sneakers",
    description: "Lightweight trainers with breathable mesh upper.",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80&auto=format&fit=crop",
    category: "Footwear",
    stockQuantity: 13,
    status: "active",
  },
  {
    name: "Leather Journal",
    description: "Refillable notebook cover in vegetable-tanned leather.",
    price: 44,
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80&auto=format&fit=crop",
    category: "Office",
    stockQuantity: 5,
    status: "draft",
  },
  {
    name: "Smart Desk Lamp",
    description: "Dimmable LED lamp with USB-C charging base.",
    price: 93,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80&auto=format&fit=crop",
    category: "Office",
    stockQuantity: 3,
    status: "active",
  },
  {
    name: "Cotton Bath Towels",
    description: "Set of 2 premium long-staple cotton bath towels.",
    price: 52,
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80&auto=format&fit=crop",
    category: "Home",
    stockQuantity: 21,
    status: "active",
  },
];

@Injectable()
export class ProductsService implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) {}

  async onModuleInit() {
    const count = await this.productModel.countDocuments();
    if (count === 0) {
      await this.productModel.insertMany(seedProducts);
      this.logger.log(`Seeded ${seedProducts.length} products into MongoDB`);
    }
  }

  async findAll(query: ListProductsQueryDto): Promise<ProductResponse[]> {
    const mongoQuery: Record<string, unknown> = {};

    if (query.category) {
      mongoQuery.category = new RegExp(`^${this.escapeRegex(query.category)}$`, "i");
    }

    if (query.status) {
      mongoQuery.status = query.status;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      mongoQuery.price = {} as Record<string, number>;
      if (query.minPrice !== undefined) {
        (mongoQuery.price as Record<string, number>).$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        (mongoQuery.price as Record<string, number>).$lte = query.maxPrice;
      }
    }

    if (query.minStock !== undefined) {
      mongoQuery.stockQuantity = { $gte: query.minStock };
    }

    let products = await this.productModel.find(mongoQuery).sort({ createdAt: -1 }).exec();

    if (query.search) {
      const search = query.search.toLowerCase();
      products = products.filter((product) => {
        const searchableText = [product.name, product.description, product.category]
          .join(" ")
          .toLowerCase();
        return searchableText.includes(search);
      });
    }

    return products.map((product) => this.serialize(product));
  }

  async findOne(id: string): Promise<ProductResponse> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid product id");
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return this.serialize(product);
  }

  async create(createProductDto: CreateProductDto): Promise<ProductResponse> {
    const created = await this.productModel.create({
      ...createProductDto,
      image: createProductDto.image ?? DEFAULT_PRODUCT_IMAGE,
      category: createProductDto.category ?? DEFAULT_PRODUCT_CATEGORY,
      stockQuantity: createProductDto.stockQuantity ?? 0,
      status: createProductDto.status ?? DEFAULT_PRODUCT_STATUS,
    });

    return this.serialize(created);
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductResponse> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid product id");
    }

    const updated = await this.productModel
      .findByIdAndUpdate(
        id,
        {
          ...updateProductDto,
        },
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException("Product not found");
    }

    return this.serialize(updated);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid product id");
    }

    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException("Product not found");
    }

    return { deleted: true };
  }

  private serialize(product: ProductDocument): ProductResponse {
    return {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category: product.category,
      stockQuantity: product.stockQuantity ?? 0,
      status: product.status ?? DEFAULT_PRODUCT_STATUS,
      createdAt: product.createdAt instanceof Date ? product.createdAt.getTime() : Date.now(),
    };
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
