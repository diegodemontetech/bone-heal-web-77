
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, PackageOpen, Settings, MapPin } from "lucide-react";
import { useState } from "react";

const AdminShipping = () => {
  const [isFreightEnabled, setIsFreightEnabled] = useState("true");
  const [defaultShippingMethod, setDefaultShippingMethod] = useState("correios");

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" />
            Configurações de Frete
          </h1>
          <p className="text-muted-foreground">
            Configure as opções de envio e frete para seus produtos
          </p>
        </div>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Geral</span>
          </TabsTrigger>
          <TabsTrigger value="correios" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <span>Correios</span>
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>Regiões</span>
          </TabsTrigger>
          <TabsTrigger value="packaging" className="flex items-center gap-2">
            <PackageOpen className="h-4 w-4" />
            <span>Embalagens</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="freight-enabled">Cálculo de Frete</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar cálculo de frete para produtos
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="freight-enabled">Desativado</Label>
                  <Select
                    value={isFreightEnabled}
                    onValueChange={setIsFreightEnabled}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status do frete" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Ativado</SelectItem>
                      <SelectItem value="false">Desativado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default-shipping">Método de Frete Padrão</Label>
                  <p className="text-sm text-muted-foreground">
                    Método usado quando o cálculo não é possível
                  </p>
                </div>
                <Select
                  value={defaultShippingMethod}
                  onValueChange={setDefaultShippingMethod}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Método de frete" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="correios">Correios</SelectItem>
                    <SelectItem value="transportadora">Transportadora</SelectItem>
                    <SelectItem value="retirada">Retirada na loja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="default-zip">CEP de Origem</Label>
                  <p className="text-sm text-muted-foreground">
                    CEP de onde os produtos são enviados
                  </p>
                </div>
                <Input
                  id="default-zip"
                  placeholder="00000-000"
                  className="w-[180px]"
                />
              </div>

              <div className="pt-4">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="correios" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Correios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="correios-enabled">Serviço dos Correios</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar integração com os Correios
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="correios-enabled">Desativado</Label>
                  <Switch id="correios-enabled" />
                  <Label htmlFor="correios-enabled">Ativado</Label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correios-user">Usuário Correios</Label>
                  <Input id="correios-user" placeholder="Usuário" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correios-password">Senha Correios</Label>
                  <Input
                    id="correios-password"
                    type="password"
                    placeholder="Senha"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correios-contract">Código de Contrato</Label>
                  <Input id="correios-contract" placeholder="Código de Contrato" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correios-card">Cartão de Postagem</Label>
                  <Input id="correios-card" placeholder="Cartão de Postagem" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Serviços Habilitados</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sedex" className="rounded" />
                    <Label htmlFor="sedex">SEDEX</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="pac" className="rounded" />
                    <Label htmlFor="pac">PAC</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sedex10" className="rounded" />
                    <Label htmlFor="sedex10">SEDEX 10</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sedex12" className="rounded" />
                    <Label htmlFor="sedex12">SEDEX 12</Label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button>Salvar Configurações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Regras por Região</span>
                <Button size="sm">Adicionar Região</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="py-4 px-4 grid grid-cols-5 border-b font-medium">
                  <div>Região</div>
                  <div>Estados</div>
                  <div>Prazo (dias)</div>
                  <div>Valor Mínimo</div>
                  <div>Ações</div>
                </div>
                <div className="py-3 px-4 grid grid-cols-5 items-center">
                  <div>Sudeste</div>
                  <div>SP, RJ, MG, ES</div>
                  <div>2-3</div>
                  <div>R$ 15,00</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="py-3 px-4 grid grid-cols-5 items-center bg-muted/50">
                  <div>Sul</div>
                  <div>PR, SC, RS</div>
                  <div>3-5</div>
                  <div>R$ 18,00</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="py-3 px-4 grid grid-cols-5 items-center">
                  <div>Nordeste</div>
                  <div>CE, BA, PE, RN...</div>
                  <div>5-8</div>
                  <div>R$ 25,00</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packaging" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Embalagens</span>
                <Button size="sm">Adicionar Embalagem</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="py-4 px-4 grid grid-cols-5 border-b font-medium">
                  <div>Nome</div>
                  <div>Dimensões (cm)</div>
                  <div>Peso Máx. (kg)</div>
                  <div>Custo</div>
                  <div>Ações</div>
                </div>
                <div className="py-3 px-4 grid grid-cols-5 items-center">
                  <div>Envelope Pequeno</div>
                  <div>25 x 15 x 5</div>
                  <div>0.5</div>
                  <div>R$ 2,50</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="py-3 px-4 grid grid-cols-5 items-center bg-muted/50">
                  <div>Caixa Padrão</div>
                  <div>30 x 20 x 15</div>
                  <div>1.0</div>
                  <div>R$ 3,80</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Excluir
                    </Button>
                  </div>
                </div>
                <div className="py-3 px-4 grid grid-cols-5 items-center">
                  <div>Caixa Grande</div>
                  <div>50 x 40 x 30</div>
                  <div>5.0</div>
                  <div>R$ 6,90</div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    <Button variant="outline" size="sm">
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminShipping;
