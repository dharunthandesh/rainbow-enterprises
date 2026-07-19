import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  weight?: string;
  created_at?: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  payment_method: string;
  status: 'New' | 'Accepted' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  created_at: string;
  order_items?: OrderItem[];
}

interface AdminOrdersState {
  orders: Order[];
  isLoading: boolean;
  notificationCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  realtimeChannel: any | null;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  subscribeRealtime: () => void;
  unsubscribeRealtime: () => void;
  clearNotifications: () => void;
  getMetrics: () => {
    todayOrders: number;
    revenue: number;
    customersCount: number;
    activeProductsCount: number;
  };
}

export const getMockOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const storedOrders = localStorage.getItem('rainbow-mock-orders');
  const storedItems = localStorage.getItem('rainbow-mock-order-items');
  if (!storedOrders) return [];
  try {
    const parsedOrders = JSON.parse(storedOrders) as Order[];
    const parsedItems = storedItems ? (JSON.parse(storedItems) as OrderItem[]) : [];
    return parsedOrders.map(order => ({
      ...order,
      order_items: parsedItems.filter(item => item.order_id === order.id),
    }));
  } catch {
    return [];
  }
};

export const saveMockOrder = (order: Order) => {
  if (typeof window === 'undefined') return;
  const storedOrders = localStorage.getItem('rainbow-mock-orders');
  const storedItems = localStorage.getItem('rainbow-mock-order-items');
  const existingOrders: Omit<Order, 'order_items'>[] = storedOrders ? JSON.parse(storedOrders) : [];
  const existingItems: OrderItem[] = storedItems ? JSON.parse(storedItems) : [];
  const { order_items, ...orderWithoutItems } = order;
  existingOrders.unshift(orderWithoutItems);
  const newItems = order_items || [];
  localStorage.setItem('rainbow-mock-orders', JSON.stringify(existingOrders));
  localStorage.setItem('rainbow-mock-order-items', JSON.stringify([...newItems, ...existingItems]));
};

export const useAdminOrders = create<AdminOrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  notificationCount: 0,
  realtimeChannel: null,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        set({ orders: (data || []) as Order[] });
      } else {
        const mockOrders = getMockOrders();
        mockOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        set({ orders: mockOrders });
      }
    } catch (error) {
      console.error('Error fetching admin orders:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);
        if (error) throw error;
      } else {
        const storedOrders = localStorage.getItem('rainbow-mock-orders');
        if (storedOrders) {
          const orders = JSON.parse(storedOrders) as Order[];
          const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
          localStorage.setItem('rainbow-mock-orders', JSON.stringify(updated));
        }
      }
      set(state => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o),
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  subscribeRealtime: () => {
    const existingChannel = get().realtimeChannel;
    if (existingChannel) return;

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('admin-orders-realtime')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, async (payload) => {
          const newOrder = payload.new as Order;
          const { data: items } = await supabase.from('order_items').select('*').eq('order_id', newOrder.id);
          const completeOrder: Order = { ...newOrder, order_items: items || [] };
          set(state => {
            if (state.orders.some(o => o.id === completeOrder.id)) return {};
            return { orders: [completeOrder, ...state.orders], notificationCount: state.notificationCount + 1 };
          });
          window.dispatchEvent(new CustomEvent('rainbow-realtime-order', { detail: completeOrder }));
        })
        .subscribe();
      set({ realtimeChannel: channel });
    } else {
      const handleMockNewOrder = (e: Event) => {
        const customEvent = e as CustomEvent<Order>;
        if (customEvent.detail) {
          const newOrder = customEvent.detail;
          set(state => {
            if (state.orders.some(o => o.id === newOrder.id)) return {};
            return { orders: [newOrder, ...state.orders], notificationCount: state.notificationCount + 1 };
          });
          window.dispatchEvent(new CustomEvent('rainbow-realtime-order', { detail: newOrder }));
        }
      };
      window.addEventListener('rainbow-new-order', handleMockNewOrder);
      set({ realtimeChannel: handleMockNewOrder });
    }
  },

  unsubscribeRealtime: () => {
    const channel = get().realtimeChannel;
    if (!channel) return;
    if (isSupabaseConfigured) {
      supabase.removeChannel(channel);
    } else {
      window.removeEventListener('rainbow-new-order', channel);
    }
    set({ realtimeChannel: null });
  },

  clearNotifications: () => set({ notificationCount: 0 }),

  getMetrics: () => {
    const { orders } = get();
    const activeOrders = orders.filter(o => o.status !== 'Cancelled');
    const revenue = activeOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today).length;
    const uniqueEmails = new Set(orders.map(o => o.customer_email.toLowerCase()));
    return { todayOrders, revenue, customersCount: uniqueEmails.size, activeProductsCount: 40 };
  },
}));
