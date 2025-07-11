import { prisma } from "@/lib/prisma";

async function main() {
  const checkColumnExists = await prisma.$queryRawUnsafe<{ column_name: string }[]>(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'search_vector';
  `);

  if (checkColumnExists.length > 0) {
    console.log("⚠️  Column 'search_vector' already exists. Skipping creation.");
  } else {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE products
      ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
      ) STORED;
    `);
    console.log("✅ Added 'search_vector' column");
  }

  const checkIndexExists = await prisma.$queryRawUnsafe<{ indexname: string }[]>(`
    SELECT indexname
    FROM pg_indexes
    WHERE tablename = 'products' AND indexname = 'search_vector_idx';
  `);

  if (checkIndexExists.length > 0) {
    console.log("⚠️  Index 'search_vector_idx' already exists. Skipping creation.");
  } else {
    await prisma.$executeRawUnsafe(`
      CREATE INDEX search_vector_idx ON products USING GIN(search_vector);
    `);
    console.log("✅ Created GIN index on 'search_vector'");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error running script:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
