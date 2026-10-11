import { Product, Transaction, Customer, ShopSettings, HelpArticle } from './types';

export const initialProducts: Product[] = [
  {
    id: 'p1',
    name: 'Kabuye Sugar (1kg)',
    category: 'Food',
    buyingPrice: 1400,
    sellingPrice: 1600,
    stock: 24,
    reorderLevel: 10,
    unit: 'packet',
    barcode: '616110012345'
  },
  {
    id: 'p2',
    name: 'Mt. Meru Cooking Oil (1L)',
    category: 'Food',
    buyingPrice: 2800,
    sellingPrice: 3200,
    stock: 8,
    reorderLevel: 5,
    unit: 'bottle',
    barcode: '616110023456'
  },
  {
    id: 'p3',
    name: 'Sina Gerard Urwibutso Bread',
    category: 'Food',
    buyingPrice: 1000,
    sellingPrice: 1200,
    stock: 4,
    reorderLevel: 10,
    unit: 'pcs',
    barcode: '616110034567'
  },
  {
    id: 'p4',
    name: 'Azania Wheat Flour (2kg)',
    category: 'Food',
    buyingPrice: 2400,
    sellingPrice: 2800,
    stock: 15,
    reorderLevel: 6,
    unit: 'packet',
    barcode: '616110045678'
  },
  {
    id: 'p5',
    name: 'Azahar Washing Soap (Bar)',
    category: 'Household',
    buyingPrice: 650,
    sellingPrice: 800,
    stock: 35,
    reorderLevel: 15,
    unit: 'pcs',
    barcode: '616110056789'
  },
  {
    id: 'p6',
    name: 'Inyange Mineral Water (0.5L)',
    category: 'Beverages',
    buyingPrice: 350,
    sellingPrice: 500,
    stock: 48,
    reorderLevel: 20,
    unit: 'bottle',
    barcode: '616110067890'
  },
  {
    id: 'p7',
    name: 'MTN / Airtel Scratch Card (500 RWF)',
    category: 'Airtime & Services',
    buyingPrice: 480,
    sellingPrice: 500,
    stock: 12,
    reorderLevel: 10,
    unit: 'pcs',
    barcode: '616110078901'
  },
  {
    id: 'p8',
    name: 'Rwandan Dry Beans (1kg)',
    category: 'Food',
    buyingPrice: 1300,
    sellingPrice: 1500,
    stock: 5,
    reorderLevel: 12,
    unit: 'kg',
    barcode: '616110089012'
  },
  {
    id: 'p9',
    name: 'Amstel Beer (50cl)',
    category: 'Beverages',
    buyingPrice: 1400,
    sellingPrice: 1700,
    stock: 2,
    reorderLevel: 12,
    unit: 'bottle',
    barcode: '616110090123'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'c1',
    name: 'Jean Claude Ndayisenga',
    phone: '+250 788 123 456',
    notes: 'Teacher at GS Musanze, pays end of month',
    balance: 14500,
    creditLimit: 30000,
    lastActiveDate: '2026-10-05'
  },
  {
    id: 'c2',
    name: 'Marie Claire Uwase',
    phone: '+250 722 987 654',
    notes: 'Market vendor, reliable weekly payments',
    balance: 6200,
    creditLimit: 20000,
    lastActiveDate: '2026-09-10' // Overdue (> 30 days)
  },
  {
    id: 'c3',
    name: 'Emmanuel Habimana',
    phone: '+250 790 456 789',
    notes: 'Moto taxi rider near taxi park',
    balance: 0,
    creditLimit: 10000,
    lastActiveDate: '2026-10-10'
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 't1',
    date: '2026-10-11T09:30:00Z',
    type: 'sale_cash',
    amount: 3200,
    description: 'Cash Sale: Cooking Oil (1L)',
    category: 'Food',
    paymentMethod: 'Cash',
    items: [{ productId: 'p2', name: 'Mt. Meru Cooking Oil (1L)', quantity: 1, price: 3200 }]
  },
  {
    id: 't2',
    date: '2026-10-11T10:15:00Z',
    type: 'sale_momo',
    amount: 1600,
    description: 'MoMo Sale: Sugar (1kg)',
    category: 'Food',
    paymentMethod: 'MoMo',
    items: [{ productId: 'p1', name: 'Kabuye Sugar (1kg)', quantity: 1, price: 1600 }]
  },
  {
    id: 't3',
    date: '2026-10-10T14:20:00Z',
    type: 'sale_credit',
    amount: 4500,
    description: 'Credit Sale to Jean Claude Ndayisenga',
    customerId: 'c1',
    customerName: 'Jean Claude Ndayisenga',
    paymentMethod: 'Credit',
    items: [{ productId: 'p8', name: 'Rwandan Dry Beans (1kg)', quantity: 3, price: 1500 }]
  },
  {
    id: 't4',
    date: '2026-10-09T08:00:00Z',
    type: 'expense',
    amount: 25000,
    description: 'Shop Weekly Electricity & Water (REG / WASAC)',
    category: 'Utilities'
  },
  {
    id: 't5',
    date: '2026-10-08T11:00:00Z',
    type: 'restock',
    amount: 56000,
    description: 'Stock Purchase: Sugar & Flour wholesale',
    category: 'Stock Purchase'
  },
  {
    id: 't6',
    date: '2026-10-07T16:45:00Z',
    type: 'payment_received',
    amount: 10000,
    description: 'Debt payment received from Marie Claire',
    customerId: 'c2',
    customerName: 'Marie Claire Uwase',
    paymentMethod: 'Cash'
  }
];

