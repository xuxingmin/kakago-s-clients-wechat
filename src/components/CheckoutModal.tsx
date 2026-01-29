import { useState } from "react";
import { X, MapPin, Phone, Shield, ChevronRight, Ticket, Plus, Check } from "lucide-react";
import { CouponType } from "./CouponCard";
import { AddressForm } from "./AddressForm";

interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
}

interface Coupon {
  id: string;
  type: CouponType;
  title: string;
  value: number;
  minSpend?: number;
  applicableProducts?: string[];
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    tag: string;
  } | null;
  onConfirm: (productId: string) => void;
}

// Demo addresses
const demoAddresses: Address[] = [
  {
    id: "addr-001",
    name: "张三",
    phone: "13888888888",
    province: "安徽省",
    city: "合肥市",
    district: "蜀山区",
    detail: "天鹅湖CBD · 万达广场3号楼15层1502室",
    isDefault: true,
  },
  {
    id: "addr-002",
    name: "张三",
    phone: "13888888888",
    province: "安徽省",
    city: "合肥市",
    district: "包河区",
    detail: "滨湖新区·银泰城B座2201",
    isDefault: false,
  },
];

// Demo available coupons
const availableCoupons: Coupon[] = [
  {
    id: "coupon-001",
    type: "universal",
    title: "新用户专享礼券",
    value: 15,
  },
  {
    id: "coupon-002",
    type: "americano",
    title: "美式咖啡免单券",
    value: 12,
    applicableProducts: ["hot-americano", "iced-americano"],
  },
];

// WeChat Pay icon component
const WeChatPayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M9.5 4C5.36 4 2 6.69 2 10c0 1.89 1.08 3.56 2.78 4.66L4 17l2.5-1.5c.89.32 1.89.5 2.94.5.17 0 .33 0 .5-.02-.14-.5-.22-1.03-.22-1.58C9.72 10.86 12.58 8 16.22 8c.17 0 .34.01.5.02C16.08 5.69 13.14 4 9.5 4zm-2.25 4a.75.75 0 110-1.5.75.75 0 010 1.5zm4.5 0a.75.75 0 110-1.5.75.75 0 010 1.5z"/>
    <path d="M22 14.4c0-2.65-2.68-4.8-6-4.8s-6 2.15-6 4.8c0 2.65 2.68 4.8 6 4.8.67 0 1.31-.08 1.91-.23L20 20l-.6-1.8c1.02-.86 1.6-2 1.6-3.3zm-7.75-.65a.65.65 0 110-1.3.65.65 0 010 1.3zm3.5 0a.65.65 0 110-1.3.65.65 0 010 1.3z"/>
  </svg>
);

