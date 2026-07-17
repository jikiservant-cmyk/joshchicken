'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { Product, CartItem } from '@/types';
import { 
  ShoppingBag, Plus, Minus, X, Trash2, Phone, MapPin, 
  ChefHat, Search, Flame, Sparkles, Clock, Check, 
  Settings, CheckCircle2, MessageSquare, ChevronRight, 
  Sliders, DollarSign, AlertCircle, Info, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SPICINESS_OPTIONS = [
  { name: 'Original Recipe 🍗', desc: 'Mildly seasoned, savory golden crust' },
  { name: 'Spicy/Zinger 🌶️', desc: 'Brined with a cayenne heat kick' },
  { name: 'Double Inferno 🔥🌶️', desc: 'Extreme hot sauce challenge glaze' }
];

const EXTRA_OPTIONS = [
  { name: 'Extra layered Chapati 🫓', price: 2500 },
  { name: 'Extra portion of Pilao Rice 🍚', price: 4000 },
  { name: 'Extra Fried Chicken Piece 🍗', price: 6000 },
  { name: 'Extra Chilli Sauce Dip 🌶️', price: 1000 }
];

const DELIVERY_ZONES = [
  { id: 'nansana', name: 'Nansana & Ku Masitowa', fee: 2000, time: '10-20 mins' },
  { id: 'namungoona_wakiso', name: 'Namungoona & Wakiso', fee: 4000, time: '20-35 mins' },
  { id: 'kira_kasangati', name: 'Kira & Kasangati', fee: 7000, time: '35-50 mins' },
  { id: 'kampala_central', name: 'Kampala Central / Wider Area', fee: 5000, time: '30-45 mins' },
];

const CATEGORY_META = [
  { name: 'All', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Lusaniya', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Buckets', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Combos', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Sides', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=200&h=200&q=80' },
  { name: 'Drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=200&h=200&q=80' }
];

export const formatPrice = (value: number) => {
  return `Shs ${value.toLocaleString()}`;
};

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1600&h=900&q=80', // Platter / Crispy Chicken
  'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1600&h=900&q=80', // Fried Chicken Legs
  'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?auto=format&fit=crop&w=1600&h=900&q=80', // Bucket of crunchy chicken
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1600&h=900&q=80'  // Crispy Chicken with fries
];

export default function Storefront({ initialProducts }: { initialProducts: Product[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryZone, setDeliveryZone] = useState('nansana');
  
  // Customizer Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [chosenSpiciness, setChosenSpiciness] = useState('Original Recipe 🍗');
  const [chosenExtras, setChosenExtras] = useState<{ name: string; price: number }[]>([]);
  const [customizerQuantity, setCustomizerQuantity] = useState(1);

  // WhatsApp Configuration State
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tcp_whatsapp_number') || '256754673529'; // Default Josh Chicken Nansana contact number
    }
    return '256754673529';
  });
  const [showConfig, setShowConfig] = useState(false);

  // Customer checkout details
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const saveWhatsappNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    if (!cleaned) return;
    setWhatsappNumber(cleaned);
    localStorage.setItem('tcp_whatsapp_number', cleaned);
    setShowConfig(false);
  };

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialProducts, activeCategory, searchQuery]);

  // Open customizer or add directly
  const handleAddClick = (product: Product) => {
    if (product.hasSpiciness || product.hasExtras) {
      setSelectedProduct(product);
      setChosenSpiciness('Original Recipe 🍗');
      setChosenExtras([]);
      setCustomizerQuantity(1);
    } else {
      const itemWithNoCustoms: CartItem = {
        id: `${product.id}-direct`,
        product,
        quantity: 1,
        addedPrice: 0
      };
      addToCartWithDetails(itemWithNoCustoms);
    }
  };

  const handleToggleExtra = (extra: { name: string; price: number }) => {
    setChosenExtras(prev => {
      const exists = prev.find(e => e.name === extra.name);
      if (exists) {
        return prev.filter(e => e.name !== extra.name);
      }
      return [...prev, extra];
    });
  };

  const currentCustomizerPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    const extrasPrice = chosenExtras.reduce((sum, item) => sum + item.price, 0);
    return (selectedProduct.price + extrasPrice) * customizerQuantity;
  }, [selectedProduct, chosenExtras, customizerQuantity]);

  const confirmCustomization = () => {
    if (!selectedProduct) return;

    const extrasPrice = chosenExtras.reduce((sum, item) => sum + item.price, 0);
    const extrasKey = chosenExtras.map(e => e.name).sort().join(',');
    const itemUniqueId = `${selectedProduct.id}-${chosenSpiciness}-${extrasKey}`;

    const newCartItem: CartItem = {
      id: itemUniqueId,
      product: selectedProduct,
      quantity: customizerQuantity,
      spiciness: selectedProduct.hasSpiciness ? chosenSpiciness : undefined,
      extras: selectedProduct.hasExtras ? chosenExtras : undefined,
      addedPrice: extrasPrice
    };

    addToCartWithDetails(newCartItem);
    setSelectedProduct(null);
  };

  const addToCartWithDetails = (newItem: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity } : item
        );
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const baseSubtotal = cart.reduce((acc, item) => {
    const itemUnitPrice = item.product.price + item.addedPrice;
    return acc + (itemUnitPrice * item.quantity);
  }, 0);

  const selectedZoneData = DELIVERY_ZONES.find(z => z.id === deliveryZone);
  const deliveryFee = orderType === 'delivery' ? (selectedZoneData?.fee || 2000) : 0;
  const totalPrice = baseSubtotal + deliveryFee;

  const formattedWhatsAppMessage = useMemo(() => {
    if (cart.length === 0) return '';
    let message = `*🔴 JOSH CHICKEN NANSANA ORDER 🔴*\n`;
    message += `*Good Food, Good Mood! 🐔*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Fulfillment:* ${orderType.toUpperCase()}\n`;
    if (orderType === 'delivery' && selectedZoneData) {
      message += `*Delivery Zone:* ${selectedZoneData.name}\n`;
      message += `*Est. Time:* ${selectedZoneData.time}\n`;
    }
    message += `*Time:* ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    cart.forEach((item, idx) => {
      const unitTotal = item.product.price + item.addedPrice;
      message += `*${idx + 1}. ${item.quantity}x ${item.product.name}*\n`;
      if (item.spiciness) {
        message += `   • Heat: ${item.spiciness}\n`;
      }
      if (item.extras && item.extras.length > 0) {
        message += `   • Extras: ${item.extras.map(e => e.name).join(', ')}\n`;
      }
      message += `   • Price: Shs ${(unitTotal * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `*Subtotal:* Shs ${baseSubtotal.toLocaleString()}\n`;
    if (orderType === 'delivery') {
      message += `*Delivery Fee:* Shs ${deliveryFee.toLocaleString()}\n`;
    }
    message += `*🔥 TOTAL ESTIMATE: Shs ${totalPrice.toLocaleString()}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `• *Name:* ${customerName || 'Pending'}\n`;
    message += `• *Address/Location:* ${customerAddress || 'Pending'}\n`;
    if (orderNotes) {
      message += `• *Kitchen/No-Pilao Notes:* ${orderNotes}\n`;
    }
    message += `\n🐔 _Order submitted via Josh Chicken Nansana Web_`;
    return message;
  }, [cart, baseSubtotal, deliveryFee, totalPrice, orderType, selectedZoneData, customerName, customerAddress, orderNotes]);

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!customerName || !customerAddress) {
      alert('Please fill out your name and address details first!');
      return;
    }

    const encodedMessage = encodeURIComponent(formattedWhatsAppMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col text-neutral-800 font-sans selection:bg-red-50 selection:text-red-950 pb-20 md:pb-0">
      
      {/* Top Banner Status Bar - Styled like Squarespace announcement bar */}
      <div className="bg-[#202124] text-[#FAFAFA] text-xs py-3 px-4 relative z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="flex items-center gap-2 font-heading tracking-wide uppercase font-bold text-[11px]">
            <Clock size={13} className="text-red-500" />
            Open Daily: 11am – 11pm | Home of the TikTok-Viral Lusaniya Platter 🏆
          </span>
          <button 
            onClick={() => setShowConfig(true)}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors bg-white/10 px-2.5 py-1 rounded border border-white/5 text-[11px]"
          >
            <Settings size={11} className="text-red-500" />
            Config WhatsApp: +{whatsappNumber}
          </button>
        </div>
      </div>

      {/* WhatsApp Merchant Settings Modal */}
      <AnimatePresence>
        {showConfig && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-none p-8 max-w-sm w-full shadow-2xl border border-neutral-100"
            >
              <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-neutral-900 mb-4">
                <Settings size={22} />
              </div>
              <h3 className="font-heading text-lg font-bold text-neutral-950 mb-1 uppercase tracking-wider">
                Store Settings
              </h3>
              <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
                Configure the WhatsApp business number that receives live customer orders directly. Include the country code.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">WhatsApp Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 256754673529"
                    defaultValue={whatsappNumber}
                    id="merchant_num_input"
                    className="w-full px-4 py-3 border border-neutral-200 rounded-none text-sm font-mono focus:outline-none focus:ring-1 focus:ring-neutral-950"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 mt-6">
                <button 
                  onClick={() => setShowConfig(false)}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 rounded-none text-neutral-700 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const el = document.getElementById('merchant_num_input') as HTMLInputElement;
                    if (el) saveWhatsappNumber(el.value);
                  }}
                  className="flex-1 py-3 bg-neutral-950 hover:bg-neutral-900 text-white rounded-none text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Save Number
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom styled Header as requested */}
      <header className={`custom-header ${isScrolled ? 'scrolled-header' : ''}`}>
        <nav className="wrap">
          <div className="logo-container">
            <div className="logo-icon">🐔</div>
            <div className="logo-text">
              <div className="logo-josh"><span className="bounce-3">J</span><span className="bounce-1">o</span>s<span className="bounce-4">h</span></div>
              <div className="logo-chicken">Ch<span className="bounce-2">i</span>ck<span className="bounce-5">e</span>n</div>
            </div>
          </div>
          <div className={`navlinks transition-all duration-300 origin-right ${isScrolled ? 'opacity-0 scale-x-0 w-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100 scale-x-100'}`}>
            <a href="#limited-offers">Hot Offers</a>
            <a href="#menu-hub">Our Menu</a>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-1 cursor-pointer focus:outline-none text-[#FAFAFA]"
            >
              My Basket
              {totalItems > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-red-600 text-[#FAFAFA] rounded-full text-[9px] font-mono leading-none">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
          <a className={`navcall transition-all duration-300 origin-right ${isScrolled ? 'opacity-0 scale-x-0 w-0 h-0 overflow-hidden pointer-events-none' : 'opacity-100 scale-x-100'}`} href="tel:+256754673529">+256 754 673529</a>
        </nav>
      </header>

      {/* Squarespace FoodHub Intro Banner */}
      <section className="relative w-full h-[320px] md:h-[420px] overflow-hidden bg-neutral-900 flex items-center justify-center">
        <div className="absolute inset-0">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentHeroIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={HERO_IMAGES[currentHeroIndex]}
                alt="Josh Chicken Nansana Gourmet Crispy Fried Chicken Banner"
                fill
                className="object-cover object-center"
                priority
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 pointer-events-none"></div>
        
        {/* Slideshow dots indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                currentHeroIndex === index 
                  ? 'bg-[#e5a93b] w-6' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative text-center max-w-2xl px-6 space-y-4 z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#e5a93b] font-black bg-[#221d18]/80 px-3.5 py-1.5 rounded-full border border-[#e5a93b]/20">
              📍 Ku Masitowa, Nansana (Hoima Road)
            </span>
          </motion.div>
          <p className="text-xs md:text-base text-neutral-100 tracking-wide font-light max-w-lg mx-auto leading-relaxed">
            {"\"Good Food, Good Mood!\" Home of the legendary "} <strong className="text-white font-semibold">TikTok-Viral Lusaniya Platter</strong>. {"Fast takeaway & dispatch station built for elite local flavors and high-volume delivery."}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <a 
              href="#menu-hub" 
              className="px-6 py-3 bg-[#e5a93b] hover:bg-[#c02424] text-[#1a1612] hover:text-[#fafafa] font-heading font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-1"
            >
              Explore Menu
            </a>
            <a 
              href="tel:+256754673529" 
              className="px-6 py-3 border border-white hover:bg-white hover:text-[#1a1612] text-white font-heading font-bold text-xs uppercase tracking-widest transition-all duration-200 hover:-translate-y-1"
            >
              Call to Order
            </a>
          </div>
        </motion.div>
      </section>

      {/* Category Tabs Styled with FoodHub Circular Image Selectors */}
      <section className="py-12 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-6 font-bold">Select Eatery Category</p>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {}
            }}
            className="flex justify-center items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar pb-2"
          >
            {CATEGORY_META.map((cat, i) => {
              const isActive = activeCategory === cat.name;
              return (
                <motion.button
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className="flex flex-col items-center gap-3 shrink-0 focus:outline-none group"
                >
                  <div className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-red-600 scale-105 shadow-md shadow-red-600/10' 
                      : 'border-neutral-200 group-hover:border-neutral-400'
                  }`}>
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <span className={`text-[11px] font-heading font-bold uppercase tracking-widest transition-colors ${
                    isActive ? 'text-red-600' : 'text-neutral-500 group-hover:text-neutral-900'
                  }`}>
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Main Interactive Menu Grid */}
      <main id="menu-hub" className="flex-1 container mx-auto px-6 py-16 max-w-6xl">
        
        {/* Menu Section Title with Double Thin Lines (Squarespace Aesthetic) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center max-w-md mx-auto mb-16 space-y-2"
        >
          <div className="w-12 h-[1px] bg-red-600 mx-auto"></div>
          <h3 className="font-heading text-2xl md:text-3xl font-black text-neutral-900 tracking-widest uppercase">
            {activeCategory} SELECTION
          </h3>
          <p className="text-xs text-neutral-400 tracking-wider">Premium brined golden recipe, made fresh daily</p>
          <div className="w-12 h-[1px] bg-red-600 mx-auto pt-1"></div>
        </motion.div>

        {/* Product Cards Grid */}
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-white rounded-none border border-neutral-100 p-8"
            >
              <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-300">
                <Search size={20} />
              </div>
              <h4 className="font-heading font-bold text-sm text-neutral-950 uppercase tracking-widest">No products matched</h4>
              <p className="text-[11px] text-neutral-400 mt-1 tracking-wider">Adjust your filters or query to explore our dishes.</p>
              <button 
                onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
                className="mt-6 px-6 py-3 border border-neutral-900 text-neutral-950 font-heading font-bold text-xs uppercase rounded-none hover:bg-neutral-950 hover:text-white transition-colors"
              >
                Reset Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {}
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              {filteredProducts.map((product) => {
                const isCustomizable = product.hasSpiciness || product.hasExtras;
                
                return (
                  <motion.div
                    key={product.id}
                    layoutId={`prod-card-${product.id}`}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
                    }}
                    className="flex flex-col sm:flex-row gap-6 bg-white p-5 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 group"
                  >
                    {/* Left: Product Image */}
                    <div className="relative w-full sm:w-44 aspect-[4/3] sm:aspect-square bg-neutral-100 overflow-hidden shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transform group-hover:scale-[1.02] transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 176px"
                        referrerPolicy="no-referrer"
                      />
                      {product.hasSpiciness && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[8px] font-bold font-mono px-2 py-0.5 uppercase tracking-widest">
                          🌶️ SPICY
                        </div>
                      )}
                    </div>
                    
                    {/* Right: Content details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline gap-4">
                          <h4 className="font-heading text-base font-extrabold text-neutral-950 uppercase tracking-wider group-hover:text-red-600 transition-colors">
                            {product.name}
                          </h4>
                          <span className="font-mono font-bold text-red-600 text-sm">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">
                          {product.description}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => handleAddClick(product)}
                        className={`mt-4 sm:mt-0 w-full sm:w-auto self-start px-5 py-3 font-heading font-bold text-[10px] uppercase tracking-widest border transition-all duration-200 ${
                          isCustomizable 
                            ? 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-300 hover:border-neutral-900'
                            : 'bg-neutral-950 hover:bg-neutral-900 text-white border-neutral-950'
                        }`}
                      >
                        {isCustomizable ? 'Customize & Add' : 'Add to Basket'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* TikTok Viral Corner & Delivery Zone Estimator */}
      <section className="bg-neutral-100 border-t border-b border-neutral-200 py-16 overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center max-w-xl mx-auto mb-12 space-y-3"
          >
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#e5a93b] font-black bg-neutral-900 px-3 py-1 rounded">
              🎬 TikTok Viral Help Corner
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-black text-neutral-950 uppercase tracking-wider">
              Comment Section FAQs & Delivery Zones
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed font-light">
              {"We've seen your TikTok comments! Here are instant answers to our most popular questions, plus an interactive delivery fee estimator."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Interactive Delivery Zone Fee Estimator */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="lg:col-span-5 bg-white border border-neutral-200 p-6 md:p-8 shadow-sm"
            >
              <h4 className="font-heading text-xs font-black uppercase tracking-wider text-neutral-950 mb-1 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping inline-block"></span>
                Delivery Fee & Time Estimator
              </h4>
              <p className="text-[11px] text-neutral-400 font-light mb-6">
                Calculate exactly how much delivery costs to your neighborhood.
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="zone-estimator" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                    Select Your Area / Zone
                  </label>
                  <select
                    id="zone-estimator"
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-none text-xs focus:ring-1 focus:ring-neutral-950 outline-none font-medium text-neutral-800"
                  >
                    {DELIVERY_ZONES.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px] font-bold">Estimated Delivery Cost:</span>
                    <span className="font-mono font-black text-red-600 text-sm">
                      {formatPrice(DELIVERY_ZONES.find(z => z.id === deliveryZone)?.fee || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-neutral-200/60">
                    <span className="text-neutral-400 uppercase tracking-wider text-[10px] font-bold">Estimated Dispatch Time:</span>
                    <span className="font-bold text-neutral-800 text-[11px]">
                      ⏱️ {DELIVERY_ZONES.find(z => z.id === deliveryZone)?.time}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 leading-normal font-light">
                  💡 <strong>Tip:</strong> This delivery fee is automatically applied to your checkout subtotal when you place an order in the <em>My Basket</em> panel.
                </p>
              </div>
            </motion.div>

            {/* Right Column: TikTok comment FAQs */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={{
                visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } },
                hidden: {}
              }}
              className="lg:col-span-7 space-y-4"
            >
              
              {/* FAQ 1 */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="bg-white border border-neutral-200 p-5"
              >
                <div className="flex gap-3 items-start">
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 font-mono rounded shrink-0">@User</span>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800 italic">{"\"How much is delivery to Kira?\""}</h5>
                    <p className="text-xs text-neutral-500 mt-2 font-light leading-relaxed">
                      {"Delivery to "} <strong className="text-neutral-800 font-semibold">Kira & Kasangati</strong> {" is flat-rate "} <strong className="text-neutral-800 font-semibold">Shs 7,000</strong>. {"Delivery to Namungoona/Wakiso is Shs 4,000, and Nansana local delivery is just Shs 2,000!"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* FAQ 2 */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="bg-white border border-neutral-200 p-5"
              >
                <div className="flex gap-3 items-start">
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 font-mono rounded shrink-0">@User</span>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800 italic">{"\"Can I get the 30k Combo without pilao rice?\""}</h5>
                    <p className="text-xs text-neutral-500 mt-2 font-light leading-relaxed">
                      {"Yes! You can customize any platter. When checking out your basket, simply write "} <strong className="text-neutral-800 font-semibold">{"\"No Pilao, substitute with Extra Fries\""}</strong> {" in the "} <em className="text-red-600 font-medium">Kitchen Notes</em> {" box, and our kitchen team will swap it out instantly."}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* FAQ 3 */}
              <motion.div 
                variants={{
                  hidden: { opacity: 0, x: 30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                className="bg-white border border-neutral-200 p-5"
              >
                <div className="flex gap-3 items-start">
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 font-mono rounded shrink-0">@User</span>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-800 italic">{"\"What happens if your phone lines are busy?\""}</h5>
                    <p className="text-xs text-neutral-500 mt-2 font-light leading-relaxed">
                      {"During peak TikTok hype, our phone lines occasionally experience drops. We built this website as a reliable backup channel! Build your basket here, hit \"Order via WhatsApp\", and it automatically drafts a complete ticket directly to our dispatcher's WhatsApp inbox!"}
                    </p>
                  </div>
                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* Squarespace-inspired Footer with exact typography */}
      <footer className="bg-[#202124] text-neutral-400 py-20 border-t border-neutral-900 overflow-hidden">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
            hidden: {}
          }}
          className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-12 text-left"
        >
          
          {/* Column 1: Opening Hours */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="md:col-span-5 space-y-4"
          >
            <h1 className="text-[#FAFAFA] font-heading text-3xl font-extrabold uppercase tracking-widest">Open Daily</h1>
            <div className="space-y-2 text-xs md:text-sm tracking-wide text-neutral-300 leading-relaxed font-light">
              <p className="text-[#e5a93b] font-bold uppercase tracking-wider">Josh Chicken Nansana</p>
              <p>11:00 AM – 11:00 PM Monday to Sunday</p>
              <p className="text-neutral-500 pt-2 italic">{"\"Good Food, Good Mood!\" Serving Ku Masitowa & surrounding Kampala neighborhoods."}</p>
            </div>
          </motion.div>

          {/* Column 2: Spacer */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* Column 3: Contact details */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="md:col-span-5 space-y-4"
          >
            <h4 className="text-[#FAFAFA] font-heading text-xl font-bold uppercase tracking-wider">Ku Masitowa</h4>
            <div className="space-y-2 text-xs md:text-sm tracking-wide text-neutral-300 font-light">
              <p>Nansana (Hoima Road), Kampala,</p>
              <p>Uganda</p>
              <div className="pt-2 space-y-1">
                <p className="text-xs text-neutral-500 uppercase font-mono tracking-widest">Order Hotline Support:</p>
                <a href="tel:+256754673529" className="block text-[#e5a93b] hover:underline font-mono font-bold">0754 673 529 (Airtel Dispatch)</a>
                <a href="tel:+256788398459" className="block text-[#e5a93b] hover:underline font-mono font-bold">0788 398 459 (MTN Dispatch)</a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <div className="container mx-auto px-6 max-w-6xl mt-16 pt-8 border-t border-neutral-800/40 text-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Josh Chicken Nansana. All Rights Reserved. Delivered with high-speed dispatch.
        </div>
      </footer>

      {/* Gourmet Customizer Modal Dialog */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-none overflow-hidden max-w-lg w-full shadow-2xl border border-neutral-200 flex flex-col max-h-[85vh]"
            >
              {/* Cover Image Header */}
              <div className="relative h-44 w-full bg-neutral-100 shrink-0">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 p-2 bg-neutral-900 text-white rounded-full transition-colors backdrop-blur-sm"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Customization Details */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <span className="text-[9px] font-bold font-mono bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-none uppercase tracking-widest">
                    Custom Setup
                  </span>
                  <h3 className="font-heading text-xl font-bold text-neutral-950 uppercase mt-2 tracking-wider leading-tight">{selectedProduct.name}</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed font-light">{selectedProduct.description}</p>
                </div>

                {/* Spiciness Level Option */}
                {selectedProduct.hasSpiciness && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                      <Flame size={12} className="text-red-500 fill-red-500" />
                      Recipe Heat Level
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {SPICINESS_OPTIONS.map((opt) => {
                        const isChosen = chosenSpiciness === opt.name;
                        return (
                          <button
                            key={opt.name}
                            type="button"
                            onClick={() => setChosenSpiciness(opt.name)}
                            className={`flex justify-between items-center p-4 rounded-none border text-left transition-all ${
                              isChosen 
                                ? 'bg-red-50/10 border-red-600 ring-1 ring-red-600' 
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold text-neutral-800 uppercase font-heading tracking-wide">{opt.name}</div>
                              <div className="text-[10px] text-neutral-400 mt-0.5 font-light">{opt.desc}</div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isChosen ? 'bg-red-600 border-red-600 text-white' : 'border-neutral-300'
                            }`}>
                              {isChosen && <Check size={10} className="stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Extras Option */}
                {selectedProduct.hasExtras && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                      Select Extras (Optional)
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {EXTRA_OPTIONS.map((extra) => {
                        const isChosen = !!chosenExtras.find(e => e.name === extra.name);
                        return (
                          <button
                            key={extra.name}
                            type="button"
                            onClick={() => handleToggleExtra(extra)}
                            className={`flex justify-between items-center px-4 py-4 rounded-none border text-left text-xs font-medium transition-all ${
                              isChosen 
                                ? 'bg-red-50/10 border-red-500' 
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <span className="text-neutral-700 tracking-wide">{extra.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-red-600 font-bold">+{formatPrice(extra.price)}</span>
                              <div className={`w-4 h-4 rounded-none border flex items-center justify-center shrink-0 ${
                                isChosen ? 'bg-neutral-950 border-neutral-950 text-white' : 'border-neutral-300'
                              }`}>
                                {isChosen && <Check size={10} className="stroke-[3]" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Customizer Footer */}
              <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-none p-1 shrink-0">
                  <button
                    onClick={() => setCustomizerQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-none text-neutral-600 active:scale-95 transition-all"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-mono font-bold text-sm text-neutral-800">{customizerQuantity}</span>
                  <button
                    onClick={() => setCustomizerQuantity(prev => prev + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-none text-neutral-600 active:scale-95 transition-all"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={confirmCustomization}
                  className="flex-1 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-white font-heading font-bold text-xs uppercase tracking-widest rounded-none shadow-lg active:scale-[0.98] transition-all"
                >
                  Add Basket — {formatPrice(currentCustomizerPrice)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide-over Checkout Basket Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-neutral-950/60 z-50 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col h-full border-l border-neutral-200"
            >
              {/* Basket Drawer Header */}
              <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50 shrink-0">
                <div>
                  <h2 className="font-heading text-lg font-bold text-neutral-900 flex items-center gap-2 uppercase tracking-widest">
                    <ShoppingBag size={18} className="text-red-600" />
                    My Basket
                  </h2>
                  <p className="text-[10px] font-mono text-neutral-400 uppercase mt-0.5 tracking-wider font-semibold">Live WhatsApp Order Portal</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400">
                  <div className="w-16 h-16 bg-[#FAFAFA] border border-neutral-100 rounded-full flex items-center justify-center mb-5">
                    <ShoppingBag size={28} className="text-neutral-300" />
                  </div>
                  <p className="text-sm font-bold text-neutral-800 uppercase font-heading tracking-wider">Basket is empty</p>
                  <p className="text-xs text-neutral-400 max-w-[240px] leading-relaxed mt-1 font-light">Select from our iconic original recipe combos or hot buckets to get started.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 px-6 py-3 border border-neutral-950 text-neutral-950 hover:bg-neutral-950 hover:text-white font-heading font-bold text-xs uppercase rounded-none transition-colors"
                  >
                    View Menu
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    
                    {/* Itemized Selection Lists */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Selections</h4>
                      
                      <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                          {cart.map((item) => {
                            const unitTotal = item.product.price + item.addedPrice;
                            return (
                              <motion.div 
                                key={item.id} 
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                className="flex gap-4 p-4 rounded-none bg-[#FAFAFA] border border-neutral-200/50"
                              >
                                <div className="relative w-16 h-16 bg-neutral-100 shrink-0 border border-neutral-200">
                                  <Image
                                    src={item.product.image}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-center min-w-0">
                                  <h5 className="font-heading font-bold text-neutral-900 truncate leading-snug text-xs uppercase tracking-wider">{item.product.name}</h5>
                                  
                                  {/* Selection Choice Metadata Badge tags */}
                                  {(item.spiciness || (item.extras && item.extras.length > 0)) && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.spiciness && (
                                        <span className="text-[8px] font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded-none border border-red-100">
                                          {item.spiciness}
                                        </span>
                                      )}
                                      {item.extras?.map(e => (
                                        <span key={e.name} className="text-[8px] font-medium bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-none border border-neutral-200">
                                          +{e.name}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <p className="font-mono font-bold text-red-600 text-xs mt-1.5">{formatPrice(unitTotal * item.quantity)}</p>
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center bg-white border border-neutral-200 rounded-none p-0.5">
                                      <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-neutral-950 transition-all rounded"
                                      >
                                        <Minus size={10} />
                                      </button>
                                      <span className="w-6 text-center text-xs font-mono font-bold text-neutral-800">{item.quantity}</span>
                                      <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-neutral-950 transition-all rounded"
                                      >
                                        <Plus size={10} />
                                      </button>
                                    </div>
                                    
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="text-[10px] font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-0.5 transition-colors"
                                    >
                                      <Trash2 size={11} /> Remove
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Customer Info Form */}
                    <div className="pt-6 border-t border-neutral-100">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4 font-heading">Fulfillment & Delivery Details</h4>
                      <form id="checkout-form" onSubmit={handleWhatsAppCheckout} className="space-y-4">
                        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 border border-neutral-200 rounded-none mb-2">
                          <button
                            type="button"
                            onClick={() => setOrderType('delivery')}
                            className={`py-2 text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                              orderType === 'delivery' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                          >
                            🚴 Delivery
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrderType('pickup')}
                            className={`py-2 text-[10px] font-bold uppercase tracking-wider text-center transition-all ${
                              orderType === 'pickup' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-neutral-600'
                            }`}
                          >
                            🥡 Takeaway
                          </button>
                        </div>

                        <div>
                          <label htmlFor="cust_name" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            id="cust_name"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-none text-xs focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 outline-none transition-all"
                            placeholder="John Doe"
                          />
                        </div>

                        {orderType === 'delivery' && (
                          <div>
                            <label htmlFor="cust_zone" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Select Delivery Zone *</label>
                            <select
                              id="cust_zone"
                              value={deliveryZone}
                              onChange={(e) => setDeliveryZone(e.target.value)}
                              className="w-full px-4 py-2.5 border border-neutral-200 bg-white rounded-none text-xs focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 outline-none transition-all"
                            >
                              {DELIVERY_ZONES.map(zone => (
                                <option key={zone.id} value={zone.id}>
                                  {zone.name} ({formatPrice(zone.fee)})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div>
                          <label htmlFor="cust_address" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                            {orderType === 'delivery' ? 'Exact Delivery Address *' : 'Collection / Pickup Point *'}
                          </label>
                          <input
                            type="text"
                            id="cust_address"
                            required
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-none text-xs focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 outline-none transition-all"
                            placeholder={orderType === 'delivery' ? "e.g. Ku Masitowa, Nansana, Plot 45" : "e.g. Collection from Nansana Station"}
                          />
                        </div>

                        <div>
                          <label htmlFor="cust_notes" className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">{"Kitchen & Swaps (e.g. \"No Pilao\")"}</label>
                          <textarea
                            id="cust_notes"
                            rows={2}
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            className="w-full px-4 py-2.5 border border-neutral-200 rounded-none text-xs focus:ring-1 focus:ring-neutral-950 focus:border-neutral-950 outline-none transition-all resize-none"
                            placeholder='e.g. "No pilao, swap for extra crispy fries please", "extra chili glaze"'
                          />
                        </div>
                      </form>
                    </div>

                    {/* WhatsApp receipt preview mockup - premium FoodHub feature */}
                    <div className="pt-6 border-t border-neutral-100">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Message Preview</h4>
                        <span className="text-[9px] font-mono bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded">WhatsApp Format</span>
                      </div>
                      <div className="bg-[#E5DDD5]/50 rounded-none p-4 border border-neutral-200 font-mono text-[10px] text-neutral-800 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed relative shadow-inner">
                        {formattedWhatsAppMessage}
                        <div className="sticky bottom-0 right-0 left-0 text-center bg-gradient-to-t from-white to-transparent py-2 pt-6 pointer-events-none text-[9px] font-sans font-bold text-neutral-500">
                          Ready to dispatch to +{whatsappNumber}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Cart Total & Checkout buttons */}
                  <div className="p-6 border-t border-neutral-100 bg-neutral-50 shrink-0 shadow-lg">
                    <div className="flex justify-between items-center mb-5">
                      <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">Total Est. Price</span>
                      <span className="text-xl font-black text-neutral-950 font-mono">{formatPrice(totalPrice)}</span>
                    </div>
                    <button
                      type="submit"
                      form="checkout-form"
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-heading font-black py-4 px-4 rounded-none shadow-md transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                    >
                      Order via WhatsApp
                    </button>
                    <p className="text-[10px] text-center text-neutral-400 mt-3 font-light">
                      This will redirect you to WhatsApp with your compiled kitchen dispatch ticket.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
