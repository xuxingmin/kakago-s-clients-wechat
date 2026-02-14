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
  tag?: string;
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
  { id: "addr-001", name: "张三", phone: "13888888888", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "蜀山区", districtEn: "Shushan", detail: "天鹅湖CBD·万达广场3号楼15层1502室", detailEn: "Swan Lake CBD, Wanda Plaza B3 15F-1502", latitude: 31.8206, longitude: 117.2272, isDefault: true },
  { id: "addr-002", name: "张三", phone: "13888888888", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "包河区", districtEn: "Baohe", detail: "滨湖新区·银泰城B座2201", detailEn: "Binhu, Yintai Tower B-2201", latitude: 31.7456, longitude: 117.2920, isDefault: false },
  { id: "addr-003", name: "李四", phone: "13999999999", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "庐阳区", districtEn: "Luyang", detail: "淮河路步行街·百盛购物中心3楼", detailEn: "Huaihe Rd, Parkson Center 3F", latitude: 31.8650, longitude: 117.2830, isDefault: false },
  { id: "addr-004", name: "王五", phone: "13777777777", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "瑶海区", districtEn: "Yaohai", detail: "万达茂·星光天地A栋1808", detailEn: "Wanda Mall, Starlight A-1808", latitude: 31.8900, longitude: 117.3500, isDefault: false },
  { id: "addr-005", name: "赵六", phone: "13666666666", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "高新区", districtEn: "Hi-Tech", detail: "创新大道·中科大先研院B区", detailEn: "Innovation Ave, USTC Lab-B", latitude: 31.8300, longitude: 117.1800, isDefault: false },
  { id: "addr-006", name: "孙七", phone: "13555555555", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "经开区", districtEn: "ETDZ", detail: "明珠广场·翡翠湖畔花园6栋", detailEn: "Pearl Plaza, Jade Lake G6", latitude: 31.7800, longitude: 117.2100, isDefault: false },
  { id: "addr-007", name: "周八", phone: "13444444444", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "政务区", districtEn: "Gov Area", detail: "绿地蓝海·国际大厦22层A座", detailEn: "Greenland Intl Tower 22F-A", latitude: 31.8100, longitude: 117.2400, isDefault: false },
  { id: "addr-008", name: "吴九", phone: "13333333333", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "新站区", districtEn: "Xinzhan", detail: "新站利港银河·幸福城12栋", detailEn: "Galaxy Happy City B12", latitude: 31.9100, longitude: 117.3200, isDefault: false },
  { id: "addr-009", name: "郑十", phone: "13222222222", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "滨湖区", districtEn: "Binhu", detail: "融创茂·万达文旅城S3栋", detailEn: "Sunac Mall, Wanda S3", latitude: 31.7200, longitude: 117.3000, isDefault: false },
  { id: "addr-010", name: "冯一一", phone: "13111111111", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "蜀山区", districtEn: "Shushan", detail: "华润万象城·写字楼C座901", detailEn: "CR Mixc, Office C-901", latitude: 31.8400, longitude: 117.2500, isDefault: false },
  { id: "addr-011", name: "陈二二", phone: "13000000000", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "庐阳区", districtEn: "Luyang", detail: "城隍庙·北一环路88号", detailEn: "Chenghuang Temple, N-Ring 88", latitude: 31.8700, longitude: 117.2700, isDefault: false },
  { id: "addr-012", name: "楚三三", phone: "13100000001", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "包河区", districtEn: "Baohe", detail: "合肥南站·高铁商务区D栋", detailEn: "South Station, HSR Biz D", latitude: 31.7500, longitude: 117.3100, isDefault: false },
  { id: "addr-013", name: "韩四四", phone: "13100000002", province: "安徽省", provinceEn: "Anhui", city: "合肥市", cityEn: "Hefei", district: "高新区", districtEn: "Hi-Tech", detail: "蜀西湖·科学城未来塔18层", detailEn: "Shuxi Lake, Sci-City 18F", latitude: 31.8200, longitude: 117.1600, isDefault: false },
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
