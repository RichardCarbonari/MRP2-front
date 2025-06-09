import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Interface para Item de Inventário
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  value: number;
  unit: string;
  category: string;
  location: string;
  lastUpdated: Date;
}

// Interface para Ferramenta
interface Tool {
  id: string;
  name: string;
  type: string;
  quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'needs_maintenance';
  location: string;
  lastMaintenance: Date;
}

// GET /api/inventory/items - Buscar todos os itens
router.get('/items', async (req, res) => {
  try {
    // Como ainda não temos tabela específica de inventory no Prisma,
    // vamos retornar dados mockados que correspondem ao frontend
    const items: InventoryItem[] = [
      {
        id: 'CPU001',
        name: 'Intel Core i5-13400F - 10 núcleos, 16 threads, LGA1700, 65W',
        quantity: 85,
        value: 950.00,
        unit: 'unidade',
        category: 'Processador',
        location: 'Estante A1 - Prateleira 1',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'COOL001',
        name: 'Cooler Master Hyper 212 Black Edition - Air Cooler com 4 heatpipes',
        quantity: 45,
        value: 120.00,
        unit: 'unidade',
        category: 'Cooler',
        location: 'Estante A2 - Prateleira 1',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'MB001',
        name: 'ASUS TUF B660M-PLUS WiFi D4 - mATX, LGA1700, DDR4',
        quantity: 32,
        value: 650.00,
        unit: 'unidade',
        category: 'Placa-mãe',
        location: 'Estante A3 - Prateleira 1',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'RAM001',
        name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz - Dual Channel',
        quantity: 120,
        value: 280.00,
        unit: 'kit',
        category: 'Memória RAM',
        location: 'Estante A4 - Prateleira 1-2',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'SSD001',
        name: 'Kingston NV2 1TB NVMe PCIe 4.0 - Leitura até 3.500MB/s',
        quantity: 95,
        value: 320.00,
        unit: 'unidade',
        category: 'SSD',
        location: 'Estante A5 - Prateleira 1',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'GPU001',
        name: 'NVIDIA GeForce RTX 3060 12GB - GDDR6, PCIe 4.0, 170W',
        quantity: 28,
        value: 1850.00,
        unit: 'unidade',
        category: 'Placa de Vídeo',
        location: 'Estante B1 - Prateleira 1 (Climatizada)',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'PSU001',
        name: 'Corsair CV550 550W 80 Plus Bronze - ATX, PFC Ativo',
        quantity: 67,
        value: 380.00,
        unit: 'unidade',
        category: 'Fonte',
        location: 'Estante B2 - Prateleira 1-2',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'CASE001',
        name: 'Cooler Master Q300L - mATX, ventilação frontal/lateral',
        quantity: 22,
        value: 180.00,
        unit: 'unidade',
        category: 'Gabinete',
        location: 'Depósito C - Área de Grandes Volumes',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'NET001',
        name: 'TP-Link Archer T6E - PCIe, Dual Band, 802.11ac',
        quantity: 35,
        value: 140.00,
        unit: 'unidade',
        category: 'Placa de Rede',
        location: 'Estante A6 - Prateleira 1',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'OPT001',
        name: 'LG DVD Writer GH24NSD1 - Leitor/Gravador DVD',
        quantity: 18,
        value: 85.00,
        unit: 'unidade',
        category: 'Drive Óptico',
        location: 'Estante A7 - Prateleira 1',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'OS001',
        name: 'Windows 11 Pro OEM - 64 bits, ativação OEM',
        quantity: 200,
        value: 450.00,
        unit: 'licença',
        category: 'Software',
        location: 'Estoque Digital - Servidor de Licenças',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'KB001',
        name: 'Teclado Mecânico Gamer RGB - Switches Blue',
        quantity: 75,
        value: 250.00,
        unit: 'unidade',
        category: 'Periféricos',
        location: 'Estante D1 - Prateleira 1',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'MS001',
        name: 'Mouse Gamer 6400 DPI RGB - Sensor Óptico',
        quantity: 88,
        value: 150.00,
        unit: 'unidade',
        category: 'Periféricos',
        location: 'Estante D1 - Prateleira 2',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'MON001',
        name: 'Monitor LED 24" Full HD IPS - 75Hz, HDMI/VGA',
        quantity: 42,
        value: 680.00,
        unit: 'unidade',
        category: 'Periféricos',
        location: 'Depósito D - Área de Monitores',
        lastUpdated: new Date('2024-12-20')
      },
      {
        id: 'WEB001',
        name: 'Webcam Full HD 1080p - Microfone integrado, USB',
        quantity: 56,
        value: 120.00,
        unit: 'unidade',
        category: 'Periféricos',
        location: 'Estante D2 - Prateleira 1',
        lastUpdated: new Date('2024-12-20')
      }
    ];

    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/inventory/items - Criar novo item
router.post('/items', async (req, res) => {
  try {
    const { name, quantity, value, unit, category, location } = req.body;

    // Validação básica
    if (!name || !quantity || !value || !unit || !category || !location) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Gerar ID único
    const id = `ITEM_${Date.now()}`;

    const newItem: InventoryItem = {
      id,
      name,
      quantity: Number(quantity),
      value: Number(value),
      unit,
      category,
      location,
      lastUpdated: new Date()
    };

    // Em uma implementação real, salvaria no banco de dados
    // await prisma.inventoryItem.create({ data: newItem });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/inventory/items/:id - Atualizar item
router.put('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, quantity, value, unit, category, location } = req.body;

    // Validação básica
    if (!name || !quantity || !value || !unit || !category || !location) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const updatedItem: InventoryItem = {
      id,
      name,
      quantity: Number(quantity),
      value: Number(value),
      unit,
      category,
      location,
      lastUpdated: new Date()
    };

    // Em uma implementação real, atualizaria no banco de dados
    // const item = await prisma.inventoryItem.update({
    //   where: { id },
    //   data: updatedItem
    // });

    res.json(updatedItem);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/inventory/items/:id - Deletar item
router.delete('/items/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Em uma implementação real, deletaria do banco de dados
    // await prisma.inventoryItem.delete({ where: { id } });

    res.json({ message: 'Item deletado com sucesso', id });
  } catch (error) {
    console.error('Erro ao deletar item:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/inventory/tools - Buscar todas as ferramentas
router.get('/tools', async (req, res) => {
  try {
    const tools: Tool[] = [
      {
        id: 'TOOL001',
        name: 'Chave Philips Magnética Precision - Conjunto 6 peças',
        type: 'Chave de Fenda',
        quantity: 12,
        condition: 'excellent',
        location: 'Bancada Principal - Gaveta 1',
        lastMaintenance: new Date('2024-12-01')
      },
      {
        id: 'TOOL002',
        name: 'Chave Fenda Magnética - Conjunto 4 peças',
        type: 'Chave de Fenda',
        quantity: 8,
        condition: 'good',
        location: 'Bancada Principal - Gaveta 1',
        lastMaintenance: new Date('2024-12-01')
      },
      {
        id: 'TOOL003',
        name: 'Pulseira Antiestática ESD - Cabo 3 metros',
        type: 'Proteção ESD',
        quantity: 15,
        condition: 'excellent',
        location: 'Bancada Principal - Suporte Parede',
        lastMaintenance: new Date('2024-11-15')
      },
      {
        id: 'TOOL004',
        name: 'Kit Pasta Térmica Arctic Silver 5 - 3.5g',
        type: 'Pasta Térmica',
        quantity: 25,
        condition: 'excellent',
        location: 'Refrigerador de Componentes - Prateleira 1',
        lastMaintenance: new Date('2024-12-15')
      },
      {
        id: 'TOOL005',
        name: 'Multímetro Digital Fluke 115 - True RMS',
        type: 'Equipamento de Teste',
        quantity: 3,
        condition: 'excellent',
        location: 'Bancada de Testes - Gaveta Especial',
        lastMaintenance: new Date('2024-12-10')
      },
      {
        id: 'TOOL006',
        name: 'Fonte de Bancada Ajustável 0-30V 0-5A',
        type: 'Equipamento de Teste',
        quantity: 2,
        condition: 'good',
        location: 'Bancada de Testes - Mesa Principal',
        lastMaintenance: new Date('2024-11-20')
      },
      {
        id: 'TOOL007',
        name: 'Sugador de Solda Elétrico 30W',
        type: 'Solda',
        quantity: 4,
        condition: 'good',
        location: 'Bancada de Solda - Suporte',
        lastMaintenance: new Date('2024-12-05')
      },
      {
        id: 'TOOL008',
        name: 'Ferro de Solda Regulável 40-100W',
        type: 'Solda',
        quantity: 6,
        condition: 'excellent',
        location: 'Bancada de Solda - Suporte',
        lastMaintenance: new Date('2024-12-05')
      },
      {
        id: 'TOOL009',
        name: 'Alicate Descascador de Fios - 10-24 AWG',
        type: 'Alicate',
        quantity: 10,
        condition: 'excellent',
        location: 'Bancada Principal - Gaveta 2',
        lastMaintenance: new Date('2024-11-25')
      },
      {
        id: 'TOOL010',
        name: 'Soprador de Ar Comprimido - 600W',
        type: 'Limpeza',
        quantity: 3,
        condition: 'good',
        location: 'Área de Limpeza - Armário',
        lastMaintenance: new Date('2024-12-12')
      },
      {
        id: 'TOOL011',
        name: 'Kit Organizador de Parafusos - 120 compartimentos',
        type: 'Organização',
        quantity: 8,
        condition: 'excellent',
        location: 'Bancada Principal - Prateleira Superior',
        lastMaintenance: new Date('2024-12-01')
      },
      {
        id: 'TOOL012',
        name: 'Lanterna LED de Cabeça - Recarregável USB',
        type: 'Iluminação',
        quantity: 12,
        condition: 'excellent',
        location: 'Bancada Principal - Suporte Parede',
        lastMaintenance: new Date('2024-12-08')
      }
    ];

    res.json(tools);
  } catch (error) {
    console.error('Erro ao buscar ferramentas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// POST /api/inventory/tools - Criar nova ferramenta
router.post('/tools', async (req, res) => {
  try {
    const { name, type, quantity, condition, location } = req.body;

    // Validação básica
    if (!name || !type || !quantity || !condition || !location) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Gerar ID único
    const id = `TOOL_${Date.now()}`;

    const newTool: Tool = {
      id,
      name,
      type,
      quantity: Number(quantity),
      condition,
      location,
      lastMaintenance: new Date()
    };

    res.status(201).json(newTool);
  } catch (error) {
    console.error('Erro ao criar ferramenta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// PUT /api/inventory/tools/:id - Atualizar ferramenta
router.put('/tools/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, quantity, condition, location } = req.body;

    // Validação básica
    if (!name || !type || !quantity || !condition || !location) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const updatedTool: Tool = {
      id,
      name,
      type,
      quantity: Number(quantity),
      condition,
      location,
      lastMaintenance: new Date()
    };

    res.json(updatedTool);
  } catch (error) {
    console.error('Erro ao atualizar ferramenta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// DELETE /api/inventory/tools/:id - Deletar ferramenta
router.delete('/tools/:id', async (req, res) => {
  try {
    const { id } = req.params;

    res.json({ message: 'Ferramenta deletada com sucesso', id });
  } catch (error) {
    console.error('Erro ao deletar ferramenta:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router; 