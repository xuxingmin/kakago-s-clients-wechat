import { createContext, useContext, useState, ReactNode } from "react";

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  provinceEn: string;
  city: string;
  cityEn: string;
  district: string;
  districtEn: string;
  detail: string;
  detailEn: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Omit<Address, "id">) => void;
  deleteAddress: (id: string) => void;
  setDefault: (id: string) => void;
}

const initialAddresses: Address[] = [
  {
    id: "addr-001",
    name: "张三",
    phone: "13888888888",
    province: "安徽省",
    provinceEn: "Anhui Province",
    city: "合肥市",
    cityEn: "Hefei City",
    district: "蜀山区",
    districtEn: "Shushan District",
    detail: "天鹅湖CBD · 万达广场3号楼15层1502室",
    detailEn: "Swan Lake CBD · Wanda Plaza Building 3, 15F, Unit 1502",
    latitude: 31.8206,
    longitude: 117.2272,
    isDefault: true,
  },
  {
    id: "addr-002",
    name: "张三",
    phone: "13888888888",
    province: "安徽省",
    provinceEn: "Anhui Province",
    city: "合肥市",
    cityEn: "Hefei City",
    district: "包河区",
    districtEn: "Baohe District",
    detail: "滨湖新区·银泰城B座2201",
    detailEn: "Binhu New District · Yintai City Tower B, Unit 2201",
    latitude: 31.7456,
    longitude: 117.2920,
    isDefault: false,
  },
];

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(
    initialAddresses.find((a) => a.isDefault) || null
  );

  const addAddress = (newAddr: Omit<Address, "id">) => {
    const address: Address = { ...newAddr, id: `addr-${Date.now()}` };
    if (address.isDefault) {
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: false })));
    }
    setAddresses((prev) => [...prev, address]);
    if (address.isDefault || addresses.length === 0) setSelectedAddress(address);
  };

  const updateAddress = (id: string, updated: Omit<Address, "id">) => {
    setAddresses((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...updated, id }
          : updated.isDefault
          ? { ...a, isDefault: false }
          : a
      )
    );
    if (selectedAddress?.id === id) {
      setSelectedAddress({ ...updated, id });
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddress?.id === id) setSelectedAddress(null);
  };

  const setDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    const addr = addresses.find((a) => a.id === id);
    if (addr) setSelectedAddress({ ...addr, isDefault: true });
  };

  return (
    <AddressContext.Provider
      value={{ addresses, selectedAddress, setSelectedAddress, addAddress, updateAddress, deleteAddress, setDefault }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddress must be used within AddressProvider");
  return ctx;
};
