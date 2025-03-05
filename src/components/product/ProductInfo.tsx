import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from '@/hooks/use-cart';
import { toast } from 'sonner';

interface ProductInfoProps {
  product: any;
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const [open, setOpen] = useState(false);
  const { addItem } = useCart();

  const addToCart = () => {
    const newItem = {
      id: product.id,
      name: product.name,
      price: product.price || 0,
      image: product.main_image || product.default_image_url || '/placeholder.svg',
      quantity: 1
    };

    addItem(newItem);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  return (
    <div className="grid gap-4">
      <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight">{product.name}</h1>
      <p className="text-sm text-muted-foreground">{product.short_description}</p>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="h-5 w-5 text-yellow-500" />
          <Star className="h-5 w-5 text-yellow-500" />
        </div>
        <span className="text-sm text-muted-foreground">5.0 (10 avaliações)</span>
      </div>
      <h2 className="text-3xl font-bold">R$ {product.price?.toFixed(2)}</h2>
      <div className="grid gap-2">
        <Button size="lg" className="w-full" onClick={addToCart}>
          Adicionar ao carrinho
        </Button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="w-full justify-start">
              Detalhes técnicos
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Detalhes técnicos</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {product.technical_details && Object.entries(product.technical_details).map(([key, value]) => (
                <div key={key} className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor={key} className="text-right">
                    {key}
                  </Label>
                  <Input type="text" id={key} value={value as string} className="col-span-3" disabled />
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default ProductInfo;
