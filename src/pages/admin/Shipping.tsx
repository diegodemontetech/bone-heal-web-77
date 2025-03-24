
import React, { useState } from 'react';
import { useShippingRates } from '@/hooks/shipping/use-shipping-rates';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Truck, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  FileText, 
  MapPin,
  BarChart4
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const brasilestates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

const regions = [
  { value: 'Norte', label: 'Norte' },
  { value: 'Nordeste', label: 'Nordeste' },
  { value: 'Centro-Oeste', label: 'Centro-Oeste' },
  { value: 'Sudeste', label: 'Sudeste' },
  { value: 'Sul', label: 'Sul' }
];

const ShippingPage = () => {
  const {
    rates,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditing,
    formData,
    handleInputChange,
    handleSelectChange,
    resetForm,
    openEditDialog,
    handleCreateRate,
    handleDeleteRate
  } = useShippingRates();

  const [activeTab, setActiveTab] = useState('rates');

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-6">
        <Truck className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações de Frete</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="rates" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>Taxas de Envio</span>
          </TabsTrigger>
          <TabsTrigger value="regions" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>Regiões</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-1">
            <BarChart4 className="h-4 w-4" />
            <span>Estatísticas</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rates">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Taxas de Envio</CardTitle>
                <CardDescription>Configure os valores de frete por região</CardDescription>
              </div>
              <Button onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Taxa
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableCaption>Lista de taxas de envio configuradas</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Região</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Faixa CEP</TableHead>
                      <TableHead>Valor Fixo</TableHead>
                      <TableHead>Tarifa por Kg</TableHead>
                      <TableHead>Prazo (dias)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          Nenhuma taxa de envio cadastrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      rates.map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell className="font-medium">{rate.region}</TableCell>
                          <TableCell>{rate.state}</TableCell>
                          <TableCell>
                            {rate.zip_code_start} - {rate.zip_code_end}
                          </TableCell>
                          <TableCell>{formatCurrency(rate.flat_rate || 0)}</TableCell>
                          <TableCell>{formatCurrency(rate.additional_kg_rate || 0)}</TableCell>
                          <TableCell>{rate.estimated_days}</TableCell>
                          <TableCell>
                            <Badge variant={rate.is_active ? "success" : "destructive"}>
                              {rate.is_active ? "Ativo" : "Inativo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(rate)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteRate(rate.id || '')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>Regiões de Entrega</CardTitle>
              <CardDescription>Visualize a cobertura de entrega por região</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {regions.map((region) => (
                  <div key={region.value} className="space-y-4">
                    <h3 className="text-lg font-medium">{region.label}</h3>
                    <Separator />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {brasilestates
                        .filter(state => {
                          // Lógica para filtrar estados por região
                          switch (region.value) {
                            case 'Norte':
                              return ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'].includes(state.value);
                            case 'Nordeste':
                              return ['AL', 'BA', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'].includes(state.value);
                            case 'Centro-Oeste':
                              return ['DF', 'GO', 'MT', 'MS'].includes(state.value);
                            case 'Sudeste':
                              return ['ES', 'MG', 'RJ', 'SP'].includes(state.value);
                            case 'Sul':
                              return ['PR', 'RS', 'SC'].includes(state.value);
                            default:
                              return false;
                          }
                        })
                        .map(state => {
                          // Verificar se existe taxa para este estado
                          const hasRate = rates.some(r => r.state === state.value);
                          
                          return (
                            <div 
                              key={state.value}
                              className={`p-3 rounded-md border ${hasRate ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{state.label}</span>
                                {hasRate && (
                                  <Badge variant="success" className="text-xs">
                                    Configurado
                                  </Badge>
                                )}
                              </div>
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas de Frete</CardTitle>
              <CardDescription>Análise de custos e entregas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Fretes por Região</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5 regiões</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {rates.length} configurações de frete
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(
                        rates.reduce((acc, curr) => acc + (curr.flat_rate || 0), 0) / 
                        (rates.length || 1)
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Média das taxas fixas
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Prazo Médio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(
                        rates.reduce((acc, curr) => acc + (curr.estimated_days || 0), 0) / 
                        (rates.length || 1)
                      )} dias
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tempo médio de entrega
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para criar/editar taxa de envio */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar' : 'Nova'} Taxa de Envio</DialogTitle>
            <DialogDescription>
              Configure os valores e parâmetros para esta taxa de envio.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Região</Label>
                  <Select 
                    value={formData.region || ''} 
                    onValueChange={(value) => handleSelectChange('region', value)}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.value} value={region.value}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Select 
                    value={formData.state || ''} 
                    onValueChange={(value) => handleSelectChange('state', value)}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {brasilestates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip_code_start">CEP Inicial</Label>
                  <Input
                    id="zip_code_start"
                    placeholder="00000-000"
                    name="zip_code_start"
                    value={formData.zip_code_start || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip_code_end">CEP Final</Label>
                  <Input
                    id="zip_code_end"
                    placeholder="99999-999"
                    name="zip_code_end"
                    value={formData.zip_code_end || ''}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flat_rate">Valor Fixo (R$)</Label>
                  <Input
                    id="flat_rate"
                    type="number"
                    step="0.01"
                    name="flat_rate"
                    value={formData.flat_rate || 0}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additional_kg_rate">Tarifa por Kg adicional (R$)</Label>
                  <Input
                    id="additional_kg_rate"
                    type="number"
                    step="0.01"
                    name="additional_kg_rate"
                    value={formData.additional_kg_rate || 0}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_days">Prazo de Entrega (dias)</Label>
                  <Input
                    id="estimated_days"
                    type="number"
                    name="estimated_days"
                    value={formData.estimated_days || 3}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-9">
                  <Switch
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active !== false}
                    onCheckedChange={(checked) => 
                      handleSelectChange('is_active', checked)
                    }
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Salvar Alterações' : 'Criar Taxa de Envio'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ShippingPage;
