import CategoryTabs from "@/app/(root)/categories/_components/CategoryTabs";
import ListCatgorires from "@/app/(root)/categories/_components/ListCatgorires";
import Sizes from "@/app/(root)/categories/_components/Sizes";
import Colors from "@/app/(root)/categories/_components/Colors";
import Types from "@/app/(root)/categories/_components/Types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sizeCategories } from "@/constants";
import { getData } from "@/lib/utils";
import { Package, Palette, Ruler, Tags, FolderTree } from "lucide-react";

export const dynamic = "force-dynamic";

const Page = async () => {
  const colors = await getData("/api/colors");
  const sizes = await getData("/api/sizes");
  const categories = await getData("/api/categories");

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Category Management</h1>
        <p className="text-muted-foreground">
          Manage your product categories, types, sizes, and colors from one central location.
        </p>
      </div>

      <Tabs defaultValue="types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="types" className="flex items-center gap-2">
            <Tags className="h-4 w-4" />
            Types
          </TabsTrigger>{" "}
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderTree className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="sizes" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Sizes
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Add New Category
                </CardTitle>
                <CardDescription>Create new parent categories or sub-categories for your products.</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryTabs parentCategories={categories || []} isLoading={false} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  Manage Categories
                </CardTitle>
                <CardDescription>View, edit, and organize your existing categories.</CardDescription>
              </CardHeader>
              <CardContent>
                <ListCatgorires isLoading={false} allCategories={categories || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" />
                Product Types & Attributes
              </CardTitle>
              <CardDescription>
                Manage product types and their associated attributes for better product organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Types />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sizes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Size Management
              </CardTitle>
              <CardDescription>Configure size options for different product categories.</CardDescription>
            </CardHeader>
            <CardContent>
              <Sizes sizes={sizes} sizeCategories={sizeCategories} isLoading={false} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Color Palette
              </CardTitle>
              <CardDescription>Add and manage color options for your products.</CardDescription>
            </CardHeader>
            <CardContent>
              <Colors colors={colors} isLoading={false} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