export const initialSettings: ShopSettings = {
  shopName: 'Musanze Good Hope Mini-Market',
  ownerName: 'Claudine Mukamana',
  phone: '+250 788 555 888',
  address: 'Musanze Taxi Park Road, Northern Province, Rwanda',
  currency: 'RWF',
  lowStockThreshold: 10,
  language: 'en',
  theme: 'light',
  receiptFooter: 'Murakoze cyane! Goods once sold are not returnable.'
};

export const initialHelpArticles: HelpArticle[] = [
  {
    id: 'h1',
    question: {
      en: 'How do I add a new product to inventory?',
      rw: 'Nongeramo gute igicuruzwa gishya mu bubiko?'
    },
    answer: {
      en: 'Go to the Inventory tab from the menu, click the "+ Add New Product" button at the top right, fill in the product name, category, buying price, selling price, and stock quantity, then click Save.',
      rw: 'Jya mu gice cy\'Ibicuruzwa, kanda kuri "+ Ongeramo Igicuruzwa" hejuru iburyo, wandike izina ryacyo, icyiciro, igiciro cyo kugura n\'icyo kugurisha, n\'ingano, hanyuma ubike.'
    },
    category: 'Inventory'
  },
  {
    id: 'h2',
    question: {
      en: 'How do I record a sale on credit (Akabanki)?',
      rw: 'Nandika gute igicuruzwa cyagurishijwe ku nguzanyo (Deni)?'
    },
    answer: {
      en: 'In the Sales (POS) screen, add items to your cart, click Checkout, select "Credit (Akabanki)" as the payment method, choose the customer from your list, and complete the sale. Their debt will automatically update.',
      rw: 'Mu gice cyo Gucuruza (POS), shyira ibicuruzwa mu gatebo, kanda Kwishyura, hitamo "Deni" nk\'uburyo bwo kwishyura, hitamo umukiliya maze urangize. Umwenda wabo uzihita wiyongera.'
    },
    category: 'Sales & POS'
  },
  {
    id: 'h3',
    question: {
      en: 'How do I send a payment reminder to a customer?',
      rw: 'Nohereza gute ubutumwa bwibutsa umukiliya kwishyura umwenda?'
    },
    answer: {
      en: 'Go to the Credit Book tab, find the customer who owes money, and click the "Send WhatsApp / SMS Reminder" button. This will automatically open WhatsApp or SMS with a pre-filled polite message showing the exact amount they owe.',
      rw: 'Jya mu gice cy\'Amadeni, shakisha umukiliya ufite umwenda maze ukande "Ohereza Ubutumwa bwa WhatsApp/SMS". Bizafungura WhatsApp cyangwa ubutumwa bufite amagambo yateguwe yibutsa amafaranga abereyemo iduka.'
    },
    category: 'Credit Management'
  },
  {
    id: 'h4',
    question: {
      en: 'How do I back up or export my shop data?',
      rw: 'Nkuramo gute cyangwa ngo mbike amakuru y\'iduka ryanjye (Backup)?'
    },
    answer: {
      en: 'Go to Settings, scroll down to Data Management, and click "Export Data (CSV)". This downloads a spreadsheet of all your sales, products, and customer records directly to your phone or computer.',
      rw: 'Jya mu Igenamiterere, umanuke ahanditse Gucunga Amakuru, ukande "Kuramo Amakuru (CSV)". Ibi bizakuramo dosiye y\'imbonerahamwe y\'ibicuruzwa n\'igurisha byose muri telefone yawe cyangwa mudasobwa.'
    },
    category: 'Data & Settings'
  },
  {
    id: 'h5',
    question: {
      en: 'How do I switch the app language to Kinyarwanda?',
      rw: 'Nhindura gute ururimi rw\'aplikasiyo rukaba Ikinyarwanda?'
    },
    answer: {
      en: 'Go to Settings, find "Language", and select "Kinyarwanda". All buttons and titles will immediately switch to Kinyarwanda.',
      rw: 'Jya mu Igenamiterere, shakisha "Ururimi", maze uhitemo "Ikinyarwanda". Ibintu byose bizahita bihinduka mu Kinyarwanda.'
    },
    category: 'Data & Settings'
  }
];