export const CheckoutModal = ({
  isOpen,
  onClose,
  product,
  onConfirm,
}: CheckoutModalProps) => {
  const [showCouponPicker, setShowCouponPicker] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(demoAddresses);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    demoAddresses.find((a) => a.isDefault) || null
  );

  if (!product) return null;

  const fulfillmentFee = 2.10;
  
  // Find applicable coupons for this product
  const applicableCoupons = availableCoupons.filter((coupon) => {
    if (coupon.type === "universal") return true;
    if (coupon.applicableProducts?.includes(product.id)) return true;
    return false;
  });

  // Auto-select best coupon if none selected
  const activeCoupon = selectedCoupon || (applicableCoupons.length > 0 ? applicableCoupons[0] : null);
  
  const discount = activeCoupon ? Math.min(activeCoupon.value, product.price) : 0;
  const subtotal = product.price - discount;
  const totalPrice = subtotal + fulfillmentFee;

  const handlePayment = () => {
    if (!selectedAddress) {
      setShowAddressPicker(true);
      return;
    }
    onConfirm(product.id);
    onClose();
    setSelectedCoupon(null);
    setShowCouponPicker(false);
    setShowAddressPicker(false);
  };

  const handleSelectCoupon = (coupon: Coupon | null) => {
    setSelectedCoupon(coupon);
    setShowCouponPicker(false);
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    setShowAddressPicker(false);
  };

  const handleAddAddress = (newAddress: Omit<Address, "id">) => {
    const address: Address = {
      ...newAddress,
      id: `addr-${Date.now()}`,
    };

    if (address.isDefault) {
      setAddresses((prev) =>
        prev.map((addr) => ({ ...addr, isDefault: false }))
      );
    }

    setAddresses((prev) => [...prev, address]);
    setSelectedAddress(address);
    setShowAddressForm(false);
  };

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Modal - 75% height */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[60] transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "75vh" }}
      >
        <div className="bg-card rounded-t-3xl max-w-md mx-auto h-full flex flex-col safe-bottom overflow-hidden border-t border-white/10">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-4 flex-shrink-0">
            <h2 className="text-lg font-bold text-white">确认订单</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors min-h-[48px]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 space-y-4">
            {/* Delivery Info - Clickable to change address */}
            <button
              onClick={() => setShowAddressPicker(true)}
              className="w-full bg-secondary rounded-2xl p-4 text-left hover:bg-white/10 transition-colors group min-h-[80px]"
            >
              {selectedAddress ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{selectedAddress.name}</span>
                      <span className="text-sm text-white/60">{maskPhone(selectedAddress.phone)}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/60 line-clamp-2">
                      {selectedAddress.province}{selectedAddress.city}{selectedAddress.district} {selectedAddress.detail}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">请添加收货地址</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                </div>
              )}
            </button>

            {/* Trust Badge */}
            <div className="border-2 border-primary/40 bg-primary/10 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">KAKAGO 品质保证</p>
                <p className="text-xs text-white/60 mt-1 leading-relaxed">
                  您的订单将由 KAKAGO 认证精品咖啡师制作，确保每一杯都达到专业标准。
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-secondary rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-white mb-3">订单明细</h3>
              
              {/* Product Item */}
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-card flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{product.name}</p>
                  <p className="text-xs text-white/50">{product.tag}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">¥{product.price.toFixed(2)}</p>
                  <p className="text-xs text-white/50">x1</p>
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">商品金额</span>
                  <span className="text-sm text-white">¥{product.price.toFixed(2)}</span>
                </div>
                
                {/* Coupon Row */}
                <button
                  onClick={() => setShowCouponPicker(true)}
                  className="w-full flex items-center justify-between py-1 min-h-[40px] group"
                >
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-primary" />
                    <span className="text-sm text-white/60">优惠券/代金券</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {activeCoupon ? (
                      <span className="text-sm font-semibold text-primary">
                        -¥{discount.toFixed(2)}
                      </span>
                    ) : applicableCoupons.length > 0 ? (
                      <span className="text-sm text-primary">
                        {applicableCoupons.length}张可用
                      </span>
                    ) : (
                      <span className="text-sm text-white/40">暂无可用</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  </div>
                </button>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">精品履约服务费</span>
                  <span className="text-sm text-white">¥{fulfillmentFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 px-5 py-4 bg-card border-t border-white/10">
            {/* Applied Coupon Badge */}
            {activeCoupon && (
              <div className="flex items-center justify-center gap-2 mb-3 py-2 bg-primary/10 rounded-xl">
                <Ticket className="w-4 h-4 text-primary" />
                <span className="text-xs text-primary font-medium">
                  已使用「{activeCoupon.title}」立减 ¥{discount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-white">合计</span>
              <div className="flex items-baseline gap-2">
                {discount > 0 && (
                  <span className="text-sm text-white/40 line-through">
                    ¥{(product.price + fulfillmentFee).toFixed(2)}
                  </span>
                )}
                <span className="text-2xl font-bold text-primary">¥{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* WeChat Pay Button */}
            <button
              onClick={handlePayment}
              className="w-full py-4 min-h-[56px] rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              style={{ backgroundColor: "#07C160" }}
            >
              <WeChatPayIcon />
              <span>微信支付 ¥{totalPrice.toFixed(2)}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Address Picker Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[60] transition-transform duration-300 ease-out ${
          showAddressPicker ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div 
          className={`fixed inset-0 bg-black/50 transition-opacity ${
            showAddressPicker ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowAddressPicker(false)}
        />
        <div className="relative bg-card rounded-t-3xl max-w-md mx-auto max-h-[70vh] flex flex-col safe-bottom border-t border-white/10">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>
          
          <div className="flex items-center justify-between px-5 pb-4 border-b border-white/10">
            <h3 className="text-base font-semibold text-white">选择收货地址</h3>
            <button
              onClick={() => setShowAddressPicker(false)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center min-h-[48px]"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {addresses.map((address) => (
              <button
                key={address.id}
                onClick={() => handleSelectAddress(address)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[80px] ${
                  selectedAddress?.id === address.id
                    ? "border-primary bg-primary/10"
                    : "border-white/10 hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{address.name}</span>
                      <span className="text-sm text-white/60">{maskPhone(address.phone)}</span>
                      {address.isDefault && (
                        <span className="text-[10px] font-medium text-primary bg-primary/20 px-1.5 py-0.5 rounded">
                          默认
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60 line-clamp-2">
                      {address.province}{address.city}{address.district} {address.detail}
                    </p>
                  </div>
                  {selectedAddress?.id === address.id && (
                    <Check className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
                  )}
                </div>
              </button>
            ))}

            {/* Add New Address Button */}
            <button
              onClick={() => {
                setShowAddressPicker(false);
                setShowAddressForm(true);
              }}
              className="w-full p-4 min-h-[56px] rounded-xl border-2 border-dashed border-primary/50 text-primary font-medium flex items-center justify-center gap-2 hover:bg-primary/10 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>添加新地址</span>
            </button>
          </div>
        </div>
      </div>

      {/* Coupon Picker Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-[60] transition-transform duration-300 ease-out ${
          showCouponPicker ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div 
          className={`fixed inset-0 bg-black/50 transition-opacity ${
            showCouponPicker ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setShowCouponPicker(false)}
        />
        <div className="relative bg-card rounded-t-3xl max-w-md mx-auto max-h-[60vh] flex flex-col safe-bottom border-t border-white/10">
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>
          
          <div className="flex items-center justify-between px-5 pb-4 border-b border-white/10">
            <h3 className="text-base font-semibold text-white">选择优惠券</h3>
            <button
              onClick={() => setShowCouponPicker(false)}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center min-h-[48px]"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* No coupon option */}
            <button
              onClick={() => handleSelectCoupon(null)}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[64px] ${
                !selectedCoupon && !activeCoupon
                  ? "border-primary bg-primary/10"
                  : "border-white/10 hover:border-primary/50"
              }`}
            >
              <p className="text-sm font-medium text-white">不使用优惠券</p>
              <p className="text-xs text-white/50 mt-0.5">原价支付</p>
            </button>

            {applicableCoupons.map((coupon) => (
              <button
                key={coupon.id}
                onClick={() => handleSelectCoupon(coupon)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all min-h-[64px] ${
                  activeCoupon?.id === coupon.id
                    ? "border-primary bg-primary/10"
                    : "border-white/10 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{coupon.title}</p>
                    <p className="text-xs text-white/50 mt-0.5">
                      {coupon.type === "universal" ? "全品类通用" : "限定商品可用"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">-¥{coupon.value}</p>
                  </div>
                </div>
              </button>
            ))}

            {applicableCoupons.length === 0 && (
              <div className="py-8 text-center text-white/50 text-sm">
                暂无可用优惠券
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Form */}
      <AddressForm
        isOpen={showAddressForm}
        onClose={() => setShowAddressForm(false)}
        onSubmit={handleAddAddress}
        mode="add"
      />
    </>
  );
};
